// basic react functionality
// styling for the graph
import "./NexusGraph.css";
import React, {Component} from "react";
// graph functionality for the NexusGraph
import {Graph} from "react-d3-graph";
// prop validation
import PropTypes from "prop-types";
// function to get a node on the graoh by its name
import {getNodeById} from "./NexusGraphModel";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

// basic settings for the graph, can be overriden with this.props
const settings = {
    // highlight nodes + links when hovered
    "nodeHighlightBehavior": true,
    // enable pan and zoom effects
    "panAndZoom": true,
    // settings for the nodes
    "node": {
        // this color only applies to the initial "blank" node, other nodes get custom colors by their type
        "color": "lightgreen",
        // size of the node
        "size": 120,
        // outline color of the node when it is highlighted (either on hover or via a hovered-on primary connected node)
        "highlightStrokeColor": "blue",
    },
    // settings for the links
    "link": {
        // link color when one of its endpoints is highlighted
        "highlightColor": "blue",
    },
};

class NexusGraph extends Component {
    /**
     * Creates the graph and associated button, located at the top right of the home view
     * @returns {JSX} The resulting graph + button
     */
    constructor() {
        super();
        // set an initial state
        this.state = {
            // initially, no node clicked
            "lastNodeClicked": null,
            // since no node is initially clicked, don't set a real time
            "lastNodeClickTime": 0,
        };

        // properly bind handleClickNode so it works on the nodes in the graph
        this.handleClickNode = this.handleClickNode.bind(this);
    }

    handleClickNode(nodeName) {
        // condition to treat it as a double click

        // if last click was within 1 second
        if (Date.now() - this.state.lastNodeClickTime < 1000 &&
            // and the same node was clicked both times,
            nodeName === this.state.lastNodeClicked) {
            // get the node matching the given name
            let node = getNodeById(nodeName, this.props.nodes);
            // assuming we properly retrieved the node
            if (node !== null) {
                // open up its tab
                // this.props.openNode(node["itemID"], nodeName, node["type"]);
                this.props.tabViewerActions.addTab(node["itemID"], nodeName, node["type"]);
            }
        } else {
            // too long between clicks or different nodes clicked, treat it as a single click
            this.setState({
                // update the latest click time to be now
                "lastNodeClickTime": Date.now(),
                // update the latest clicked node to be this node
                "lastNodeClicked": nodeName,
            });
        }
    }

    render() {
        return (
            <Graph
                // id is mandatory, if no id is defined rd3g will throw an error
                id="graph-id"
                // nodes + links to draw
                data={this.props.data}
                // settings for the graph
                config={{
                    // give it the base settings
                    ...settings,
                    // but override those with any passed settings
                    ...this.props.settings,
                }}
                ref="graph"
                // call the custom callback when a node is clicked
                onClickNode={this.handleClickNode}
            />
        );
    }
}

NexusGraph.propTypes = {
    "data": PropTypes.shape({
        "links": PropTypes.arrayOf(PropTypes.shape({
            "source": PropTypes.string.isRequired,
            "target": PropTypes.string.isRequired,
            "linkNode": PropTypes.any,
            "color": PropTypes.string,
        })).isRequired,
        "nodes": PropTypes.arrayOf(PropTypes.shape({
            "id": PropTypes.string.isRequired,
            "color": PropTypes.string,
            "item": PropTypes.any,
            "type": PropTypes.string,
            "itemID": PropTypes.number,
        })).isRequired,
    }).isRequired,
    "openNode": PropTypes.func.isRequired,
    "settings": PropTypes.object.isRequired,
};

NexusGraph.defaultProps = {
    "data": {
        "nodes": [{"id": "blank"}],
        "links": [],
    },
    "settings": {},
};
NexusGraph.propTypes = {
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
)(NexusGraph);
