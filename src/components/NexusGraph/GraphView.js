// basic react functionality
import React, {Component} from "react";
// styling for the buttons
import "./GraphView.css";
// functions to get nodes + links
import {getNodeById, initializeGraph, initializeNodeCategories} from "./NexusGraphModel";
// the actual graph
import NexusGraph from "./NexusGraph";
// prop validation
import PropTypes from "prop-types";
import * as model from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation} from "../../utils";
import {nodeColors} from "./NexusGraphModel"
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
// actions to manipulate the tabs
import * as tabViewerActions from "../../actions/tabViewerActions";
import JSZip from "jszip";
import FileSaver from 'file-saver';
import MapView from "../MapView/MapView";
import {getPlacesByID} from "../../data-stores/DisplayArtifactModel";
import {getStoryByID} from "../../data-stores/DisplayArtifactModel";

class GraphView extends Component {
    constructor(props) {
        super(props);
        // set a default state
        this.state = {
            // get nodes + links from storage
            "data": initializeGraph(),
            // get categorized nodes from storage
            "nodeCategories": initializeNodeCategories(),
            // by default show primary links
            "showPrimaryLinks": true,
            // by default show secondary links
            "showSecondaryLinks": true,
            // by default show link labels
            "showLinkLabels": true,
            "highlighted": {
                "People": false,
                "Places": false,
                "Stories": false,
                "Fieldtrips": false,
            },
            "active": {
                "People": false,
                "Places": false,
                "Stories": false,
                "Fieldtrips": false,
            },
            "lastClickedNode": {"id": "Blank"},
            "showMenu": false,
            // update with any previous state stored in redux
            ...props.state.views[props.viewIndex].state,
        };

        // properly bind these functions so that they can set the state
        this.togglePrimaryLinks = this.togglePrimaryLinks.bind(this);
        this.toggleSecondaryLinks = this.toggleSecondaryLinks.bind(this);
        this.toggleLinkLabels = this.toggleLinkLabels.bind(this);
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
     * Toggle whether or not to show the link labels on the graph
     */
    toggleLinkLabels() {
        this.setState((prevState) => ({
            // invert whether or not to show labels
            "showLinkLabels": !prevState.showLinkLabels,
        }));
    }

    allFalse() {
        for(let nodeType in this.state.highlighted)
            if(this.state.highlighted[nodeType]) return false;

        return true;
    }

    /**
     * the click handler for type of node when type isn't highlighted
     */
    highlightGraphNode(){
        this.setState((prevState)=>{
            let NewState = prevState;
            // updating the nodes array with new node properties
            NewState.data.nodes = NewState.data.nodes.map(
                (node)=>{
                    if(NewState.highlighted[node.type]){
                        node["size"] = 200;
                        node["color"] = nodeColors[node.type];
                    } else {
                        node["color"] = "lightgrey";
                    }
                    return node;
                }
                );
            return NewState;
        });
    }

    /**
     * the click handler to unhighlight the nodes
     * @param {String} nodeType
     */
    unhighlightGraphNode(nodeType){
        this.setState(
            (prevState)=>{
                let NewState = prevState;
                // updating the nodes array with new node properties
                NewState.data.nodes = NewState.data.nodes.map(
                    (node)=>{
                        if(this.allFalse.bind(this)()){
                            node["color"] = nodeColors[node.type];
                            node["size"] = 120;
                        }
                        else if (node.type === nodeType){
                            node["size"] = 120;
                            node["color"] = "lightgrey";
                        }
                        return node;
                    }
                );
                return NewState;
            }
        );
    }

    /**
     * toggle the highlighted state of the node type table
     */
    toggleNodeHighlight(nodeType){
        this.setState((prevState)=>{
            let NewState = prevState;
            NewState.highlighted[nodeType] = !NewState.highlighted[nodeType];
            NewState.active[nodeType] = !NewState.active[nodeType];
            if(this.state.highlighted[nodeType]){
                this.highlightGraphNode();
            } else {
                this.unhighlightGraphNode(nodeType);
            }
            return NewState;
        });
    }

    legendCircleColor(nodeType) {
        if(this.allFalse.bind(this)() || this.state.highlighted[nodeType]){
            return "circle " + nodeColors[nodeType];
        } else {
            return "circle lightgrey";
        }
    }

    /**
     * Creates and downloads 2 zipped csv files with node and edge data from nexus graph
     */
    createCSVFiles() {
        let nodeData = [["Node_ID", "Node_Label", "Node_Type"]];
        let id = 0;
        this.state.data.nodes.forEach((node) => {
            nodeData.push([id, node.id, node.type]);
            id += 1;
        });
        let csvNodeContent = nodeData.map(e => e.join(",")).join("\n");

        let edgeData = [["Source_ID", "Target_ID", "Label"]];
        let sourceID = -1;
        let targetID = -1;
        this.state.data.links.forEach((link) => {
            nodeData.forEach((row) => {
                if (row[1] === link.source) {
                    sourceID = row[0];
                }
                if (row[1] === link.target) {
                    targetID = row[0];
                }
            });
            edgeData.push([sourceID, targetID, link.label]);
        });
        let csvEdgeContent = edgeData.map(e => e.join(",")).join("\n");

        let zip = new JSZip();
        zip.file("folklore_graph_nodes.csv", csvNodeContent);
        zip.file("folklore_graph_edges.csv", csvEdgeContent);
        zip.generateAsync({type: "blob"}).then(function(content) {
            FileSaver.saveAs(content, "folklore_graph_data.zip");
        });
    }

    /**
     * Opens last clicked node in a new tab
     */
    openNodeTab() {
        let node = this.state.lastClickedNode;
        this.props.actions.addTab(node.itemID, node.id, node.type);
        // hide menu
        this.setState((prevState)=>{
            let NewState = prevState;
            NewState.showMenu = false;
            return NewState;
        });
    }

    /**
     * Removes last clicked node from the nexus graph
     */
    removeNode() {
        let node = this.state.lastClickedNode;
        let i = 0;
        let index = -1;
        this.state.data.nodes.forEach((testNode) => {
            if (testNode.id === node.id) {
                index = i;
            }
            i++;
        });
        this.setState((prevState)=>{
            let NewState = prevState;
            if (index > -1) {
                NewState.data.nodes.splice(index, 1);
            }
            let linkMatches = [];
            NewState.data.links.forEach((testLink) => {
                if (testLink.source === node.id || testLink.target === node.id) {
                    linkMatches.push(testLink);
                }
            });
            let len = linkMatches.length;
            if (len > 0) {
                let li = 0;
                while (li < len) {
                    let linkIndex = NewState.data.links.indexOf(linkMatches[li]);
                    console.log(linkIndex);
                    NewState.data.links.splice(linkIndex, 1);
                    li++;
                }
            }
            NewState.showMenu = false;
            return NewState;
        }, () => {console.log(this.state)});
    }

    /**
     * Updates lastClickedNode and shows node menu
     * @param {Object} node The last node that was double clicked
     */
    handleLastCLickedNode(node) {
        this.setState((prevState)=>{
            let NewState = prevState;
            NewState.lastClickedNode = node;
            NewState.showMenu = true;
            return NewState;
        });
    }

    /**
     * shows the node legend
     */
    resetMenu() {
        this.setState((prevState)=>{
            let NewState = prevState;
            NewState.showMenu = false;
            return NewState;
        });
    }

    /**
     * gets the preview to display for the last clicked node
     */
    getPreview() {
        console.log(this.state.lastClickedNode);
        let node = this.state.lastClickedNode;
        if (node.type === "People") {
            if (node.item.hasOwnProperty("intro_bio")) {
                return node.item.intro_bio;
            }
        }
        if (node.type === "Places") {
            let place = getPlacesByID(node.itemID);
            return <MapView key={0} places={[place]}/>;
        }
        if (node.type === "Stories") {
            let story = getStoryByID(node.itemID);
            console.log(story);
            if (story.hasOwnProperty("english_publication")) {
                return story.english_publication;
            }
        }
        if (node.type === "Fieldtrips") {
            return <MapView places={node.item.places_visited.place} view={"Fieldtrip"} />;
        }
        return "No Preview Available";
    }

    /**
     * Creates the graph and associated button, located at the top right of the home view
     * @returns {JSX} The resulting graph + button
     */
    render() {
        // get the current data and whether or not to show primary + secondary links
        let {data, showPrimaryLinks, showSecondaryLinks, showLinkLabels} = this.state;
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
        // if we shouldn't show link labels
        if (showLinkLabels === false) {
            // remove labels from links
            finalData.links = finalData.links.map((link) => {
                link.label = "";
                return link;
            });
        } else {
            // show labels
            finalData.links = finalData.links.map((link) => {
                link.label = link.hiddenLabel;
                return link;
            });
        }
        let clickedNodeId = this.state.lastClickedNode.id;
        let preview = this.getPreview.bind(this)();
        return (
            // div to contain both the button and graph
            <div className="grid-x NexusGraph">
                {/* contains the filters */}
                <form className="medium-3 cell grid-y" id="analysisTools">
                    <h3 className="cell" id="heading">Display Options</h3>
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
                    <label className="cell tool">
                        <input
                            // make it a checkbox
                            type="checkbox"
                            // its state should be set by whether or not to show link labels
                            checked={this.state.showLinkLabels}
                            // when this is changed (i.e. pressed) call the toggleLinkLabels function
                            onChange={this.toggleLinkLabels} />
                        Show Link Labels
                    </label>

                    <table className={!this.state.showMenu ? "legend hover unstriped cell" : "hidden"}>
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Type of Node</th>
                            </tr>
                        </thead>
                        <tbody className="legend-table-body">
                            <tr className={this.state.active["People"] ? "highlighted-row" : null} onClick={ (e) => {
                                e.preventDefault();
                                this.toggleNodeHighlight.bind(this)("People")} }>
                                <td><div className={this.legendCircleColor.bind(this)("People")}> </div></td>
                                <td>People</td>
                            </tr>
                            <tr className={this.state.active["Places"] ? "highlighted-row" : null} onClick={ (e) => {
                                e.preventDefault();
                                this.toggleNodeHighlight.bind(this)("Places")} }>
                                <td><div className={this.legendCircleColor.bind(this)("Places")}> </div></td>
                                <td>Places</td>
                            </tr>
                            <tr className={this.state.active["Stories"] ? "highlighted-row" : null} onClick={ (e) => {
                                e.preventDefault();
                                this.toggleNodeHighlight.bind(this)("Stories")} }>
                                <td><div className={this.legendCircleColor.bind(this)("Stories")}> </div></td>
                                <td>Stories</td>
                            </tr>
                            <tr className={this.state.active["Fieldtrips"] ? "highlighted-row" : null} onClick={ (e) => {
                                e.preventDefault();
                                this.toggleNodeHighlight.bind(this)("Fieldtrips")} }>
                                <td><div className={this.legendCircleColor.bind(this)("Fieldtrips")}> </div></td>
                                <td>Fieldtrips</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className={this.state.showMenu ? "legend hover unstriped cell" : "hidden"}>
                        <thead>
                        <tr>
                            <th>{clickedNodeId}</th>
                        </tr>
                        </thead>
                        <tbody className="legend-table-body">
                        <tr>
                            <td className={preview === "No Preview Available" ? "hidden" : "preview"}>{preview}</td>
                            <div className={preview === "No Preview Available" ? "callout alert no-preview" : "hidden"}>
                                <h6>No preview available.</h6>
                            </div>
                        </tr>
                        <tr>
                            <button className="button primary node-options" onClick={(e) => {
                                e.preventDefault();
                                this.openNodeTab.bind(this)()}}>
                                View {clickedNodeId} Page
                            </button>
                            <button className="button alert node-options" onClick={(e) => {
                                e.preventDefault();
                                this.removeNode.bind(this)()}}>
                                Delete Node
                            </button>
                            <button className="button secondary node-options" onClick={(e) => {
                                e.preventDefault();
                                this.resetMenu.bind(this)()}}>
                                Back to Node Legend
                            </button>
                        </tr>
                        </tbody>
                    </table>

                    <div className="download-wrapper">
                        <button className="tool download button secondary" onClick={(e) => {
                            e.preventDefault();
                            this.createCSVFiles.bind(this)()}}>
                            Download graph
                        </button>
                    </div>

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
                        // function to open menu for double clicked node
                        getLastClickedNode={this.handleLastCLickedNode.bind(this)}
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
