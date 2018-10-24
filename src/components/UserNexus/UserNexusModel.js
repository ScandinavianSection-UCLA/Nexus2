// functions to get people, places, stories
import {
    getFieldtripsByID,
    getPeopleByID,
    getPlacesByID,
    getStoryByID,
} from "../../displayArtifactModel";
// function to ensure an input is an array
import {arrayTransformation} from "../../utils";

// colors of the nodes on the graph
const nodeColors = {
    "People": "blue",
    "Places": "red",
    "Stories": "grey",
    "Fieldtrips": "green",
    "default": "black",
};

/**
 * Model initializer
 * @returns {Object} Nodes and links found in storage
 */
export function initializeGraph() {
    // get data from sessionStorage
    const graphData = JSON.parse(sessionStorage.getItem("graphData"));

    // if we couldn't load any data
    if (graphData === null) {
        return {
            // nodes needs a minimum of 1 object
            "nodes": [{"id": "blank"}],
            // links is empty since no data
            "links": [],
        };
    } else {
        // get the nodes and links from loaded data
        const {nodes, links} = graphData;
        // return corresponding data
        return {
            "nodes": nodes,
            "links": links,
        };
    }
}

/**
 * Initialize the nodes of the graph
 * @returns {Object} An object containing the relevant nodes, categorized by type
 */
export function initializeNodeCategories() {
    // get the saved data from sessionStorage
    const nodeCategories = JSON.parse(sessionStorage.getItem("nodeCategories"));
    // if we were unable to get anything from sessionStorage
    if (nodeCategories === null) {
        // set the arrays to be empty
        return {
            "People": [],
            "Places": [],
            "Stories": [],
            "Fieldtrips": [],
        };
    } else {
        // extract the loaded data
        const {People, Places, Stories, Fieldtrips} = nodeCategories;
        // return the corresponding nodeCategories
        return {
            "People": People,
            "Places": Places,
            "Stories": Stories,
            "Fieldtrips": Fieldtrips,
        };
    }
}

/**
 * Adds a node to the graph
 * @param {*} id The ID of the node
 * @param {*} name The name of the node
 * @param {String} type The type of the node
 * @param {*} item The item associated with the node
 */
export function addNode(id, name, type, item) {
    // create the node object
    const newNode = createNode(id, name, type, item);

    // get graph info from localstorage
    var graphData = initializeGraph();
    var nodeCategories = initializeNodeCategories();

    // check if the blank node still is present
    if (graphData["nodes"][0]["id"] === "blank") {
        // remove the blank node
        graphData["nodes"].splice(0, 1);
    }

    // if newNode doesn't already exist
    if (!graphData["nodes"].includes(newNode)) {
        // add it to the nodes of graphData
        graphData["nodes"].push(newNode);

        // add it to the relevant array in nodeCategories and update sessionStorage
        nodeCategories[type].push(newNode);
        sessionStorage.setItem("nodeCategories", JSON.stringify(nodeCategories));

        // add any links for this node
        graphData["links"].push(...createLinkage(newNode, nodeCategories));

        // update the general graph data in session
        sessionStorage.setItem("graphData", JSON.stringify(graphData));
    }

}

/**
 * Creates a node object from the given inputs
 * @param {*} id The ID of the new node
 * @param {*} name The name of the new node
 * @param {String} type The type of the new node
 * @param {*} item The item associated with the node
 * @returns {Node} The node corresponding to the given input
 */
export function createNode(id, name, type, item) {
    // color of the final node
    var color = "";

    // if the type has a corresponding color, in nodeColors
    if (type in nodeColors) {
        // set the color to that of nodeColors
        color = nodeColors[type];
    } else {
        // use the default if we couldn't find the type in nodeColors
        color = nodeColors["default"];
    }

    // assemble the node
    return {
        // id of the node
        "id": name,
        // color of the node on the graph
        "color": color,
        // item associated with the node
        "item": item,
        // type of the node
        "type": type,
        // id referring to item
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

            // assuming that there is an author
            if (typeof informant_id !== "undefined") {
                // get the author
                currInformant = getPeopleByID(informant_id);

                // if informant exists
                if (typeof currInformant !== "undefined") {
                    // stores the author's ID as a single element array
                    currItemPeople = [informant_id];

                    // extract author's stories, ensure that it is an array, and get their IDs
                    currItemStories = arrayTransformation(currInformant["stories"]).map(story => story["story_id"]);
                }
            }

            // if there are relevant places
            if (typeof places !== "undefined" && typeof places["place"] !== "undefined") {
                // extract relevant places, ensure that it is an array, and get their IDs
                currItemPlaces = arrayTransformation(places["place"]).map(place => place["place_id"]);
            }

            // now update fieldtrips
            nodeCategories["Fieldtrips"].forEach((fieldtrip) => {
                links.push(...createLinkage(fieldtrip, nodeCategories));
            });

            break;
        }
        case "People": {
            // get the person's relevant places and stories
            const {places, stories} = getPeopleByID(itemID);

            // doesn't seem that there are any first-degree associated people for other people
            currItemPeople = [];

            // if there are relevant places
            if (typeof places !== "undefined") {
                // extract relevant places, ensure that it is an array, and get their IDs
                currItemPlaces = arrayTransformation(places).map(place => place["place_id"]);
            }

            // if there are any authored stories
            if (typeof stories !== "undefined") {
                // extract stories, ensure that it is an array, and get their IDs
                currItemStories = arrayTransformation(stories).map(story => story["story_id"]);
            }

            // now update fieldtrips
            nodeCategories["Fieldtrips"].forEach((fieldtrip) => {
                links.push(...createLinkage(fieldtrip, nodeCategories));
            });

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

            // if there are relevant people
            if (typeof people !== "undefined") {
                // get the relevant people, ensure that it is an array, and get their IDs
                currItemPeople = arrayTransformation(people).map(person => person["person"]["person_id"]);
            }

            // doesn't seem that there are any first-degree associated places for other places
            currItemPlaces = [];

            // if stories were collected here
            if (typeof storiesCollected !== "undefined") {
                // extract stories collected here, ensure that it is an array, get their IDs, and add it to currItemStories
                currItemStories.push(...arrayTransformation(storiesCollected).map(story => story["story_id"]));
            }

            // if this is mentioned in any stories
            if (typeof storiesMentioned !== "undefined") {
                // extract stories that mention this place, ensure that it is an array, get their IDs, and add it to currItemStories
                currItemStories.push(...arrayTransformation(storiesMentioned).map(story => story["story_id"]));
            }

            // now update fieldtrips
            nodeCategories["Fieldtrips"].forEach((fieldtrip) => {
                links.push(...createLinkage(fieldtrip, nodeCategories));
            });

            break;
        }
        case "Fieldtrips": {
            // get the people and places visited as well as the collected stories
            const {people_visited, places_visited, stories_collected} = getFieldtripsByID(itemID);

            // if there are people visited
            if (typeof people_visited !== "undefined") {
                // get them, ensure that it is an array, and get their IDs
                currItemPeople = arrayTransformation(people_visited).map(person => person["person_id"]);
            }

            // if there are place visited
            if (typeof places_visited !== "undefined") {
                // get them, ensure that it is an array, and get their IDs
                currItemPlaces = arrayTransformation(places_visited).map(place => place["place_id"]);
            }

            // if there are collected stories
            if (typeof stories_collected !== "undefined") {
                // get them, ensure that it is an array, and get their IDs
                currItemStories = arrayTransformation(stories_collected).map(story => story["story_id"]);
            }

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
