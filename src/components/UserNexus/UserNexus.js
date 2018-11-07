// basic react functionality
import React, {Component} from "react";
// graph functionality for the NexusGraph
import {Graph} from "react-d3-graph";
// styling for the graph + buttons
import "./UserNexus.css";
// functions to get nodes + links
import {initializeGraph, initializeNodeCategories} from "./UserNexusModel";

// settings for the graph
const settings = {
    // highlight nodes + links when hovered
    "nodeHighlightBehavior": true,
    // set the height to center the graph
    "height": (window.innerHeight) * 0.8 * .5,
    // set the width to center the graph
    "width": (window.innerWidth) * 0.8 * .389,
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
        "highlightColor": "lightblue",
    },
};

class UserNexus extends Component {
    constructor() {
        super();
        // set a default state
        this.state = {
            // this will be overridden by componentWillMount()
            "data": {},
            // this will be overridden by componentWillMount()
            "nodeCategories": {},
            // by default show primary links
            "showPrimaryLinks": true,
            // by default show secondary links
            "showSecondaryLinks": true,
        };

        // properly bind these functions so that they can set the state
        this.togglePrimaryLinks = this.togglePrimaryLinks.bind(this);
        this.toggleSecondaryLinks = this.toggleSecondaryLinks.bind(this);
    }

    componentWillMount() {
        this.setState({
            // data = nodes + links from storage
            "data": initializeGraph(),
            // nodeCategories = all the nodes, categorized, loaded from storage
            "nodeCategories": initializeNodeCategories(),
        });
    }

    /**
     * Toggle whether or not to show the primary links on the graph
     */
    togglePrimaryLinks() {
        this.setState({
            "showPrimaryLinks": !this.state.showPrimaryLinks,
        });
    }

    /**
     * Toggle whether or not to show the secondary links on the graph
     */
    toggleSecondaryLinks() {
        this.setState({
            "showSecondaryLinks": !this.state.showSecondaryLinks,
        });
    }

    /**
     * Creates the graph and associated button, located at the top right of the home view
     * @returns {JSX} The resulting graph + button
     */
    render() {
        //
        let {data, showPrimaryLinks, showSecondaryLinks} = this.state;
        let finalData = {...data};
        if (showPrimaryLinks === false) {
            finalData["links"] = finalData["links"].filter(link => link["linkNode"] !== null);
        }
        if (showSecondaryLinks === false) {
            finalData["links"] = finalData["links"].filter(link => link["linkNode"] === null);
        }
        return (
            // div to conatin both the button and graph
            <div>
                {/* button that creates + opens the graph tab when clicked (Navigation.js:handleDisplayGraph())*/}
                <button onClick={this.props.expandGraph}>Expand Nexus Graph</button>
                {/* the actual graph */}
                <button onClick={this.togglePrimaryLinks}>Toggle Primary Links</button>
                <button onClick={this.toggleSecondaryLinks}>Toggle Secondary Links</button>
                <Graph
                    // CSS class
                    className="UserNexus"
                    // id is mandatory, if no id is defined rd3g will throw an error
                    id="graph-id"
                    // nodes + links to render
                    data={finalData}
                    // settings for the graph
                    config={settings}
                    ref="graph"
                />
            </div>
        );
    }
}

export default UserNexus;
