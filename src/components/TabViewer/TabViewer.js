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
        this.renderPDF = this.renderPDF.bind(this);
        this.renderPPFS = this.renderPPFS.bind(this);
        this.handleKeywordSearch = this.handleKeywordSearch.bind(this);
        this.renderActiveTab = this.renderActiveTab.bind(this);
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
                    />;
            case "Places":
                // for places, return a PlaceView
                return <PlaceView
                    // with the place retrieved by the passed ID
                    place={model.getPlacesByID(id)}
                    />;
            case "Fieldtrips":
                // for fieldtrip, return a FieldtripView
                return <FieldtripView
                    // with the fieldtrip retrieved by the passed ID
                    fieldtrip={model.getFieldtripsByID(id)}
                   />;
            case "Stories":
                // for stories, return a StoryView
                return <StoryView
                    // with the story retrieved by the passed ID
                    story={model.getStoryByID(id)}
                    handleKeywordSearch={this.handleKeywordSearch} />;
            case "Home": case "home":
                // for the Home tab, return the main Navigation view (home), with addTab for any selected tabs
                return <Navigation
                    searchWord={this.state.searchWord} />;
            case "Graph":
                // for the graph, return the GraphView, with addTab to open pages on double clicked nodes
                return <GraphView openNode={this.addTab} />;
            case "Book":
                return <BookView id={id}/>;
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
