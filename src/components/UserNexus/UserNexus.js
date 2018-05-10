import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import './UserNexus.css'
import {arrayTransformation} from "../../utils";
import {getStoryByID} from "../TabViewer/model";

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue'
    },
    link: {
        highlightColor: 'lightblue'
    }
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
        var nodes,links;
        if(graphData === null){
            nodes = [{id:'blank'}];
            links = [];
        } else {
            nodes = graphData['nodes'];
            links = graphData['links']
        }
        this.state = {
            data: {
                nodes:nodes,
                links:links,
            },
            nodeCategories:{
                People:[],
                Places:[],
                Stories:[],
            },
        }
    }

    componentWillMount(){
        //load data from localStorage
        const graphData = JSON.parse(localStorage.getItem('graphData'));
        const nodeCategories = JSON.parse(localStorage.getItem('nodeCategories'));
        var nodes,links;
        if(graphData === null){
            nodes = [{id:'blank'}];
            links = [];
        } else {
            nodes = graphData['nodes'];
            links = graphData['links']
        }
        this.setState({
            data: {
                nodes:nodes,
                links:links,
                // nodes:[{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
                // links:[{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }],
                nodeCategories:nodeCategories,
            },
        });
    }

    findLinks(newNode){
        var links = [],
            currItemPeople = [], //array of all people associated with newNode
            currItemPlaces = [], //arry of all places associated with newNode
            currItemStories = [], //array of all stories associated with newNode
            currItem = newNode['item'];
        //fill out currItem arrays
        switch(newNode['type']){
            case 'Stories':
                //get full story object
                currItem = getStoryByID(newNode['itemID']);

                //fill out currItem arrays
                //TODO: fix currItem fillings, not filling atm.
                currItemPeople = arrayTransformation(currItem['informant_id']);
                currItemPlaces = arrayTransformation(currItem['places']['place']);
                currItemStories = arrayTransformation(currItem['stories_mentioned']['story']);

                console.log(currItemStories, currItemPeople, currItemPlaces);
                break;
        }
        //compare with arrays of all types
        console.log(this.state.nodeCategories['Stories'].diff(currItemStories,'Stories'));
        //return array of links
    }

    updateNetwork(newNode){
        //check if item exists already
        var itemExists = this.state.data['nodes'].includes(newNode);

        if(!itemExists){
            console.log('updating network!', newNode);
            this.setState((oldState)=>{

                var newState = oldState;

                newState['data']['nodes'].push(newNode);

                //insert code for creating links
                this.findLinks(newNode);

                newState['data']['links'].push({//new link

                });

                //add to appropriate array of stuff
                newState['nodeCategories'][newNode.type].push(newNode);

                return {
                    data:{
                        nodes:newState['data']['nodes'],
                        // links:newState['data']['links'],
                        links:[],
                    },
                    nodeCategories:newState['nodeCategories'],
                }
            },()=>{
                //add node to localStorage
                localStorage.setItem('graphData', JSON.stringify(this.state.data));

                this.refs.graph.restartSimulation();
            })
        }
    }

    render(){
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