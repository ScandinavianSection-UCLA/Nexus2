/**
 * Created by danielhuang on 2/24/18.
 */
import React, {Component} from "react";
import NavigatorComponent from "./NavigatorComponent";
import SearchComponent from "./SearchComponent";
import MapView from "../MapView/MapView";
import {
    ontologyToDisplayKey,
    ontologyToID,
    dateFilterHelper,
} from "../../data-stores/DisplayArtifactModel";
import "./navigation.css";
// the nexus graph
import NexusGraph from "../NexusGraph/NexusGraph";
// functions to get nodes + links
import {addNode, initializeGraph, initializeNodeCategories} from "../NexusGraph/NexusGraphModel";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import * as searchActions from "../../actions/searchActions";
import connect from "react-redux/es/connect/connect";

class Navigation extends Component {
    constructor(props) {
        super(props);
        // set the initial state of the home view
        this.state = {
            // array of jsx items that will be rendered on view
            "displayItemsList": [],
            // array of display artifact objects (JSON)
            "itemsList": [],
            // default start date
            "fromDate": 1887,
            "fromSelect": false,
            // default end date
            "toDate": 1899,
            "toSelect": false,
            "timeFilterOn": false,
            // defines which icon to display
            "displayOntology": "",
            "placeList": [],
            "displayLabel": "",
        };
        this.displayItems = this.displayItems.bind(this);
        // properly bind this to handleDisplayGraph so it can be used correctly
        this.handleDisplayGraph = this.handleDisplayGraph.bind(this);
    }

    /**
     * Display a list of items
     * @param {Array} list Items to display
     * @param {String} ontology Ontology of the items to display
     * @returns {Array} Array of formatted JSX elements
     */
    displayList(list, ontology) {
        // variable to store which icon will be shown next to the names of the items
        const displayKey = ontologyToDisplayKey[ontology];
        const idKey = ontologyToID[ontology];
        let image = null;
        switch (ontology) {
            case "Stories":
                // for stories, get the chat bubble icon
                image = <img className={"convo-icon"} src={require("./icons8-chat-filled-32.png")} alt="story" />;
                break;
            case "People":
                // for people, get the generic portrait icon
                image = <img className={"person-icon"} src={require("./icons8-contacts-32.png")} alt="person" />;
                break;
            case "Places":
                // for places, get the pin marker icon
                image = <img className={"location-icon"} src={require("./icons8-marker-32.png")} alt="location" />;
                break;
            case "Fieldtrips":
                // for fieldtrips, get the map with an x icon
                image = <img className={"fieldtrip-icon"} src={require("./icons8-waypoint-map-32.png")} alt="fieldtrip" />;
                break;
            default:
                // bad ontology, warn this
                console.warn(`Unhandled ontology type: ${ontology}`);
                break;
        }
        // return a list of the elements
        return list.map((item, i) => (
            // each is a list item in the unordered list
            <li
                // key for React
                key={i}
                // on click, do all the processing necessary when loading this item
                onClick={this.handleIDQuery.bind(this, item[idKey], item[displayKey], ontology, item)}>
                {/* put our desired image on the left of the item */}
                {image}
                {/* put the item's name right after that */}
                {item[displayKey]}
            </li>
        ));
    }

    handleIDQuery(id, name, type, item) {
        // update this.props.places for the map component
        this.refs.map.updateMarkers();
        // add node to network graph
        addNode(id, name, type, item);
        this.props.tabViewerActions.addTab(id, name, type);
    }

    /**
     * Handler to create/display the separate Graph tab + view
     */
    handleDisplayGraph() {
        this.props.tabViewerActions.addTab(0, "Nexus Graph", "Graph");
    }

    displayItems(items, ontology) {
        this.setState({
            "displayOntology": ontology,
            "itemsList": items,
            "displayItemsList": this.displayList(items, ontology),
            "placeList": items,
        }, function() {
            if (this.state.timeFilterOn && typeof items !== "undefined") {
                this.updateItems();
            }
        });
    }

