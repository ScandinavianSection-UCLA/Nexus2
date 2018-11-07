import React, {Component} from "react";
import {Graph} from "react-d3-graph";
import "./UserNexus.css";
import {initializeGraph, initializeNodeCategories} from "./UserNexusModel";

// set graph dimensions to make sure user nexus is centered
const GraphHeight = (window.innerHeight) * 0.8 * .5;
const GraphWidth = (window.innerWidth) * 0.8 * .389;
// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    "nodeHighlightBehavior": true,
    "height": GraphHeight,
    "width": GraphWidth,
    "highlightDegree": 1,
    "highlightOpacity": 1,
    "linkHighlightBehavior": false,
    "maxZoom": 8,
    "minZoom": 0.1,
    "panAndZoom": true,
    "staticGraph": false,
    "node": {
        "color": "lightgreen",
        "size": 120,
        "highlightStrokeColor": "blue",
    },
    "link": {
        "highlightColor": "lightblue",
    },

};

// graph event callbacks
const onClickNode = function(nodeId) {
    console.log(`Clicked node ${nodeId}`);
};

const onMouseOverNode = function(nodeId) {
    console.log(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = function(nodeId) {
    console.log(`Mouse out node ${nodeId}`);
};

const onClickLink = function(source, target) {
    console.log(`Clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function(source, target) {
    console.log(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function(source, target) {
    console.log(`Mouse out link between ${source} and ${target}`);
};

class UserNexus extends Component {
    constructor() {
        super();
        const graphData = JSON.parse(localStorage.getItem("graphData"));
        const nodeCategories = JSON.parse(localStorage.getItem("nodeCategories"));

        this.state = {
            "data": graphData,
            "nodeCategories": nodeCategories,
        };
    }

    componentWillMount() {
        // load data from localStorage
        const graphData = initializeGraph();
        const nodeCategories = initializeNodeCategories();

        // check for new nodes by comparing graphData['nodes'] with each of the nodeCategories

        this.setState({
            "data": graphData,
            "nodeCategories": nodeCategories,
        });
    }

    /**
     * Creates the graph and associated button, located at the top right of the home view
     * @returns {JSX} The resulting graph + button
     */
    render() {
        return (
            // div to conatin both the button and graph
            <div>
                {/* button that creates + opens the graph tab when clicked (Navigation.js:handleDisplayGraph())*/}
                <button onClick={this.props.expandGraph}>Expand Nexus Graph</button>
                {/* the actual graph */}
                <Graph
                    // CSS class
                    className="UserNexus"
                    // id is mandatory, if no id is defined rd3g will throw an error
                    id="graph-id"
                    // nodes + links to render
                    data={this.state.data}
                    // settings for the graph
                    config={myConfig}
                    // callback for when a node is clicked
                    onClickNode={onClickNode}
                    // callback for when a link is clicked
                    onClickLink={onClickLink}
                    // callback for when the mouse goes over a node
                    onMouseOverNode={onMouseOverNode}
                    // callback for when the mouse is no longer over a node
                    onMouseOutNode={onMouseOutNode}
                    // callback for when the mouse goes over a link
                    onMouseOverLink={onMouseOverLink}
                    // callback for when the mouse is no longer over a link
                    onMouseOutLink={onMouseOutLink}
                    ref="graph"
                />
            </div>
        );
    }

}

export default UserNexus;
