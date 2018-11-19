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
    DisplayArtifactToDisplayKey, ArtifactoID
} from "../../data-stores/DisplayArtifactModel";
import "./navigation.css";
// the nexus graph
import NexusGraph from "../NexusGraph/NexusGraph";
// functions to get nodes + links
import {addNode, initializeGraph, initializeNodeCategories} from "../NexusGraph/NexusGraphModel";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

class Navigation extends Component {
    constructor() {
        super();
        // set the initial state of the home view
        this.state = {
            "path": [],
            // lists visible on view
            "lists": [
                {
                    "name": "MAIN",
                    "childArray": ["Data Navigator", "Topic & Index Navigator", "[Select]"],
                    "children": [this["Data Navigator"], this["Topic & Index Navigator"]],
                    "level": 0,
                },
            ],
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
            "lastIDKey": "",
            "lastDisplayKey": "",
            "placeList": [],
            "fieldtrips": [],
            "nodes": [],
            "searchOn": false,
            "displayLabel": "",
        };
        this.displayItems = this.displayItems.bind(this);
        // properly bind this to handleDisplayGraph so it can be used correctly
        this.handleDisplayGraph = this.handleDisplayGraph.bind(this);
    }

    displayList(list, displayKey, idKey, ontology) {
        console.log(list, displayKey, idKey, ontology);
        return list.map((item, i) => {
            return <li key={i} className={ontology}
                onClick={(e) => {
                    e.preventDefault();
                    this.handleIDQuery(item[idKey], item[displayKey], ontology, item);
                }}>
                <span>
                    <img className={`convo-icon ${ontology}`} src={require("./icons8-chat-filled-32.png")} alt="story" />
                    <img className={`person-icon ${ontology}`} src={require("./icons8-contacts-32.png")} alt="person" />
                    <img className={`location-icon ${ontology}`} src={require("./icons8-marker-32.png")} alt="location" />
                    <img className={`fieldtrip-icon ${ontology}`} src={require("./icons8-waypoint-map-32.png")} alt="fieldtrip" />
                </span> {item[displayKey]}
            </li>;
        });
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
        var displayKey = ontologyToDisplayKey[ontology];
        var idKey = ontologyToID[ontology];
        console.log(items, ontology);
        if(displayKey !== undefined && idKey !== undefined){
            if(this.props.searchState.results.length >= 1){
                console.log('SEARCH STATE IS GOING THRUUU');
                this.setState(() => {
                    return {
                        "displayOntology": ontology,
                        "itemsList": items,
                        "displayItemsList": this.displayList(this.props.searchState.results, displayKey, idKey, ontology),
                        "placeList": items,
                    };
                }, () => {
                    if (this.state.timeFilterOn && typeof items !== "undefined") {
                        this.updateItems.bind(this)();
                    }
                });
            } else {
                this.setState(() => {
                    return {
                        "displayOntology": ontology,
                        "itemsList": items,
                        "displayItemsList": this.displayList(items, displayKey, idKey, ontology),
                        "placeList": items,
                    };
                }, () => {
                    if (this.state.timeFilterOn && typeof items !== "undefined") {
                        this.updateItems.bind(this)();
                    }
                });
            }

        }
    }

