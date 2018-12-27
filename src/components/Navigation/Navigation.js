// CSS styling
import "./navigation.css";
// data helpers
import {
    DisplayArtifactToOntology,
    ontologyToDisplayKey,
    ontologyToID,
} from "../../data-stores/DisplayArtifactModel";
// functions to get nodes + links
import {
    addNode,
    initializeGraph,
    initializeNodeCategories,
} from "../NexusGraph/NexusGraphModel";
// subcomponents of the navigator
import MapView from "../MapView/MapView";
import NavigatorComponent from "./NavigatorComponent";
import NexusGraph from "../NexusGraph/NexusGraph";
import SearchComponent from "./SearchComponent";
// react functionality
import React from "react";
// prop validation
import PropTypes from "prop-types";
// redux imports
import {bindActionCreators} from "redux";
import * as navigatorActions from "../../actions/navigatorActions";
import * as tabViewerActions from "../../actions/tabViewerActions";
import * as searchActions from "../../actions/searchActions"
import connect from "react-redux/es/connect/connect";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // start at the data navigator
            "displayLabel": "Data Navigator",
            // start with the sliders hidden
            "fromSelect": false,
            "toSelect": false,
            "timeFilterLoad": false,
        };
        // ref to the map for updating
        this.map = React.createRef();
        // bind functions so that they can be used as callbacks
        this.timeInputClickHandler = this.timeInputClickHandler.bind(this);
        this.timeInputEnd = this.timeInputEnd.bind(this);
    }

    componentDidMount(){
        setTimeout(this.setState({timeFilterLoad:true}), 1000)
        // this.setState({timeFilterLoad:true});
    }
    /**
     * Display a list of items
     * @param {Array} list Items to display
     * @returns {Array} Array of formatted JSX elements
     */
    displayList(list) {
        // return a list of the elements
        return list.map((item) => {
            // ontology of the current item
            const displayOntology = DisplayArtifactToOntology(item),
                // display name of the artifact
                displayName = item[ontologyToDisplayKey[displayOntology]],
                // id of the artifact
                id = item[ontologyToID[displayOntology]];
            // image shown next to the name of the display artifact
            let image = null;
            switch (displayOntology) {
                case "Stories":
                    // for stories, get the chat bubble icon
                    image = (<img
                        className="convo-icon"
                        src={require("./icons8-chat-filled-32.png")}
                        alt="story" />);
                    break;
                case "People":
                    // for people, get the generic portrait icon
                    image = (<img
                        className="person-icon"
                        src={require("./icons8-contacts-32.png")}
                        alt="person" />);
                    break;
                case "Places":
                    // for places, get the pin marker icon
                    image = (<img
                        className="location-icon"
                        src={require("./icons8-marker-32.png")}
                        alt="location" />);
                    break;
                case "Fieldtrips":
                    // for fieldtrips, get the map with an x icon
                    image = <img
                        className="fieldtrip-icon"
                        src={require("./icons8-waypoint-map-32.png")}
                        alt="fieldtrip" />;
                    break;
                default:
                    // bad ontology, warn this
                    console.warn(`Unhandled ontology type: ${displayOntology}`);
                    // don't render an element for it
                    return null;
            }
            // return a list element
            return (<li
                // key for React
                key={displayOntology + id}
                // on click, do all the processing necessary when loading this item
                onClick={() => {
                    this.handleIDQuery(id, displayName, displayOntology, item);
                }}>
                {/* put our desired image on the left of the item */}
                {image}
                {/* put the item's name right after that */}
                {displayName}
            </li>);
        });
    }

    /**
     * Handler for when an artifact wants to be retrieved
     * @param {*} id ID of the artifact
     * @param {*} name Display name of the artifact
     * @param {*} type Ontology of the artifact
     * @param {*} item The artifact
     */
    handleIDQuery(id, name, type, item) {
        // add node to network graph
        addNode(id, name, type, item);
        // open up the artifact's tab
        this.props.actions.addTab(id, name, type);
    }

    /**
     * Enable a specified input
     * @param {Event} event Event containing the toggled input's name
     */
    timeInputClickHandler({"target": {name}}) {
        this.setState({
            [name === "toYear" ? "toSelect" : "fromSelect"]: true,
        });
    }

    /**
     * Disable a specified input
     * @param {Event} event Event containing the toggled input's name
     */
    timeInputEnd({"target": {name}}) {
        this.setState({
            [name === "toYear" ? "toSelect" : "fromSelect"]: false,
        });
    }

    /**
     * Set the banner indicating the current path
     * @param {String} label The current path to display
     */
    setDisplayLabel(label) {
        this.setState({
            "displayLabel": label,
        });
    }

    renderTimeSwitch(timeFilterHandler, timeFilterOn){
        return <div
            className="medium-2 small-2 small-offset-0 medium-offset-0 large-offset-1 cell switch">
            <input
                className="switch-input"
                id="exampleSwitch"
                type="checkbox"
                checked={timeFilterOn}
                name="timelineFilter"
                onChange={timeFilterHandler}
                // onClick={timeFilterHandler}
            />
            <label className="switch-paddle" htmlFor="exampleSwitch">
                <br />
                <span id="timelineText">Timeline</span>
                <span className="show-for-sr">Enable Timeline</span>
            </label>
        </div>;
    }

    render() {
        // get relevant stuff from redux + props (object destructuring)
        const {
            "actions": {addTab, timeFilterHandler},
            "navigatorState": {displayList, fromDate, placeList, timeFilterOn, toDate},
            "searchState": {searchingState},
        } = this.props;
        // console.log(placeList);
        // variable to store the main, center display
        let toDisplay;
        // based on what is currently being viewed
        switch (this.state.displayLabel) {
            // if the user is viewing the ETK Index but hasn't selected anything yet
            case "Topic & Index Navigator > ETK Index":
                // render a hint to select an ETK index
                toDisplay = (<div className="hintText">
                    Select an ETK index from the left to get started!
                </div>);
                break;
            // if the user is viewing the Tango Index but hasn't selected anything yet
            case "Topic & Index Navigator > Tangherlini Index":
                // render a hint to select a tango index
                toDisplay = (<div className="hintText">
                    Select a class from the left to get started!
                </div>);
                break;
            // if the user is viewing the genres but hasn't selected anything yet
            case "Topic & Index Navigator > Genres":
                // render a hint to select a genre
                toDisplay = (<div className="hintText">
                    Select a genre from the left to get started!
                </div>);
                break;
            // for anything else
            default:
                // just render what is normally wanted
                toDisplay = this.displayList(displayList);
                break;
        }
        return (
            <div className="Navigation grid-x grid-padding-x">
                <div className="medium-3 cell dataNavigation">
                    <SearchComponent />
                    <NavigatorComponent setDisplayLabel={this.setDisplayLabel.bind(this)} />
                </div>
                <div
                    onClick={(e)=> {e.preventDefault(); this.props.actions.setSearch(false)}}
                    className="medium-5 cell AssociatedStoriesViewer grid-y fillScreen">
                    {/*Time Filter*/}
                    {this.state.timeFilterLoad && <form
                        className="cell medium-2 small-1 time-filter grid-x">
                        {/*insert time flip switch*/}
                        {this.renderTimeSwitch.bind(this)(timeFilterHandler, timeFilterOn)}
                        <b className="medium-2 medium-offset-1 large-2 large-offset-0 cell text top-padding">From:</b>
                        <div className="medium-2 large-2 cell top-padding">
                            <input
                                className="year"
                                type="number"
                                name="fromYear"
                                min={1887}
                                max={toDate}
                                value={fromDate}
                                onChange={timeFilterHandler}
                                onClick={this.timeInputClickHandler} />
                            {this.state.fromSelect === true &&
                            <input
                                className="slider"
                                name="fromYear"
                                type="range"
                                min="1887"
                                max={toDate}
                                value={fromDate}
                                onChange={timeFilterHandler}
                                onMouseUp={this.timeInputEnd} />}
                        </div>
                        <b className="medium-1 large-1 cell text top-padding">To</b>
                        <div className="medium-2 large-2 cell top-padding">
                            <input
                                className="year"
                                type="number"
                                name="toYear"
                                min={fromDate}
                                max={1899}
                                value={toDate}
                                onChange={timeFilterHandler}
                                onClick={this.timeInputClickHandler} />
                            {this.state.toSelect === true &&
                            <input
                                className="slider"
                                type="range"
                                name="toYear"
                                min={fromDate}
                                max="1899"
                                value={toDate}
                                onChange={timeFilterHandler}
                                onMouseUp={this.timeInputEnd} />}
                        </div>
                    </form>}
                    <ul className="book medium-cell-block-y cell medium-10">
                        {/* little banner at the top of the list of items */}
                        <h6 className="label secondary">
                            {/* if searching, tell the viewer that a search is in progress */}
                            {searchingState === true &&
                                <span className="SearchTitle">Searching: </span>}
                            {/* display the label indicating the currently viewed path */}
                            {this.state.displayLabel}
                        </h6>
                        {/* display the elements we assigned at the beginning of this function */}
                        {toDisplay}
                    </ul>
                </div>
                <div className="medium-4 cell grid-y fillScreen">
                    <div className="medium-6 cell">
                        {/* button that creates + opens the graph tab when clicked */}
                        <button
                            // blue button styling
                            className="button primary"
                            // just space it out properly in the CSS
                            id="expandGraphButton"
                            // when clicked, open the graph in its own tab
                            onClick={() => {
                                addTab(0, "Nexus Graph", "Graph");
                            }}>
                            Open Graph in New Tab
                        </button>
                        {/* the nexus graph */}
                        <NexusGraph
                            // nodes + links for the graph to render
                            data={initializeGraph()}
                            // a totality of all the nodes, sorted by type
                            nodes={initializeNodeCategories()}
                            // custom settings for the graph
                            settings={{
                                // set the height to center the graph
                                "height": window.innerHeight * 0.8 * 0.5,
                                // set the width to center the graph
                                "width": window.innerWidth * 0.8 * 0.389,
                            }} />
                    </div>
                    <MapView className="medium-6 cell"
                        ref={(ref) => {
                            this.map = ref;
                        }}
                        places={placeList} />
                </div>
            </div>
        );
    }
}

Navigation.propTypes = {
    "actions": PropTypes.object.isRequired,
    "navigatorState": PropTypes.object.isRequired,
    "searchState": PropTypes.object.isRequired,
};

/**
 * Set certain props to access Redux states
 * @param {Object} state All possible Redux states
 * @returns {Object} Certain states that are set on props
 */
function mapStateToProps(state) {
    return {
        "navigatorState": state.navigator,
        "searchState": state.search,
    };
}

/**
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": bindActionCreators({
            ...navigatorActions,
            ...tabViewerActions,
            ...searchActions,
        }, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
