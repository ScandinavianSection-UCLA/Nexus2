import React, {Component} from "react";
import Navigation from "../Navigation/Navigation";
import StoryView from "../StoryView/StoryView";
import PlaceView from "../PlaceView/PlaceView";
import PeopleView from "../PeopleView/PeopleView";
import FieldtripView from "../FieldtripView/FieldtripView";
import BookView from "../BookView/BookView";
import GraphView from "../NexusGraph/GraphView";
import * as model from "../../data-stores/DisplayArtifactModel";
import "./TabViewer.css";
import {getSessionStorage, setSessionStorage} from "../../data-stores/SessionStorageModel";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";



class TabViewer extends Component {
    constructor() {
        super();
        this.state = {
            "views": [],
            "storyPath": "",
            "active": {},
            "searchWord": "",
        };
        this.addTab = this.addTab.bind(this);
        this.switchTab = this.switchTab.bind(this);
        this.closeTab = this.closeTab.bind(this);
        this.renderPDF = this.renderPDF.bind(this);
        this.renderPPFS = this.renderPPFS.bind(this);
        this.handleKeywordSearch = this.handleKeywordSearch.bind(this);
        this.renderActiveTab = this.renderActiveTab.bind(this);
        // let ReduxProps = {};
    }

    componentWillMount() {
        // this.props.tabViewerActions.initializeTabs();
        // this.ReduxProps = this.props.state.tabViewer;
        // console.log(this.props, this.ReduxProps);
        var navigationObject = {
            "jsx": <Navigation addID={this.addTab} />,
            "active": true,
            "id": 0,
            "name": "Home",
            "type": "Home",
        };

        const cachedTabViewer = getSessionStorage("TabViewerSessionState");

        // load previously opened tabs from session
        if (cachedTabViewer) {
            const cachedViews = cachedTabViewer["views"];
            // object
            const cachedInView = cachedTabViewer["active"];

            this.setState(() => {
                // reconstruct jsx from id and type
                var newViews = [];
                cachedViews.forEach((view) => {
                    newViews.push({
                        "active": view["active"],
                        "id": view["id"],
                        "name": view["name"],
                        "type": view["type"],
                        "jsx": this.renderPPFS(view["id"], view["type"]),
                    });
                });
                var newInView = {
                    "active": cachedInView["active"],
                    "id": cachedInView["id"],
                    "name": cachedInView["name"],
                    "type": cachedInView["type"],
                    "jsx": this.renderPPFS(cachedInView["id"], cachedInView["type"]),
                };

                // if route set to home tab, make home tab the active and inview tab
                if (this.props.home) {
                    newViews.forEach(function(currentView) {
                        if (currentView["name"] === "Home") {
                            currentView = navigationObject;
                        }
                    });
                    newInView = navigationObject;
                }

                return {
                    "views": newViews,
                    "active": newInView,
                };
            });
        } else {
            // if no previous session data or data from route, just load a home tab
            this.setState((prevState) => {
                var newState = prevState.views;
                newState.push(navigationObject);
                return {"views": newState, "active": navigationObject};
            });
        }
    }

