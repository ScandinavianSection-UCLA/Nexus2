import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import './UserNexus.css'

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
        this.state = {
            data: {
                nodes: [],
                // links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
                links:[],
            },
        }
    }

    componentWillMount(){
        this.setState({
            data:{
                nodes:this.props.nodes,
                links:[{ source: 'Harry', target: 'Sally' }],
            },
        })
    }

    updateNetwork(newNode){
        //check if newNode exists already
        //TODO: figure out how to add newNode
        console.log('updating network!');
        this.setState((oldState)=>{
            var newState = oldState;
            //add new node
            newState['data']['nodes'].push(newNode);
            //insert code for creating links
            newState['data']['links'].push({//new link
                });
            return {
                data:{
                    nodes:newState['data']['nodes'],
                    // links:newState['data']['links'],
                    links:[{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }],
                }
            }
        },()=>{
            console.log(this.state.data, this.refs.graph);
            // _initializeNodes();
            this.refs.graph.restartSimulation();
        })
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