// functions to get people, places, stories
import {
    getFieldtripsByID,
    getPeopleByID,
    getPlacesByID,
    getStoryByID,
} from "../TabViewer/model";
// function to ensure an input is an array
import {arrayTransformation} from "../../utils";

// model initializer
export function initializeGraph() {
    const graphData = JSON.parse(sessionStorage.getItem("graphData"));
    var nodes, links;
    if (graphData === null) {
        nodes = [{"id": "blank"}];
        links = [];
    } else {
        nodes = graphData["nodes"];
        links = graphData["links"];
    }
    return {
        "nodes": nodes,
        "links": links,
    };
}

export function initializeNodeCategories() {
    const nodeCategories = JSON.parse(sessionStorage.getItem("nodeCategories"));
    var People, Places, Stories, Fieldtrips;
    if (nodeCategories === null) {
        People = [];
        Places = [];
        Stories = [];
        Fieldtrips = [];
    } else {
        // fill data from localstorage
        People = nodeCategories["People"];
        Places = nodeCategories["Places"];
        Stories = nodeCategories["Stories"];
        Fieldtrips = nodeCategories["Fieldtrips"];
    }
    return {
        "People": People,
        "Places": Places,
        "Stories": Stories,
        "Fieldtrips": Fieldtrips,
    };
}

// "Smart" function
export function addNode(id, name, type, item) {
    var newNode = createNode(id, name, type, item);

    // initialize localstorage items
    var graphData = initializeGraph();
    var nodeCategories = initializeNodeCategories();

    // check if length is 2 that means there's still the blank node
    if (graphData["nodes"][0]["id"] === "blank") {
        graphData["nodes"].splice(0, 1);
    }

    // check if newNode already exists
    var itemExists = graphData["nodes"].includes(newNode);

    // if it's new then add to graphData{ nodes:[] }
    if (!itemExists) {
        graphData["nodes"].push(newNode);
    }

    // check/create for links
    graphData["links"] = graphData["links"].concat(createLinkage(newNode, nodeCategories));
    nodeCategories[newNode["type"]].push(newNode);
    sessionStorage.setItem("nodeCategories", JSON.stringify(nodeCategories));
    sessionStorage.setItem("graphData", JSON.stringify(graphData));
}

// "dumb function"
export function createNode(id, name, type, item) {
    var nodeColor = "";

    switch (type) {
        case "People":
            nodeColor = "blue";
            break;
        case "Places":
            nodeColor = "red";
            break;
        case "Stories":
            nodeColor = "grey";
            break;
        case "Fieldtrips":
            nodeColor = "green";
            break;
        default:
            nodeColor = "black";
    }

    return {
        "id": name,
        "color": nodeColor,
        "item": item,
        "type": type,
        "itemID": id,
    };
}

/**
 * Create linkages for a node
 * @param {Node} node The node to create linkages for
 * @param {Array} nodeCategories An array of nodes to use to find linkages
 * @returns {Array} An array containing the formed linkages
 */