    updateItems() {
        let idKey = ontologyToID[this.state.displayOntology];
        if (this.state.timeFilterOn) {
            // filter by time to get array with display artifacts that fit the time filter
            let itemsWithinFieldtrips = dateFilterHelper(this.state.fromDate, this.state.toDate, this.state.displayOntology);
            // if an item is in the itemsWithinFieldtrips, change what is displayed, NOT items list
            let displayList = [];
            // if it isn't a fieldtrip
            if (this.state.displayOntology !== "Fieldtrips") {
                let idsWithinFieldtrips = [];
                if (typeof itemsWithinFieldtrips !== "undefined") {
                    // create array of display artifact ids within time filter (this is to speed filtering process later)
                    itemsWithinFieldtrips.forEach((item) => {
                        idsWithinFieldtrips.push(item[idKey]);
                    });
                    // set items that are within timeline into the display list
                    this.state.itemsList.forEach((item) => {
                        // if something in the current items list is in the range of the date
                        if (idsWithinFieldtrips.indexOf(item[idKey]) > -1) {
                            displayList.push(item);
                        }
                    });
                    // set display ontology to allow icons to show
                    let displayOntologyTimeline = this.state.displayOntology;
                    this.setState({
                        "displayItemsList": this.displayList(displayList, displayOntologyTimeline),
                    });
                }
            } else { // else it is a fieldtrip
                this.setState({
                    "displayItemsList": this.displayList(itemsWithinFieldtrips, "Fieldtrips"),
                });
            }
        } else if (!this.state.timeFilterOn) {
            // set display ontology to define which icon to show
            let displayOntologyTimeline = this.state.displayOntology;
            this.setState({
                "displayItemsList": this.displayList(this.state.itemsList, displayOntologyTimeline),
            });
        }

    }

    // sets time filters
    timeFilterHandler(filter, event) {
        switch (filter) {
            case "fromDate":
                this.setState({
                    "fromDate": event.target.value,
                }, function() {
                    // check if the dates are valid dates (4 digits, between 1887 and 1899)
                    if (this.state.fromDate >= 1887) {
                        this.updateItems();
                    }
                });
                break;
            case "toDate":
                this.setState({
                    "toDate": event.target.value,
                }, function() {
                    // check if the dates are valid dates (4 digits, between 1887 and 1899)
                    if (this.state.toDate <= 1899) {
                        this.updateItems();
                    }
                });
                break;
            case "timelineFilter":
                this.setState({
                    "timeFilterOn": event.target.checked,
                }, function() {
                    this.updateItems();
                });
                break;
            default:
                console.warn(`Invalid filter: ${filter}`);
        }
    }

    timeInputClickHandler(year) {
        this.setState({
            [year === "ToYear" ? "toSelect" : "fromSelect"]: true,
        });
    }

    timeInputEnd(year) {
        this.setState({
            [year === "toDate" ? "toSelect" : "fromSelect"]: false,
        });
    }

    setDisplayLabel(label) {
        this.setState({
            "displayLabel": label,
        });
    }

