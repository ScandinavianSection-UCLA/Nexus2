import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import './UserNexus.css'
import {initializeGraph,initializeNodeCategories} from "./UserNexusModel";

const GraphHeight = (window.innerHeight)*0.8*.5;
// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    height: GraphHeight,
    highlightDegree: 1,
    highlightOpacity: 1,
    linkHighlightBehavior: false,
    maxZoom: 8,
    minZoom: 0.1,
    panAndZoom: true,
    staticGraph: false,
    node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue'
    },
    link: {
        highlightColor: 'lightblue'
    },

};


// graph event callbacks
const onClickNode = function(nodeId) {
    console.log('Clicked node ${nodeId}');
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

const restartSimulation = function(){
    console.log('restarted');
};

class UserNexus extends Component{

    constructor(){
        super();
        const graphData = JSON.parse(localStorage.getItem('graphData'));
        const nodeCategories = JSON.parse(localStorage.getItem('nodeCategories'));

        this.state = {
            data: graphData,
            nodeCategories:nodeCategories,
        }
    }

    componentWillMount(){
        //load data from localStorage
        const graphData = initializeGraph();
        const nodeCategories = initializeNodeCategories();

        //check for new nodes by comparing graphData['nodes'] with each of the nodeCategories

        this.setState({
            data: graphData,
            nodeCategories:nodeCategories,
        });
    }

    render(){

        console.log(this.props);

        return (<Graph
            className="UserNexus"
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={this.state.data}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
            onMouseOverNode={onMouseOverNode}
            onMouseOutNode={onMouseOutNode}
            onMouseOverLink={onMouseOverLink}
            onMouseOutLink={onMouseOutLink}
            ref="graph"
        />)
    }

}

export default UserNexus;