    /**
     * Render the main content of the app
     * @param {Number} id ID of the relevant person/place/story/fieldtrip to load (irrelevant for NexusGraph, Home)
     * @param {String} type The type of view to load (People/Places/Fieldtrips/Stories/Home/Graph)
     * @returns {JSX} The content of the relevant view
     */
    renderPPFS(id, type) {
        // depending on the type of the view to render
        switch (type) {
            case "People":
                // for people, return a PeopleView
                return <PeopleView
                    // with the person retrieved by the passed ID
                    person={model.getPeopleByID(id)}
                    // and give it the addTab function (in case something selected from rightBar)
                    addID={this.addTab} />;
            case "Places":
                // for places, return a PlaceView
                return <PlaceView
                    // with the place retrieved by the passed ID
                    place={model.getPlacesByID(id)}
                    // and give it the addTab function (in case something selected from rightBar)
                    addID={this.addTab} />;
            case "Fieldtrips":
                // for fieldtrip, return a FieldtripView
                return <FieldtripView
                    // with the fieldtrip retrieved by the passed ID
                    fieldtrip={model.getFieldtripsByID(id)}
                    // and give it the addTab function (in case something selected from rightBar)
                    addID={this.addTab} />;
            case "Stories":
                // for stories, return a StoryView
                return <StoryView
                    // with the story retrieved by the passed ID
                    story={model.getStoryByID(id)}
                    // and give it the addTab function (in case something selected from rightBar)
                    addID={this.addTab}
                    handleKeywordSearch={this.handleKeywordSearch} />;
            case "Home": case "home":
                // for the Home tab, return the main Navigation view (home), with addTab for any selected tabs
                return <Navigation
                    addID={this.addTab}
                    searchWord={this.state.searchWord} />;
            case "Graph":
                // for the graph, return the GraphView, with addTab to open pages on double clicked nodes
                return <GraphView openNode={this.addTab} />;
            default:
                // if it wasn't one of the above types, warn that we hit an unknown type
                console.warn(`Unhandled tab type ${type}`);
        }
    }

    // update views with PDF views
    renderPDF(chapter, name) {
        var nameUpdated = true;
        if (this.state.active.name === name) {
            nameUpdated = false;
        } else {
            this.state.views.forEach((view) => {
                if (view.name === name) {
                    nameUpdated = false;
                }
            });
        }
        if (name !== undefined && nameUpdated) {
            var PDFObject = {
                "name": name,
                "chapter": chapter,
                "jsx": <BookView chapter={chapter} name={name}>{name}</BookView>,
                "active": true,
            };
            this.setState((prevState) => {
                var newState = prevState;
                newState.views.forEach((view) => {
                    view.active = false;
                });
                newState.views.push(PDFObject);
                return {"views": newState.views, "active": PDFObject};
            });
        }
    }

    renderActiveTab() {
        var CurrentState = this.props.state;
        console.log(CurrentState,'active tab!');
        var viewToRender;
        CurrentState['views'].forEach((view)=>{
            if(view['active']){
                console.log(this.renderPPFS(view['id'], view['type']));
                viewToRender= this.renderPPFS(view['id'], view['type']);
            }
        });
        return viewToRender;
    }

    /**
     * Adds a tab
     * @param {*} inputID ID of the relevant person/place/story/fieldtrip to add (irrelevant for NexusGraph, Home)
     * @param {*} name Name to display at the bottom on the tab
     * @param {*} type Type of the tab (person/place/story/fieldtrip/graph/home)
     */
    addTab(inputID, name, type) {
        // see if we can get the preexisting view matching the tab to create
        const matchingView = this.state.views.find((view) => (view["id"] === inputID && view["type"] === type));

        // if we're trying to re-add an already existing view
        if (typeof matchingView !== "undefined") {
            // just set that view to the active
            this.setState({
                "active": matchingView,
            });
        } else {
            // we actually need to make a new tab and view

            // object representing the new view
            const newView = {
                // content should be rendered based on the renderPPFS() function
                "jsx": this.renderPPFS(inputID, type, name),
                // id is the passed ID
                "id": inputID,
                // set it to the active view
                "active": true,
                // name is the passed name
                "name": name,
                // type is the passed type
                "type": type,
            };

            // update the current state, given the previous state
            this.setState((prevState) => {
                // for each of the preexisting views
                let updatedViews = prevState.views.map((view) => {
                    return {
                        // leave the view mostly untouched...
                        ...view,
                        // ...but set it to be inactive
                        "active": false,
                    };
                });

                // add in the new, active view
                updatedViews.push(newView);

                // if our window is smaller than 1100px (95% sure about the units)
                if (window.innerWidth <= 1100) {
                    console.log("Window is small!");
                    // if we have more than 5 tabs already (including home)
                    if (updatedViews.length > 5) {
                        // remove the first non-Home tab
                        updatedViews.splice(1, 1);
                    }
                } else if (updatedViews.length > 6) {
                    // if we have more than 6 tabs already (including home)
                    // remove the first non-Home tab
                    updatedViews.splice(1, 1);
                }

                // update the state of the component
                return {
                    // set the views to be the updated views
                    "views": updatedViews,
                    // set the active view to be the newly created view
                    "active": newView,
                };
            }, function() {
                // update session storage with our new, updated state
                setSessionStorage("TabViewerSessionState", this.state);
            });
        }
    }

