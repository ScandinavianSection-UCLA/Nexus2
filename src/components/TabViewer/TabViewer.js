// react functionality
import React, {Component} from "react";
// the various possible views we could render
import HelpView from "../HelpView/HelpView";
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
            // starting off without a drag
            "dragIndicatorX": null,
        };
        // to be set once a render is complete
        this.dragIndicatorY = null;
        this.dragIndicatorHeight = null;
        // used for drag events
        this.desiredIndex = null;
        this.originalIndex = null;
        // stores the left edge X-coordiantes of each tab
        this.tabs = [];
        // properly bind functions so that they can work in sub-elements
        this.renderActiveTab = this.renderActiveTab.bind(this);
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
                // for stories, return a StoryView with the story retrieved by the passed ID
                return <StoryView story={model.getStoryByID(id)} />;
            case "Home":
                // for the Home tab, return the main Navigation view (home)
                return <Navigation />;
            case "Graph":
                // for the graph, return the GraphView
                return <GraphView />;
            case "Book": {
                // for the book, return the BookView, with the chapter ID that was selected
                return <BookView viewIndex={tabIndex} id={id}/>;
            }
            case "Help":
                return <HelpView />
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

    // called when a tab begins being dragged
    handleDragStart(event, index) {
        // set the tab to be gray
        event.target.style.backgroundColor = "#aaaaaa";
        // set appropriate data for the drag
        this.originalIndex = index;
        // so that Firefox actually lets us drag stuff
        event.dataTransfer.setData("text/plain", this.props.state.views[index].name);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
    }

    // called when a drag goes over a new tab
    handleDragEnter(event, newIndex) {
        // update where the tab would be placed if released
        this.desiredIndex = newIndex;
        this.setState({
            // if drag is to the right, draw the drag indicator on the right of the tab where it would be dropped
            // if it was to the left, draw the indicator on the left of the tab where it would be dropped
            // if we are at the same index don't draw anything
            "dragIndicatorX": newIndex > this.originalIndex ? this.tabs[newIndex].right
                : newIndex < this.originalIndex ? this.tabs[newIndex].left : null,
        });
    }

    // called when a tab stops being dragged (is released)
    handleDragEnd(event) {
        // move the dragged tab to the desired spot
        this.props.tabViewerActions.moveTab(this.originalIndex, this.desiredIndex);
        // reset indices of drag
        this.originalIndex = null;
        this.desiredIndex = null;
        // reset the tab's color
        event.target.style.backgroundColor = null;
        // hide the drag indicator
        this.setState({
            "dragIndicatorX": null,
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
                        {this.props.state.views.map((view, index) => (
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
                                    // called when the tab begins being dragged, changes color of the dragged tab
                                    onDragStart={(event) => {
                                        this.handleDragStart(event, index);
                                    }}
                                    // called when the drag goes over a new tab
                                    onDragEnter={(event) => {
                                        // change the drag indicator appropriately
                                        this.handleDragEnter(event, index);
                                    }}
                                    // called when the tab stops being dragged, move that tab to its new spot
                                    onDragEnd={this.handleDragEnd.bind(this)}
                                    // key to control re-rendering of tabs
                                    key={index}
                                    // make it active if this is the current tab
                                    className={`${view.active ? "active" : ""}`}
                                    style={{
                                        // set the color of the tab to be the specified color, or default to the active/inactive color if not specified
                                        "backgroundColor": view.color,
                                    }}>
                                    {/*Display pin on everything except home tab */}
                                    {view.type !== "Home" &&
                                    <img
                                        // source of the image (URL)
                                        src={view.pinned ? "https://img.icons8.com/ios/50/000000/pin-2-filled.png":"https://img.icons8.com/ios/50/000000/pin-2.png"}
                                        // text to display if it can't show up
                                        alt="to pin icon"
                                        // give it the styling for the pin button
                                        className="pinTabIcon"
                                        // callback when the "x" is clicked
                                        onClick={(event) => {
                                            // prevent a separate "tab was clicked" event from occuring once this tab gets closed
                                            event.stopPropagation();
                                            // close the desired tab
                                            this.props.tabViewerActions.pinTab(index);
                                        }} />}
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
                            ))}
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

/**
 * Set certain props to access Redux states
 * @param {Object} state All possible Redux states
 * @returns {Object} Certain states that are set on props
 */
function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
    };
}

/**
 * Set the "tabViewerActions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "tabViewerActions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabViewer);
