// basic react functionality
import React, {Component} from "react";
// styling for the buttons
import "./GraphView.css";
// functions to get nodes + links
import {initializeGraph, initializeNodeCategories} from "./NexusGraphModel";
// the actual graph
import NexusGraph from "./NexusGraph";
// prop validation
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
// actions to manipulate the tabs
import * as tabViewerActions from "../../actions/tabViewerActions";

class GraphView extends Component {
    constructor(props) {
        super(props);
        // set a default state
        this.state = {
            // get nodes + links from storgae
            "data": initializeGraph(),
            // get categorized nodes from storage
            "nodeCategories": initializeNodeCategories(),
            // by default show primary links
            "showPrimaryLinks": true,
            // by default show secondary links
            "showSecondaryLinks": true,
            // update with any previous state stored in redux
            ...props.state.views[props.viewIndex].state,
        };

        // properly bind these functions so that they can set the state
        this.togglePrimaryLinks = this.togglePrimaryLinks.bind(this);
        this.toggleSecondaryLinks = this.toggleSecondaryLinks.bind(this);
    }

    componentWillUnmount() {
        // save state to redux for later
        this.props.actions.updateTab(this.props.viewIndex, {
            "state": this.state,
        });
    }

    /**
     * Toggle whether or not to show the primary links on the graph
     */
    togglePrimaryLinks() {
        this.setState((prevState) => ({
            // invert whether or not to show primary links
            "showPrimaryLinks": !prevState.showPrimaryLinks,
        }));
    }

    /**
     * Toggle whether or not to show the secondary links on the graph
     */
    toggleSecondaryLinks() {
        this.setState((prevState) => ({
            // invert whether or not to show secondary links
            "showSecondaryLinks": !prevState.showSecondaryLinks,
        }));
    }

    /**
     * Creates the graph and associated button, located at the top right of the home view
     * @returns {JSX} The resulting graph + button
     */
    render() {
        // get the current data and whether or not to show primary + secondary links
        let {data, showPrimaryLinks, showSecondaryLinks} = this.state;
        // get a copy of data BUT DO NOT MODIFY IT
        let finalData = {...data};
        // if we shouldn't show primary links
        if (showPrimaryLinks === false) {
            // filter out links without a linkNode (i.e. primary links)
            finalData.links = finalData.links.filter(link => link.linkNode !== null);
        }
        // if we shouldn't show secondary links
        if (showSecondaryLinks === false) {
            // filter out links with a linkNode (i.e. secondary links)
            finalData.links = finalData.links.filter(link => link.linkNode === null);
        }
        return (
            // div to contain both the button and graph
            <div className="grid-x NexusGraph">
                {/* contains the filters */}
                <form className="medium-3 cell grid-y" id="analysisTools">
                    <h3 className="cell" id="heading">Analysis Tools</h3>
                    {/* toggle primary links filter */}
                    <label className="cell tool">
                        <input
                            // make it a checkbox
                            type="checkbox"
                            // its state should be set by whether or not to show primary links
                            checked={this.state.showPrimaryLinks}
                            // when this is changed (i.e. pressed) call the togglePrimaryLinks function
                            onChange={this.togglePrimaryLinks} />
                        {/* give the text "Primary" a light blue color to indicate which links it matches to */}
                        Show <span className="lightblue">Primary</span> Links
                    </label>
                    <label className="cell tool">
                        <input
                            // make it a checkbox
                            type="checkbox"
                            // its state should be set by whether or not to show secondary links
                            checked={this.state.showSecondaryLinks}
                            // when this is changed (i.e. pressed) call the toggleSecondaryLinks function
                            onChange={this.toggleSecondaryLinks} />
                        {/* give the text "Secondary" a light green color to indicate which links it matches to */}
                        Show <span className="lightgreen">Secondary</span> Links
                    </label>

                    <table className="legend hover unstriped cell">
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Type of Node</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className="circle blue"> </div></td>
                                <td>People</td>
                            </tr>
                            <tr>
                                <td><div className="circle red"> </div></td>
                                <td>Places</td>
                            </tr>
                            <tr>
                                <td><div className="circle grey"> </div></td>
                                <td>Stories</td>
                            </tr>
                            <tr>
                                <td><div className="circle green"> </div></td>
                                <td>Fieldtrips</td>
                            </tr>
                        </tbody>
                    </table>

                </form>
                {/* the actual graph */}
                <div>
                    <NexusGraph
                        // give it 3/4 of the screen width
                        className="medium-9 cell"
                        // nodes + links for the graph to render
                        data={finalData}
                        // a totality of all the nodes, sorted by type
                        nodes={this.state.nodeCategories}
                        // function to open a node's page if clicked
                        openNode={this.props.openNode}
                        // custom settings for the graph
                        settings={{
                            // set the height to occupy most of the screen
                            "height": (window.innerHeight) * 0.83,
                            // set the width to be just under 3/4 the screen width (so it doesn't overflow into a new row)
                            "width": window.innerWidth * 0.745,
                        }}
                    />
                </div>
            </div>
        );
    }
}

GraphView.propTypes = {
    "openNode": PropTypes.func.isRequired,
};

// export default GraphView;

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
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GraphView);