    switchTab(view) {
        this.setState((prevState) => {
            var newViews = prevState.views;
            newViews.forEach((currentView) => {
                if (currentView.name !== view.name) {
                    currentView.active = false;
                } else {
                    currentView.active = true;
                    if (currentView.type === "story") {
                        currentView.jsx = this.renderStory(currentView.id);
                        view = currentView;
                    }
                }
            });
            // check if view has been deleted from list of views
            if (newViews.includes(view)) {
                return {"views": newViews, "active": view};
            } else {
                return {"views": newViews};
            }
        }, () => {
            setSessionStorage("TabViewerSessionState", this.state);
        });
    }

    closeTab(view) {
        // find "view" in this.state.views and .active, and delete it. if .active then default to home tab
        this.setState((prevState) => {
            var newState = prevState;
            var removeViewIndex = -1;
            this.state.views.forEach((currentView, i) => {
                if (currentView["name"] === view["name"]) {
                    removeViewIndex = i;
                }
            });
            newState.views.splice(removeViewIndex, 1);
            // is current view being closed?
            if (newState.active["name"] === view["name"]) {
                return {
                    "views": newState.views,
                    "active": newState.views[newState.views.length - 1],
                };
            } else {
                // if current view isn"t being closed, don"t change what"s active view
                return {
                    "views": newState.views,
                };
            }
        }, () => {
            setSessionStorage("TabViewerSessionState", this.state);
        });
    }

    /**
     * Handler for when a keyword is clicked, show the related stories
     * @param {String} keyword The keyword that was clicked
     */
    handleKeywordSearch(keyword) {
        this.setState({
            // update the word that was clicked
            "searchWord": keyword,
        }, function() {
            this.setState(({views}) => {
                // variable to store the home view
                let homeView;
                // for each of the current views
                views.forEach((currentView) => {
                    // if the view is not the home view
                    if (currentView.name !== "Home") {
                        currentView["active"] = false;
                    } else {
                        // for the home view
                        currentView = {
                            ...currentView,
                            // set it to be active
                            "active": true,
                            // and re-render it with updated JSX (for the keyword)
                            "jsx": this.renderPPFS(0, "Home"),
                        };
                        // set our home variable to be this view
                        homeView = currentView;
                    }
                });
                // update the state
                return {
                    // views = our modified, updated views
                    "views": views,
                    // active = the home view
                    "active": homeView,
                };
            }, () => {
                // update session storage with the new state
                setSessionStorage("TabViewerSessionState", this.state);
            });
        });

    }

    render() {
        return (
            <div className="TabViewer grid-container full">
                <div className="grid-y">
                    {/* Wrapper/container for the View, not including the tabs*/}
                    <div className="view cell fill"> {/* Class "fill" fills out the rest of the application space with the view*/}
                        {/* Function below generates/sorts out which view should be displayed*/}
                        {this.renderActiveTab()}
                    </div>
                    {/* List of tabs that are displayed at the bottom of the browser/app*/}
                    <ul className="tabs cell medium-1"> {/* medium-1 sets the height of the tabs*/}
                        {this.props.state.views.map((view, i) => {
                            return (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.props.tabViewerActions.switchTabs(i);
                                    }}
                                    key={i}
                                    className={`${view.active ? "active" : ""}`}>
                                    {view.name}
                                    <img
                                        src="https://png.icons8.com/material/50/000000/delete-sign.png"
                                        alt="Close Icon"
                                        className={`closeTabIcon ${view.name === "Home" ? "noClose" : ""}`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.props.tabViewerActions.closeTab(i);
                                        }} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

TabViewer.propTypes = {
    "tabActions": PropTypes.object,
};

function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
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
)(TabViewer);
