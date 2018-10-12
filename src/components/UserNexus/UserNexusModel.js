import {getStoryByID, getPeopleByID} from "../TabViewer/model";
import {arrayTransformation} from "../../utils";

//Model initializer
export function initializeGraph(){
    const graphData = JSON.parse(sessionStorage.getItem('graphData'));
    var nodes,links;
    if(graphData === null){
        nodes = [{id:'blank'}];
        links = [];
    } else {
        nodes = graphData['nodes'];
        links = graphData['links']
    }
    return {
        nodes:nodes,
        links:links,
    }
}

export function initializeNodeCategories(){
    const nodeCategories = JSON.parse(sessionStorage.getItem('nodeCategories'));
    var People, Places, Stories, Fieldtrips;
    if(nodeCategories===null){
        People = [];
        Places = [];
        Stories = [];
        Fieldtrips = [];
    } else {
        //fill data from localstorage
        People = nodeCategories['People'];
        Places = nodeCategories['Places'];
        Stories = nodeCategories['Stories'];
        Fieldtrips = nodeCategories['Fieldtrips'];
    }
    return {
        People:People,
        Places:Places,
        Stories:Stories,
        Fieldtrips: Fieldtrips
    }
}

// "Smart" function
export function addNode(id, name, type, item){
    var newNode = createNode(id, name, type, item);

    //initialize localstorage items
    var graphData = initializeGraph();
    var nodeCategories = initializeNodeCategories();

    //check if length is 2 that means there's still the blank node
    if(graphData['nodes'][0]['id'] === 'blank'){
        graphData['nodes'].splice(0,1);
    }

    //check if newNode already exists
    var itemExists = graphData['nodes'].includes(newNode);

    //if it's new then add to graphData{ nodes:[] }
    if(!itemExists){
        graphData['nodes'].push(newNode);
    }

    // check/create for links
    graphData['links'] = graphData['links'].concat(createLinkage(newNode,nodeCategories));
    console.log(newNode['type']);
    nodeCategories[newNode['type']].push(newNode);
    sessionStorage.setItem('nodeCategories', JSON.stringify(nodeCategories));
    sessionStorage.setItem('graphData', JSON.stringify(graphData));
}

//"dumb function"
export function createNode(id, name, type, item){
    var nodeColor='';

    switch(type){
        case 'People':
            nodeColor = 'blue';
            break;
        case 'Places':
            nodeColor = 'red';
            break;
        case 'Stories':
            nodeColor = 'grey';
            break;
        case 'Fieldtrips':
            nodeColor = 'green';
            break;
        default:
            nodeColor = 'black';
    }

    return {
        id:name,
        color:nodeColor,
        item:item,
        type:type,
        itemID:id,
    };
}

//"dumb function"
export function createLinkage(newNode, nodeCategories){
    //initialize cleaned up arrays to make type comparison by array
    var links = [],
        currItemPeople = [], // array of all people associated with newNode
        currItemPlaces = [], // array of all places associated with newNode
        currItemInformantStories = [], // array of all stories associated with newNode
        currItem = newNode['item'],
        currInformant;
    //fill out currItem arrays
    switch(newNode['type']){
        case 'Stories':
            //get full story object
            currItem = getStoryByID(newNode['itemID']);
            currInformant = getPeopleByID(currItem['informant_id']); //2nd degree link by people

            //fill out currItem arrays
            currItemPeople = arrayTransformation(currItem['informant_id']);
            currItemPlaces = arrayTransformation(currItem['places']['place']).map( place => place['place_id'] );
            currItemInformantStories = arrayTransformation(currInformant['stories']).map( story => story['story_id'] );

            break;
    }
    //turn nodeCategories into id's
    var pastStories = nodesToIDArray(nodeCategories,'Stories');
    var pastPlaces = nodesToIDArray(nodeCategories,'Places');
    var pastPeople = nodesToIDArray(nodeCategories,'People');
    //TODO: 2nd degree links
    //compare with arrays of all types
    var MatchingNodes = {
        'Stories' : currItemInformantStories.diff(pastStories), //stories that share the same author
        'Places' : currItemPlaces.diff(pastPlaces),
        'People' : currItemPeople.diff(pastPeople),
    };
    //TODO: delete links if connecting node is revealed + create links to connecting node (i.e. stories all share an author, author gets clicked, links between stories will be deleted)
    if(MatchingNodes['Stories'] !== undefined){
        //{ source: 'Harry', target: 'Sally' }
        //link newNode with node from nodeCategories
        var link, matchNode, linkNode;
        for(var type in MatchingNodes){
            MatchingNodes[type].forEach((match)=>{
                switch(type){
                    case 'Stories':
                        linkNode = currInformant;
                        break;
                    case 'People':
                        linkNode = {};
                        break;
                    case 'Places':
                        linkNode = {};
                        break;
                    default:
                        linkNode = {};
                }
               matchNode = getNode(nodeCategories[type],match);
               link = {
                   source: newNode['id'],
                   target: matchNode['id'],
                   linkNode:linkNode, //what is linking it
               };
               console.log(link);
               links.push(link);
            });
        }
    }
    //return array of new links
    return links;
}

function getNode(nodes,typeID){
    console.log(nodes);
    var matchNode;
    nodes.forEach((node)=>{
        if(node['itemID'] === typeID){
            matchNode = node;
        }
    });
    return matchNode;
}

function nodesToIDArray(nodeCategories,type){
    var IDArray = [];
    nodeCategories[type].forEach((node)=>{
       IDArray.push(node['itemID']);
       //  console.log(node);
    });
    return IDArray;
}
