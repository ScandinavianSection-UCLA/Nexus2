/**
 * Created by danielhuang on 2/24/18.
 */
import React, {Component} from "react";
import NavigatorComponent from "./NavigatorComponent";
import SearchComponent from "./SearchComponent";
import MapView from "../MapView/MapView";
import {ontologyToDisplayKey, ontologyToID, dateFilterHelper} from "../../data-stores/DisplayArtifactModel";
import {addNode} from "../UserNexus/UserNexusModel";
import "./navigation.css";
import UserNexus from "../UserNexus/UserNexus";

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
        // properly bind this to handleDisplayGraph so it can be used correctly in UserNexus
        this.handleDisplayGraph = this.handleDisplayGraph.bind(this);
    }

    displayList(list, displayKey, idKey, ontology) {
        this.setState(() => {
            return {
                "displayItemsList": list.map((itemInList, i) => {

                    return <li key={i} className={ontology}
                        onClick={(e) => {
                            e.preventDefault();
                            this.handleIDQuery(itemInList[idKey], itemInList[displayKey], ontology, itemInList);
                        }}>
                        <span>
                            <img className={"convo-icon " + ontology} src={require("./icons8-chat-filled-32.png")} alt="story" />
                            <img className={"person-icon " + ontology} src={require("./icons8-contacts-32.png")} alt="person" />
                            <img className={"location-icon " + ontology} src={require("./icons8-marker-32.png")} alt="location" />
                            <img className={"fieldtrip-icon " + ontology} src={require("./icons8-waypoint-map-32.png")} alt="location" />
                        </span> {itemInList[displayKey]}
                    </li>;
                }),
                "lastIDKey": idKey,
                "lastDisplayKey": displayKey,
            };
        });

        return list.map((item, i) => {
            return <li key={i} className={ontology}
                onClick={(e) => {
                    e.preventDefault();
                    this.handleIDQuery(item[idKey], item[displayKey], ontology, item);
                }}>
                <span>
                    <img className={"convo-icon " + ontology} src={require("./icons8-chat-filled-32.png")} alt="story" />
                    <img className={"person-icon " + ontology} src={require("./icons8-contacts-32.png")} alt="person" />
                    <img className={"location-icon " + ontology} src={require("./icons8-marker-32.png")} alt="location" />
                </span> {item[displayKey]}
            </li>;
        });
    }

    handleIDQuery(id, name, type, item) {
        console.log(id);
        // update this.props.places for the map component
        // console.log('handle id query',type,id,name);
        this.refs.map.updateMarkers();
        // add node to network graph
        addNode(id, name, type, item);
        this.props.addID(id, name, type);
    }

    /**
     * Handler to create/display the separate Graph tab + view
     */
    handleDisplayGraph() {
        // call the addTab function passed by TabView.js:renderPPFS()
        this.props.addID(0, "NexusGraph", "Graph");
    }

    displayItems(items, ontology) {
        var displayKey = ontologyToDisplayKey[ontology];
        var idKey = ontologyToID[ontology];

        // var PlaceIDList = setPlaceIDList(items,ontology);

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
        this.setState({"searchOn": CurrentState});
    }

    setDisplayLabel(label) {
        this.setState({"displayLabel": label});
    }

    render() {
        return (
            <div className="Navigation">
                <div className="navigation grid-x grid-padding-x">
                    <div className="medium-3 cell dataNavigation">
                        <SearchComponent handleDisplayItems={this.displayItems.bind(this)}
                            displayList={this.state.itemsList}
                            searchOn={this.flipSearch.bind(this)}
                        />
                        <NavigatorComponent handleDisplayItems={this.displayItems.bind(this)}
                            setDisplayLabel={this.setDisplayLabel.bind(this)}
                        />
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
                                        <span className={`SearchTitle ${this.state.searchOn ? "active" : ""}`}>Searching </span>
                                        {this.state.displayLabel}
                                    </h6>
                                    {this.state.displayItemsList}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="medium-4 cell">
                        <div className="grid-y" style={{"height": "100%"}}>
                            <UserNexus
                                // CSS classes
                                className="medium-6 cell"
                                ref="UserNexus"
                                // pass the function that allows the creation of the Graph tab + view
                                expandGraph={this.handleDisplayGraph} />
                            <MapView className="medium-6 cell" ref="map" places={this.state.placeList} fieldtrips={this.state.fieldtrips} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigation;
