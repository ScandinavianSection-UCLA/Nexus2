// basic react functionality
import React, {Component} from "react";
// styling for the buttons
import "./GraphView.css";
// functions to get nodes + links
import {initializeGraph} from "./NexusGraphModel";
// the actual graph
import NexusGraph from "./NexusGraph";

class GraphView extends Component {
    constructor() {
        super();
        // set a default state
        this.state = {
            // this will be overridden by componentWillMount()
            "data": {},
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
        });
    }

    /**
     * Toggle whether or not to show the primary links on the graph
     */
    togglePrimaryLinks() {
        this.setState(function(prevState) {
            return {
                // invert whether or not to show primary links
                "showPrimaryLinks": !prevState.showPrimaryLinks,
            };
        });
    }

    /**
     * Toggle whether or not to show the secondary links on the graph
     */
    toggleSecondaryLinks() {
        this.setState(function(prevState) {
            return {
                // invert whether or not to show secondary links
                "showSecondaryLinks": !prevState.showSecondaryLinks,
            };
        });
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
            finalData["links"] = finalData["links"].filter(link => link["linkNode"] !== null);
        }
        // if we shouldn't show secondary links
        if (showSecondaryLinks === false) {
            // filter out links with a linkNode (i.e. secondary links)
            finalData["links"] = finalData["links"].filter(link => link["linkNode"] === null);
        }
        return (
            // div to contain both the button and graph
            <div>
                <form>
                    <label>
                        Show <span className="lightblue">Primary</span> Links:
                        <input
                            name="primaryLinks"
                            type="checkbox"
                            checked={this.state.showPrimaryLinks}
                            onChange={this.togglePrimaryLinks} />
                    </label>
                    <label>
                        Show <span className="lightgreen">Secondary</span> Links:
                        <input
                            name="primaryLinks"
                            type="checkbox"
                            checked={this.state.showSecondaryLinks}
                            onChange={this.toggleSecondaryLinks} />
                    </label>
                </form>
                {/* the actual graph */}
                <NexusGraph
                    data={finalData}
                    settings={{
                        // set the height to occupy most of the screen
                        "height": (window.innerHeight) * 0.8,
                        // set the width to occupy the whole width of the screen
                        "width": window.innerWidth,
                    }}
                />
            </div>
        );
    }
}

export default GraphView;
