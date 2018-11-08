// basic react functionality
// styling for the graph
import "./NexusGraph.css";
import React, {Component} from "react";
// graph functionality for the NexusGraph
import {Graph} from "react-d3-graph";
// prop validation
import PropTypes from "prop-types";

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

// i would make this a `function MainGraph(props)`, but React says "Stateless function components cannot have refs." and refuses to run the app
class NexusGraph extends Component {
    /**
     * Creates the graph and associated button, located at the top right of the home view
     * @returns {JSX} The resulting graph + button
     */
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
            // id of the node
            "id": PropTypes.string.isRequired,
            // color of the node on the graph
            "color": PropTypes.string,
            // item associated with the node
            "item": PropTypes.any,
            // type of the node
            "type": PropTypes.string,
            // id referring to item
            "itemID": PropTypes.number,
        })).isRequired,
    }).isRequired,
    "settings": PropTypes.object.isRequired,
};

NexusGraph.defaultProps = {
    "data": {
        "nodes": [{"id": "blank"}],
        "links": [],
    },
    "settings": {},
};

export default NexusGraph;