    render() {
        // variable to store the main, center display
        let toDisplay;
        // based on what is currently being viewd
        switch (this.state.displayLabel) {
            // if the user is viewing the ETK Index but hasn't selected anything yet
            case "Topic & Index Navigator > ETK Index":
                // render a hint to select an ETK index
                toDisplay =
                    <div className="hintText">
                        Select an ETK index from the left to get started!
                    </div>;
                break;
            // if the user is viewing the Tango Index but hasn't selected anything yet
            case "Topic & Index Navigator > Tangherlini Index":
                // render a hint to select a tango index
                toDisplay =
                    <div className="hintText">
                        Select a class from the left to get started!
                    </div>;
                break;
            // if the user is viewing the genres but hasn't selected anything yet
            case "Topic & Index Navigator > Genres":
                // render a hint to select a genre
                toDisplay =
                    <div className="hintText">
                        Select a genre from the left to get started!
                    </div>;
                break;
            // for anything else
            default:
                // just render what is normally wanted
                toDisplay = this.state.displayItemsList;
                break;
        }
        return (
            <div className="Navigation">
                <div className="navigation grid-x grid-padding-x">
                    <div className="medium-3 cell dataNavigation">
                        <SearchComponent handleDisplayItems={this.displayItems.bind(this)}
                            displayList={this.state.itemsList}
                            searchWord={this.props.searchWord} />
                        <NavigatorComponent
                            handleDisplayItems={this.displayItems.bind(this)}
                            setDisplayLabel={this.setDisplayLabel.bind(this)}
                            searchWord={this.props.searchWord} />
                    </div>
                    <div className="medium-5 cell AssociatedStoriesViewer">
                        <div className="grid-y" style={{"height": "100%"}}>
                            <div className="cell medium-2">
                                <form className="time-filter grid-x">
                                    <div className="medium-2 medium-offset-1 cell">
                                        <div className="switch">
                                            <input className="switch-input" id="exampleSwitch" type="checkbox" checked={this.state.timeFilterOn}
                                                name="exampleSwitch" onChange={this.timeFilterHandler.bind(this, "timelineFilter")} />
                                            <label className="switch-paddle" htmlFor="exampleSwitch"><br />
                                                <span style={{"fontSize": ".8em", "color": "black", "width": "150%"}}>Timeline</span>
                                                <span className="show-for-sr">Enable Timeline</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="medium-2 cell text"><b>From</b></div>
                                    <div className="medium-2 cell">
                                        <input
                                            className="year"
                                            type="number"
                                            name="FromYear"
                                            min={1887}
                                            max={this.state.toDate}
                                            value={this.state.fromDate}
                                            onChange={this.timeFilterHandler.bind(this, "fromDate")}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.timeInputClickHandler.bind(this)("FromYear");
                                            }} />
                                        <input
                                            className={`slider ${this.state.fromSelect ? "active" : ""}`}
                                            type="range"
                                            min="1887"
                                            max={this.state.toDate}
                                            value={this.state.fromDate}
                                            onChange={this.timeFilterHandler.bind(this, "fromDate")}
                                            onMouseUp={(e) => {
                                                e.preventDefault();
                                                this.timeInputEnd.bind(this)("fromDate");
                                            }}
                                            id="myRange" />
                                    </div>
                                    <div className="medium-1 cell text"><b>To</b></div>
                                    <div className="medium-2 cell">
                                        <input
                                            className="year"
                                            type="number"
                                            name="ToYear"
                                            min={this.state.fromDate}
                                            max={1899}
                                            value={this.state.toDate}
                                            onChange={this.timeFilterHandler.bind(this, "toDate")}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.timeInputClickHandler.bind(this)("ToYear");
                                            }} />
                                        <input
                                            className={`slider ${this.state.toSelect ? "active" : ""}`}
                                            type="range"
                                            min={this.state.fromDate}
                                            max="1899"
                                            value={this.state.toDate}
                                            onChange={this.timeFilterHandler.bind(this, "toDate")}
                                            onMouseUp={(e) => {
                                                e.preventDefault();
                                                this.timeInputEnd.bind(this)("toDate");
                                            }}
                                            id="myRange" />
                                    </div>
                                </form>
                            </div>
                            <div className="stories-container cell medium-10">
                                <ul className="book medium-cell-block-y">
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
                        </div>
                    </div>
                    <div className="medium-4 cell">
                        <div className="grid-y" style={{"height": "100%"}}>
                            <div
                                className="medium-6 cell">
                                {/* button that creates + opens the graph tab when clicked */}
                                <button
                                    // cSS classes
                                    className="button primary"
                                    // cSS id
                                    id="expandGraphButton"
                                    // when clicked, open the graph in its own tab
                                    onClick={this.handleDisplayGraph}>
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
                                        "height": (window.innerHeight) * 0.8 * .5,
                                        // set the width to center the graph
                                        "width": (window.innerWidth) * 0.8 * .389,
                                    }} />
                            </div>
                            <MapView className="medium-6 cell" ref="map" places={this.state.placeList} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Navigation.propTypes = {
    "tabViewerActions": PropTypes.object.isRequired,
    "searchState": PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        "searchState": state.search,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "tabViewerActions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
