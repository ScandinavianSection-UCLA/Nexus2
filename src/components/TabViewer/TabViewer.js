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
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";

class TabViewer extends Component {
    constructor() {
        super();
        this.state = {
            // by default, no search to load
            "searchWord": "",
        };
        // stores the left edge X-coordiantes of each tab
        this.tabPos = [];
        // properly bind functions so that they can work in sub-elements
        this.handleKeywordSearch = this.handleKeywordSearch.bind(this);
        this.renderActiveTab = this.renderActiveTab.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
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
                // for people, return a PeopleView with the person retrieved by the passed ID
                return <PeopleView person={model.getPeopleByID(id)} />;
            case "Places":
                // for places, return a PlaceView with the place retrieved by the passed ID
                return <PlaceView place={model.getPlacesByID(id)} />;
            case "Fieldtrips":
                // for fieldtrip, return a FieldtripViewwith the fieldtrip retrieved by the passed ID
                return <FieldtripView fieldtrip={model.getFieldtripsByID(id)} />;
            case "Stories":
                // for stories, return a StoryView
                return <StoryView
                    // with the story retrieved by the passed ID
                    story={model.getStoryByID(id)}
                    // function to handle any potential clicked keywords
                    handleKeywordSearch={this.handleKeywordSearch} />;
            case "Home": case "home":
                // for the Home tab, return the main Navigation view (home), with the searchWord if set
                return <Navigation searchWord={this.state.searchWord} />;
            case "Graph":
                // for the graph, return the GraphView, with addTab to open pages on double clicked nodes
                return <GraphView openNode={this.addTab} />;
            case "Book":
                // for the book, return the BookView, with the chapter ID that was selected
                return <BookView id={id} />;
            default:
                // if it wasn't one of the above types, warn that we hit an unknown type
                console.warn(`Unhandled tab type: ${type}`);
        }
    }

    /**
     * Render the active tab as the main content of the page
     * @returns {JSX} The rendered JSX
     */
    renderActiveTab() {
        // search through the list of tabs for the active tab
        const activeView = this.props.state.views.find((view) => view.active);
        // return the rendered content of the tab
        return this.renderPPFS(activeView.id, activeView.type);
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
            // go to the home tab
            this.props.tabViewerActions.switchTabs(0);
        });
    }

    // called when a tab stops being dragged
    handleDragEnd(event, index) {
        // we can't move the home tab
        if (index !== 0) {
            // get the final X of the drag
            const {screenX} = event;
            // find the index of the first tab such that the mouse was released to the left of its left edge
            // and go one of left of that to put it in the spot where the mouse was released
            let newIndex = this.tabPos.findIndex((x) => screenX <= x) - 1;
            // if we went past the last left edge (waaaaay right)
            console.log(newIndex);
            if (newIndex === -2) {
                // this should become the last tab in the list
                newIndex = this.tabPos.length - 1;
            } else if (newIndex === 0 || newIndex === -1) {
                // if it was dropped at home or to the left of home
                // this should become the second tab in the list (after home)
                newIndex = 1;
            }
            // move the dragged tab to the desired spot
            this.props.tabViewerActions.moveTab(index, newIndex);
        }
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
                        {/* for each tab to display */}
                        {this.props.state.views.map((view, index) => {
                            return (
                                // return a tab JSX element
                                <li
                                    // based on the actual DOM element that results
                                    ref={(instance) => {
                                        // assuming we got a proper render
                                        if (instance !== null) {
                                            // set the width of the tabs in tabPos
                                            this.tabPos[index] = instance.getBoundingClientRect().x;
                                        }
                                    }}
                                    // callback when the tab is clicked
                                    onClick={(event) => {
                                        // prevent default click behavior
                                        event.preventDefault();
                                        // if a tab is clicked, we should switch to that tab
                                        this.props.tabViewerActions.switchTabs(index);
                                    }}
                                    draggable="true"
                                    onDragEnd={(event) => {
                                        // prevent default behavior
                                        event.preventDefault();
                                        // move the tab appropriately
                                        this.handleDragEnd(event, index);
                                    }}
                                    // key to control re-rendering of tabs
                                    key={index}
                                    // make it active if this is the current tab
                                    className={`${view.active ? "active" : ""}`}>
                                    {/* show the display text on the tab */}
                                    {view.name}
                                    <img
                                        // source of the image (URL)
                                        src="https://png.icons8.com/material/50/000000/delete-sign.png"
                                        // text to display if it can't show up
                                        alt="Close Icon"
                                        // give it the styling for the close button, don't display a close button on the home tab (it can't be closed)
                                        className={`closeTabIcon ${view.name === "Home" ? "noClose" : ""}`}
                                        // callback when the "x" is clicked
                                        onClick={(event) => {
                                            // prevent default click behavior
                                            event.preventDefault();
                                            // if the "x" is clicked we should close the tab
                                            this.props.tabViewerActions.closeTab(index);
                                        }} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div >
        );
    }
}

TabViewer.propTypes = {
    "tabViewerActions": PropTypes.object.isRequired,
    "state": PropTypes.shape({
        "views": PropTypes.array.isRequired,
    }).isRequired,
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
