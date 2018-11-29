// react functionality
import React from "react";
// CSS styling
import "./navigation.css";
// functions to get nodes + links
import {
    addNode,
    initializeGraph,
    initializeNodeCategories,
} from "../NexusGraph/NexusGraphModel";
// data helpers
import {
    ontologyToDisplayKey,
    ontologyToID,
} from "../../data-stores/DisplayArtifactModel";
// subcomponents of the navigator
import MapView from "../MapView/MapView";
import NavigatorComponent from "./NavigatorComponent";
import NexusGraph from "../NexusGraph/NexusGraph";
import SearchComponent from "./SearchComponent";
// prop validation
import PropTypes from "prop-types";
// redux imports
import {bindActionCreators} from "redux";
import * as navigatorActions from "../../actions/navigatorActions";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // to be set later
            "displayLabel": "",
            // start with the sliders hidden
            "fromSelect": false,
            "toSelect": false,
        };
        // ref to the map for updating
        this.map = React.createRef();
    }

    /**
     * Display a list of items
     * @param {Array} list Items to display
     * @returns {Array} Array of formatted JSX elements
     */
    displayList(list) {
        // ontology of the items currently displayed
        const {displayOntology} = this.props.navigatorState,
            // key to extract name from display artifacts
            displayKey = ontologyToDisplayKey[displayOntology],
            // key to extract ID from display artifacts
            idKey = ontologyToID[displayOntology];
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
                break;
        }
        // return a list of the elements
        return list.map((item, i) => (
            // each is a list item in the unordered list
            <li
                // key for React
                key={i}
                // on click, do all the processing necessary when loading this item
                onClick={() => {
                    this.handleIDQuery(item[idKey], item[displayKey], displayOntology, item);
                }}>
                {/* put our desired image on the left of the item */}
                {image}
                {/* put the item's name right after that */}
                {item[displayKey]}
            </li>
        ));
    }

    /**
     * Handler for when an artifact
     * @param {*} id ID of the artifact
     * @param {*} name Display name of the artifact
     * @param {*} type Ontology of the artifact
     * @param {*} item The artifact
     */
    handleIDQuery(id, name, type, item) {
        // update this.props.places for the map component
        this.map.updateMarkers();
        // add node to network graph
        addNode(id, name, type, item);
        // open up the artifact's tab
        this.props.actions.addTab(id, name, type);
    }

    /**
     * Enable a specified input
     * @param {String} year Label of the input
     */
    timeInputClickHandler(year) {
        this.setState({
            [year === "ToYear" ? "toSelect" : "fromSelect"]: true,
        });
    }

    /**
     * Disable a specified input
     * @param {String} year Label of the input
     */
    timeInputEnd(year) {
        this.setState({
            [year === "toDate" ? "toSelect" : "fromSelect"]: false,
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

    render() {
        // get relevant state data from redux
        const {fromDate, timeFilterOn, toDate} = this.props.navigatorState,
            // get necessary actions from redux
            {addTab, timeFilterHandler} = this.props.actions;
        // variable to store the main, center display
        let toDisplay;
        // based on what is currently being viewd
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
                toDisplay = this.displayList(this.props.navigatorState.displayList);
                break;
        }
        return (
            <div className="Navigation grid-x grid-padding-x">
                <div className="medium-3 cell dataNavigation">
                    <SearchComponent searchWord={this.props.searchWord} />
                    <NavigatorComponent
                        setDisplayLabel={this.setDisplayLabel.bind(this)}
                        searchWord={this.props.searchWord} />
                </div>
                <div className="medium-5 cell AssociatedStoriesViewer grid-y fillScreen">
                    <form className="cell medium-2 time-filter grid-x">
                        <div className="medium-2 medium-offset-1 cell switch">
                            <input
                                className="switch-input"
                                id="exampleSwitch"
                                type="checkbox"
                                checked={timeFilterOn}
                                name="exampleSwitch"
                                onChange={(event) => {
                                    timeFilterHandler("timelineFilter", event);
                                }} />
                            <label className="switch-paddle" htmlFor="exampleSwitch">
                                <br />
                                <span id="timelineText">Timeline</span>
                                <span className="show-for-sr">Enable Timeline</span>
                            </label>
                        </div>
                        <b className="medium-2 cell text">From:</b>
                        <div className="medium-2 cell">
                            <input
                                className="year"
                                type="number"
                                name="FromYear"
                                min={1887}
                                max={toDate}
                                value={fromDate}
                                onChange={(event) => {
                                    timeFilterHandler("fromDate", event);
                                }}
                                onClick={() => {
                                    this.timeInputClickHandler("FromYear");
                                }} />
                            {this.state.fromSelect === true &&
                                <input
                                    className="slider"
                                    type="range"
                                    min="1887"
                                    max={toDate}
                                    value={fromDate}
                                    onChange={(event) => {
                                        timeFilterHandler("fromDate", event);
                                    }}
                                    onMouseUp={() => {
                                        this.timeInputEnd("fromDate");
                                    }} />}
                        </div>
                        <b className="medium-1 cell text">To</b>
                        <div className="medium-2 cell">
                            <input
                                className="year"
                                type="number"
                                name="ToYear"
                                min={fromDate}
                                max={1899}
                                value={toDate}
                                onChange={(event) => {
                                    timeFilterHandler("toDate", event);
                                }}
                                onClick={() => {
                                    this.timeInputClickHandler("ToYear");
                                }} />
                            {this.state.toSelect === true &&
                                <input
                                    className="slider"
                                    type="range"
                                    min={fromDate}
                                    max="1899"
                                    value={toDate}
                                    onChange={(event) => {
                                        timeFilterHandler("toDate", event);
                                    }}
                                    onMouseUp={() => {
                                        this.timeInputEnd("toDate");
                                    }} />}
                        </div>
                    </form>
                    <ul className="book medium-cell-block-y cell medium-10">
                        {/* little banner at the top of the list of items */}
                        <h6 className="label secondary">
                            {/* if searching, tell the viewer that a search is in progress */}
                            {this.props.searchState.searchingState === true &&
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
                        places={this.props.navigatorState.placeList} />
                </div>
            </div>
        );
    }
}

Navigation.propTypes = {
    "actions": PropTypes.object.isRequired,
    "navigatorState": PropTypes.object.isRequired,
    "searchState": PropTypes.object.isRequired,
    "searchWord": PropTypes.object.isRequired,
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
        }, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
