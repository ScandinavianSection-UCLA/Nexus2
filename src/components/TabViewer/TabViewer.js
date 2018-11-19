// react functionality
import React, {Component} from "react";
// the various possible views we could render
import Navigation from "../Navigation/Navigation";
import StoryView from "../StoryView/StoryView";
import PlaceView from "../PlaceView/PlaceView";
import PeopleView from "../PeopleView/PeopleView";
import FieldtripView from "../FieldtripView/FieldtripView";
import BookView from "../BookView/BookView";
import GraphView from "../NexusGraph/GraphView";
// functions to get info about PPFS
import * as model from "../../data-stores/DisplayArtifactModel";
// CSS styling
import "./TabViewer.css";
// prop validation
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
// actions to manipulate the tabs
import * as tabViewerActions from "../../actions/tabViewerActions";

class TabViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // by default, no search to load
            "searchWord": "",
            // starting off without a drag
            "dragIndicatorX": null,
        };
        // to be set once a render is complete
        this.dragIndicatorY = null;
        this.dragIndicatorHeight = null;
        // stores the left edge X-coordiantes of each tab
        this.tabs = [];
        // properly bind functions so that they can work in sub-elements
        this.handleKeywordSearch = this.handleKeywordSearch.bind(this);
        this.renderActiveTab = this.renderActiveTab.bind(this);
        this.handleLocationChanged = this.handleLocationChanged.bind(this);
    }

    /**
     * Render the main content of the app
     * @param {*} id ID of the relevant person/place/story/fieldtrip/book to load (irrelevant for NexusGraph, Home)
     * @param {String} type The type of view to load (People/Places/Fieldtrips/Stories/Home/Graph/Book)
     * @param {Number} tabIndex Index of the tab being rendered (only necessary for BookView)
     * @returns {JSX} The content of the relevant view
     */
    renderPPFS(id, type, tabIndex) {
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
            case "Home":
                // for the Home tab, return the main Navigation view (home), with the searchWord if set
                return <Navigation searchWord={this.state.searchWord} />;
            case "Graph":
                // for the graph, return the GraphView
                return <GraphView />;
            case "Book": {
                // const activeViewIndex = this.props.state.views.find((view) => view.type = type);
                // for the book, return the BookView, with the chapter ID that was selected
                return <BookView
                    page={this.props.state.views[tabIndex].id}
                    handleLocationChanged={this.handleLocationChanged}
                    nextPage={this.nextPage} />;
            }
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
        const activeViewIndex = this.props.state.views.findIndex((view) => view.active);
        const activeView = this.props.state.views[activeViewIndex];
        // return the rendered content of the tab
        return this.renderPPFS(activeView.id, activeView.type, activeViewIndex);
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

    /**
     * Calculate the drop index of a drag action
     * @param {Event} event Event describing the drag action
     * @returns {Number} The index where the tab would be dropped
     */
    findDragIndex({screenX}) {
        // find the index of the first tab such that the mouse was released to the left of its left edge
        // and go one of left of that to put it in the spot where the mouse currently is
        const newIndex = this.tabs.findIndex((tab) => screenX <= tab.x) - 1;
        switch (newIndex) {
            // if we went past the last left edge (waaaaay right)
            case -2:
                // tab should become the last tab in the list
                return this.tabs.length - 1;
            // if it was dropped at home or to the left of home
            case -1: case 0:
                // tab should become the second tab in the list (after home)
                return 1;
            // if it was dropped somewhere amidst the tabs
            default:
                // just go to where it was dropped appropriately
                return newIndex;
        }
    }

    // called when a tab begins being dragged
    handleDragStart(index) {
        // set the tab to be gray
        this.props.tabViewerActions.updateTab(index, {
            "color": "#aaaaaa",
        });
    }

    // called when a tab is being dragged
    handleDrag(event, index) {
        // get the index where this tab would be dropped
        const newIndex = this.findDragIndex(event, index);
        this.setState({
            // if drag is to the right, draw the drag indicator on the right of the tab where it would be dropped
            // if it was to the left, draw the indicator on the left of the tab where it would be dropped
            // if we are at the same index don't draw anything
            "dragIndicatorX": newIndex > index ? this.tabs[newIndex].right :
                newIndex < index ? this.tabs[newIndex].left : null,
        });
    }

    // called when a tab stops being dragged (is released)
    handleDragEnd(event, index) {
        // get the desired final index of the drag
        const newIndex = this.findDragIndex(event);
        // move the dragged tab to the desired spot
        this.props.tabViewerActions.moveTab(index, newIndex);
        // reset the tab back to normal color
        this.props.tabViewerActions.updateTab(newIndex, {
            "color": null,
        });
        // hide the drag indicator
        this.setState({
            "dragIndicatorX": null,
        });
    }

    // called when the book view goes to a new page
    handleLocationChanged(newPage) {
        this.props.tabViewerActions.updateTab(
            // update the active tab (i.e. the currently viewed book)
            this.props.state.views.findIndex((view) => view.active),
            {
                // to be on the new page
                "id": newPage,
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
                                            this.tabs[index] = instance.getBoundingClientRect();
                                            // set the Y coordinate of the drop indicator
                                            this.dragIndicatorY = instance.getBoundingClientRect().y;
                                            // set the height of the drop indicator
                                            this.dragIndicatorHeight = instance.getBoundingClientRect().height;
                                        }
                                    }}
                                    // callback when the tab is clicked
                                    onClick={() => {
                                        // if a tab is clicked, we should switch to that tab
                                        this.props.tabViewerActions.switchTabs(index);
                                    }}
                                    // make everything but the home tab draggable
                                    draggable={view.type !== "Home"}
                                    // called when the tab begins being dragged
                                    onDragStart={() => {
                                        // change the color of the dragged tab
                                        this.handleDragStart(index);
                                    }}
                                    // called while the tab is being dragged
                                    onDrag={(event) => {
                                        // render the little purple line indicator
                                        this.handleDrag(event, index);
                                    }}
                                    // called when the tab stops being dragged
                                    onDragEnd={(event) => {
                                        // move the tab appropriately to its final spot
                                        this.handleDragEnd(event, index);
                                    }}
                                    // key to control re-rendering of tabs
                                    key={index}
                                    // make it active if this is the current tab
                                    className={`${view.active ? "active" : ""}`}
                                    style={{
                                        // set the color of the tab to be the specified color, or default to the active/inactive color if not specified
                                        "backgroundColor": view.color,
                                    }}>
                                    {/* show the display text on the tab */}
                                    {view.name}
                                    {/* don't show a close button on the home tab */}
                                    {view.type !== "Home" &&
                                        <img
                                            // source of the image (URL)
                                            src="https://png.icons8.com/material/50/000000/delete-sign.png"
                                            // text to display if it can't show up
                                            alt="Close Icon"
                                            // give it the styling for the close button
                                            className="closeTabIcon"
                                            // callback when the "x" is clicked
                                            onClick={(event) => {
                                                // prevent a separate "tab was clicked" event from occuring once this tab gets closed
                                                event.stopPropagation();
                                                // close the desired tab
                                                this.props.tabViewerActions.closeTab(index);
                                            }} />}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {/* only display if we are currently dragging an element */}
                {this.state.dragIndicatorX !== null &&
                    // the drag indicator line
                    <div
                        // basic CSS for the moving line, position is defined dynamically here
                        id="dragIndicator"
                        // set up its position
                        style={{
                            // position it at the X-coordinate determined by drag functions
                            "left": this.state.dragIndicatorX,
                            // make it in line with tabs
                            "top": this.dragIndicatorY,
                            // make it as tall as the tabs
                            "height": this.dragIndicatorHeight,
                        }} />
                }
            </div>
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