export function createLinkage({id, itemID, type}, nodeCategories) {
    // nodeCategories = array of already existing nodes

    // array to contain formed linkages
    let links = [],
        // array of people associated with node
        currItemPeople = [],
        // array of places associated with node
        currItemPlaces = [],
        // array of stories associated with node
        currItemStories = [],
        // currently only used to store author of a story
        currInformant;

    // initialize the variables based on the type of node
    switch (type) {
        case "Stories": {
            // get the informant's ID, places relevant to this story
            const {informant_id, places} = getStoryByID(itemID);
            // get the author
            currInformant = getPeopleByID(informant_id);

            // stores the author's ID as a single element array
            currItemPeople = [informant_id];
            // extract relevant places, ensure that it is an array, and get their IDs
            currItemPlaces = arrayTransformation(places["place"]).map(place => place["place_id"]);
            // extract author's stories, ensure that it is an array, and get their IDs
            currItemStories = arrayTransformation(currInformant["stories"]).map(story => story["story_id"]);

            break;
        }
        case "People": {
            // get the person's relevant places and stories
            const {places, stories} = getPeopleByID(itemID);

            // doesn't seem that there are any first-degree associated people for other people
            currItemPeople = [];
            // extract relevant places, ensure that it is an array, and get their IDs
            currItemPlaces = arrayTransformation(places).map(place => place["place_id"]);
            // extract stories, ensure that it is an array, and get their IDs
            currItemStories = arrayTransformation(stories).map(story => story["story_id"]);

            break;
        }
        case "Places": {
            // get the place's relevant people and stories
            const {people, storiesCollected, storiesMentioned} = getPlacesByID(itemID);

            // oh dear god please fix the data so i dont have to do this weird stuff
            // basically here's how the data currently looks:

            // [
            //     person: {
            //         personObject
            //     }
            // ]

            // so we need to extract person, then extract attributes from the object inside it

            // get the relevant people, ensure that it is an array, and get their IDs
            currItemPeople = arrayTransformation(people).map(person => person["person"]["person_id"]);
            // doesn't seem that there are any first-degree associated places for other places
            currItemPlaces = [];
            // combines mentioned stories and stories recorded here
            currItemStories = [
                // extract stories collected here, ensure that it is an array, and get their IDs
                ...arrayTransformation(storiesCollected).map(story => story["story_id"]),
                // extract mentioned stories, ensure that it is an array, and get their IDs
                ...arrayTransformation(storiesMentioned).map(story => story["story_id"]),
            ];
            break;
        }
        case "Fieldtrips": {
            // get the people and places visited as well as the collected stories
            const {people_visited, places_visited, stories_collected} = getFieldtripsByID(itemID);

            // get the people, places visited + stories collected, ensure that each is an array, and get their IDs
            currItemPeople = arrayTransformation(people_visited).map(person => person["person_id"]);
            currItemPlaces = arrayTransformation(places_visited).map(place => place["place_id"]);
            currItemStories = arrayTransformation(stories_collected).map(story => story["story_id"]);

            break;
        }
        default:
            // unhandled node type, log that out
            console.warn(`Linkages not yet implemented for node type: ${type}`);
    }
    // get an array of IDs for people, places, stories, from all the existing nodes
    var pastStories = nodesToIDArray(nodeCategories, "Stories");
    var pastPlaces = nodesToIDArray(nodeCategories, "Places");
    var pastPeople = nodesToIDArray(nodeCategories, "People");
    // TODO: 2nd degree links
    var MatchingNodes = {
        // stories that belong to node's author and are already existing nodes
        "Stories": currItemStories.diff(pastStories),
        // relevant places that are already existing nodes
        "Places": currItemPlaces.diff(pastPlaces),
        // relevant people (includes author) that are already existing nodes
        "People": currItemPeople.diff(pastPeople),
    };
    // TODO: delete links if connecting node is revealed + create links to connecting node (i.e. stories all share an author, author gets clicked, links between stories will be deleted)

    // link = the created link
    // matchNode = the node that this node is connected to
    // link node = a common link connecting the two nodes (i.e. author)
    let link, matchNode, linkNode;
    // for people, places, stories
    for (let nodeType in MatchingNodes) {
        // for the array of the respecitve types in MatchingNodes
        MatchingNodes[nodeType].forEach((matchID) => {
            // determine common link based on the type of node
            switch (nodeType) {
                // if the matched node is a story
                case "Stories":
                    switch (type) {
                        // story-story link = connected by author (most likely)
                        case "Stories":
                            linkNode = currInformant;
                            break;
                        default:
                            linkNode = {};
                            break;
                    }
                    break;
                case "People":
                    linkNode = {};
                    break;
                case "Places":
                    linkNode = {};
                    break;
                default:
                    linkNode = {};
            }
            // get the actual node that it matches to, based on its ID
            matchNode = getNode(nodeCategories[nodeType], matchID);
            // set up the link
            link = {
                // starts from this node
                "source": id,
                // goes to the match's node
                "target": matchNode["id"],
                // if there is a common link between the two (i.e. author)
                "linkNode": linkNode,
            };
            // add it to our array of links
            links.push(link);
        });
    }
    // return array of new links
    return links;
}

/**
 * Returns a node, given its ID
 * @param {Array} nodes An array of nodes to search through
 * @param {*} typeID The ID to match
 * @returns {Node} The matching node
 */
function getNode(nodes, typeID) {
    // the resulting match
    var matchNode;
    // for each node in nodes
    nodes.forEach((node) => {
        // if node's ID is a match
        if (node["itemID"] === typeID) {
            // set node as the match
            matchNode = node;
        }
    });
    // return the match
    return matchNode;
}

/**
 * Get all IDs of a specified node type
 * @param {Array} nodeCategories An array containing all the nodes
 * @param {String} type Type of node to get
 * @returns {*} An array containing the relevant nodes' IDs
 */
function nodesToIDArray(nodeCategories, type) {
    // for each node of the specified type, extract its ID
    return nodeCategories[type].map(node => node["itemID"]);
}