    updateItems() {
        var displayKey = ontologyToDisplayKey[this.state.displayOntology];
        var idKey = ontologyToID[this.state.displayOntology];
        if (this.state.timeFilterOn) {
            // filter by time to get array with display artifacts that fit the time filter
            var itemsWithinFieldtrips = dateFilterHelper(this.refs.fromDate.value, this.refs.toDate.value, this.state.displayOntology);
            // if an item is in the itemsWithinFieldtrips, change what is displayed, NOT items list
            var displayList = [];
            // if it isn't a fieldtrip
            if (this.state.displayOntology !== "Fieldtrips") {
                var idsWithinFieldtrips = [];
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
                        "displayItemsList": this.displayList(displayList, displayKey, idKey, displayOntologyTimeline),
                    });
                }
            } else { // else it is a fieldtrip
                this.setState({
                    "displayItemsList": this.displayList(itemsWithinFieldtrips, displayKey, idKey, "Fieldtrips"),
                });
            }
        } else if (!this.state.timeFilterOn) {
            // set display ontology to define which icon to show
            let displayOntologyTimeline = this.state.displayOntology;
            this.setState({
                "displayItemsList": this.displayList(this.state.itemsList, displayKey, idKey, displayOntologyTimeline),
            });
        }

    }

    // sets time filters
    timeFilterHandler() {
        let fromDateForm = parseInt(this.refs.fromDate.value, 10);
        let toDateForm = parseInt(this.refs.toDate.value, 10);
        // check if the dates are valid dates (4 digits, between 1887 and 1899)
        if (fromDateForm >= 1887 && toDateForm <= 1899) {
            // check if time filter was switched
            if (this.refs.TimeFilterOn.checked !== this.state.timeFilterOn) {
                // if they are, then set this.state variables
                this.setState({
                    "timeFilterOn": !this.state.timeFilterOn,
                    "fromDate": fromDateForm,
                    "toDate": toDateForm,
                }, () => {
                    this.updateItems.bind(this)();
                });
            } else {
                // just change from/to dates
                this.setState({
                    "fromDate": fromDateForm,
                    "toDate": toDateForm,
                }, () => {
                    this.updateItems.bind(this)();
                });
            }
        }
    }

    timeInputClickHandler(year) {
        // display slider
        if (year === "ToYear") {
            // set this.state.toSelect = true
            this.setState(() => {
                return {"toSelect": true};
            });
        } else {
            // set this.state.fromSelect = true
            this.setState(() => {
                return {"fromSelect": true};
            });
        }
    }

    timeInputEnd(year) {
        // display slider
        if (year === "toDate") {
            // set this.state.toSelect = true
            this.setState(() => {
                return {"toSelect": false};
            }, () => {
                this.timeFilterHandler.bind(this);
            });
        } else {
            // set this.state.fromSelect = true
            this.setState(() => {
                return {"fromSelect": false};
            }, () => {
                this.timeFilterHandler.bind(this);
            });
        }
    }

    flipSearch(CurrentState) {
        this.setState({
            "searchOn": CurrentState,
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
                            searchOn={this.flipSearch.bind(this)}
                            searchState={this.state.searchOn}
                            searchWord={this.props.searchWord} />
                        <NavigatorComponent
                            handleDisplayItems={this.displayItems.bind(this)}
                            setDisplayLabel={this.setDisplayLabel.bind(this)}
                            searchOn={this.flipSearch.bind(this)}
                            searchWord={this.props.searchWord} />
                    </div>
                    <div className="medium-5 cell AssociatedStoriesViewer">
                        <div className="grid-y" style={{"height": "100%"}}>
                            <div className="cell medium-2">
                                <form className="time-filter grid-x">
                                    <div className="medium-2 medium-offset-1 cell">
                                        <div className="switch">
                                            <input className="switch-input" id="exampleSwitch" type="checkbox" checked={this.state.timeFilterOn}
                                                name="exampleSwitch" onChange={this.timeFilterHandler.bind(this)} ref="TimeFilterOn" />
                                            <label className="switch-paddle" htmlFor="exampleSwitch"><br />
                                                <span style={{"fontSize": ".8em", "color": "black", "width": "150%"}}>Timeline</span>
                                                <span className="show-for-sr">Enable Timeline</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="medium-2 cell text"><b>From</b></div>
                                    <div className="medium-2 cell">
                                        <input className="year" type="text" name="FromYear" ref="fromDate"
                                            value={this.state.fromDate}
                                            onChange={this.timeFilterHandler.bind(this)} onClick={(e) => {
                                                e.preventDefault();
                                                this.timeInputClickHandler.bind(this)("FromYear");
                                            }} />
                                        <input className={`slider ${this.state.fromSelect ? "active" : ""}`}
                                            type="range" min="1887" max={this.state.toDate} value={this.state.fromDate}
                                            onChange={this.timeFilterHandler.bind(this)}
                                            onMouseUp={(e) => {
                                                e.preventDefault();
                                                this.timeInputEnd.bind(this)("fromDate");
                                            }}
                                            ref="fromDate"
                                            id="myRange" />
                                    </div>
                                    <div className="medium-1 cell text"><b>To</b></div>
                                    <div className="medium-2 cell">
                                        <input className="year" type="text" name="ToYear" ref="toDate"
                                            value={this.state.toDate}
                                            onChange={this.timeFilterHandler.bind(this)} onClick={(e) => {
                                                e.preventDefault();
                                                this.timeInputClickHandler.bind(this)("ToYear");
                                            }} />
                                        <input className={`slider ${this.state.toSelect ? "active" : ""}`}
                                            type="range" min={this.state.fromDate} max="1899" value={this.state.toDate}
                                            onChange={this.timeFilterHandler.bind(this)}
                                            onMouseUp={(e) => {
                                                e.preventDefault();
                                                this.timeInputEnd.bind(this)("toDate");
                                            }}
                                            ref="toDate"
                                            id="myRange" />
                                    </div>
                                </form>
                            </div>
                            <div className="stories-container cell medium-10">
                                <ul className="book medium-cell-block-y">
                                    <h6 className="label secondary">
                                        <span className={`SearchTitle ${(this.state.searchOn || this.props.searchWord.length > 0) ? "active" : ""}`}>
                                            Searching: </span>
                                        <span className={`SearchTitle ${this.props.searchWord.length > 0 ? "active" : ""}`}>
                                            {`'${this.props.searchWord}' in `}</span>
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
                                {/* button that creates + opens the graph tab when clicked (Navigation.js:handleDisplayGraph())*/}
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
                            <MapView className="medium-6 cell" ref="map" places={this.state.placeList} fieldtrips={this.state.fieldtrips} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Navigation.propTypes = {
    "searchWord": PropTypes.string.isRequired,
    "tabViewerActions": PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
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
