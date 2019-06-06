// functions to get people, places, stories
import * as model from "../../data-stores/DisplayArtifactModel";
// function to ensure an input is an array
import {arrayTransformation} from "../../utils";
// functions to get and set sesion storage
import {getSessionStorage, setSessionStorage} from "../../data-stores/SessionStorageModel";

// colors of the nodes on the graph
export const nodeColors = {
    "People": "blue",
    "Places": "red",
    "Stories": "grey",
    "Fieldtrips": "green",
    "default": "black",
};

// colors of primary + secondary links
const linkColors = {
    "primary": "lightblue",
    "secondary": "lightgreen",
};

/**
 * Get the common elements of two arrays
 * @param {Array} array1 An array to check for common elements with
 * @param {Array} array2 Another array to check for common elements with
 * @returns {Array} An array contianing the elements present in both arrays
 */
export function commonElements(array1, array2) {
    // return array1, filtered for only elements that are also in array2
    return array1.filter((element) => array2.includes(element));
}

/**
 * Get all IDs of a specified node type
 * @param {Array} nodeCategories An array containing all the nodes
 * @param {String} type Type of node to get
 * @returns {Array} An array containing the relevant nodes' IDs
 */
function nodesToIDArray(nodeCategories, type) {
    // for each node of the specified type, extract its ID
    return nodeCategories[type].map(node => node.itemID);
}

/**
 * Retrieve the graph data from storage
 * @returns {Object} Nodes and links found in storage
 */
export function initializeGraph() {
    // get data from sessionStorage
    const graphData = getSessionStorage("graphData");
    // if we couldn't load any data default to this
    if (!graphData) {
        return {
            // nodes needs a minimum of 1 object
            "nodes": [{"id": "blank"}],
            // links is empty since no data
            "links": [],
        };
    } else {
        // get the nodes and links from loaded data
        return graphData;
    }
}

/**
 * Retrieve all nodes of the graph from storage
 * @returns {Object} An object containing the relevant nodes, categorized by type
 */
export function initializeNodeCategories() {
    // get the saved data from sessionStorage
    const nodeCategories = getSessionStorage("nodeCategories");
    // if we were unable to get anything from sessionStorage
    if (!nodeCategories) {
        // set the arrays to be empty
        return {
            "Fieldtrips": [],
            "People": [],
            "Places": [],
            "Stories": [],
        };
    } else {
        return nodeCategories;
    }
}

/**
 * Get primarily associated data
 * @param {Number} itemID The numeric ID referring to the node
 * @param {String} type The type of the node
 * @returns {Object} An object with "Fieldtrips", "People", "Places", "Stories" attributes containing any primarily related data
 */
function getPrimaryAssociates(itemID, type) {
    // object to store the associated data.
    let primaryAssociates = {
        "Fieldtrips": [],
        "People": [],
        "Places": [],
        "Stories": [],
    };
    // based on the type of the node
    switch (type) {
        case "Stories": {
            // get the story
            const story = model.getStoryByID(itemID);
            // if it's an actual story
            if (story !== null) {
                // get the informant's ID, fieldtrip, places relevant to this story
                const {fieldtrip, informant_id, places} = model.getStoryByID(itemID);
                // set the associated person to be the author.
                primaryAssociates.People = arrayTransformation(informant_id);
                // extract relevant places, ensure that it is an array, and get their IDs
                primaryAssociates.Places = arrayTransformation(places.place).map(place => place.place_id);
                // get the fieldtrip associated with the story, array-ified
                primaryAssociates.Fieldtrips = arrayTransformation(fieldtrip.id);
            } else {
                // return null since the story wasn't defined
                return null;
            }
            break;
        }
        case "People": {
            // get the person
            const person = model.getPeopleByID(itemID);
            // if it's an actual person
            if (person !== null) {
                // get the person's relevant places and stories
                const {places, stories} = person;
                // extract relevant places, ensure that it is an array, and get their IDs
                primaryAssociates.Places = arrayTransformation(places).map(place => place.place_id);
                // extract stories, ensure that it is an array, and get their IDs
                primaryAssociates.Stories = arrayTransformation(stories).map(story => story.story_id);
            } else {
                // return null since the person wasn't defined
                return null;
            }
            break;
        }
        case "Places": {
            // get the place
            const place = model.getPlacesByID(itemID);
            // if it's an actual place
            if (place !== null) {
                // get the place's relevant people and stories
                const {fieldtrips, people, storiesCollected, storiesMentioned} = place;
                // oh dear god please fix the data so i dont have to do this weird stuff
                // basically here's how the data currently looks:
                // [
                //     person: {
                //         personObject
                //     }
                // ]
                // so we need to extract person, then extract attributes from the object inside it
                // get the relevant people, ensure that it is an array, and get their IDs
                primaryAssociates.People = arrayTransformation(people).map(person => person.person.person_id);
                // extract stories collected here, ensure that it is an array, get their IDs
                // repeat for stories mentioning this
                // combine the two arrays
                primaryAssociates.Stories = [
                    ...arrayTransformation(storiesCollected).map(story => story.story_id),
                    ...arrayTransformation(storiesMentioned).map(story => story.story_id),
                ];
                // get the fieldtrips associated with the place, array-ified
                if (fieldtrips !== null) {
                    primaryAssociates.Fieldtrips = arrayTransformation(fieldtrips.fieldtrip_id);
                }
            } else {
                // return null since the place wasn't defined
                return null;
            }
            break;
        }
        case "Fieldtrips": {
            // get the fieldtrip
            const fieldtrip = model.getFieldtripsByID(itemID);
            // if it's an actual fieldtrip
            if (fieldtrip !== null) {
                // get the people and places visited as well as the collected stories
                const {people_visited, places_visited, stories_collected} = fieldtrip;
                // get the people visited, ensure that it is an array, and get their IDs
                primaryAssociates.People = arrayTransformation(people_visited).map(person => person.person_id);
                // get places visited, ensure that it is an array, and get their IDs
                primaryAssociates.Places = arrayTransformation(places_visited).map(place => place.place_id);
                // get collected stories, ensure that it is an array, and get their IDs
                primaryAssociates.Stories = arrayTransformation(stories_collected).map(story => story.story_id);
            } else {
                // return null since the fieldtrip wasn't defined
                return null;
            }
            break;
        }
        default:
            // unhandled node type, log that out and stop
            console.warn(`Linkages not yet implemented for node type: ${type}`);
            return;
    }
    return primaryAssociates;
}

/**
 * Retrieve a node by its name
 * @param {String} name The display name of the node
 * @param {Object} nodeCategories The nodes to search through (should be all nodes on the graph)
 * @returns {Node} A node that matches the specified name, or null if no match was found
 */
export function getNodeById(name, nodeCategories) {
    // for each of the categories of nodes (people, places, fieldtrips, stories)
    for (let nodeType in nodeCategories) {
        // attempt to find a node whose name matches the passed name
        let node = nodeCategories[nodeType].find(nodeToTest => nodeToTest.id === name);
        // if we actually found such a node
        if (typeof node !== "undefined") {
            // return that node
            return node;
        }
    }
    // if we couldn't find a match, return null
    return null;
}

/**
 * Create linkages for a node
 * @param {Node} node The node to create linkages for
 * @param {Array} nodeCategories An array of nodes to use to find linkages
 * @returns {Array} An array containing the formed linkages
 */
export function createLinkage({id, itemID, type}, nodeCategories) {
    // array to contain links
    let links = [];
    // get primary associates for the node
    const primaryAssociates = getPrimaryAssociates(itemID, type);
    // get the nodes already on the graph
    const pastNodes = {
        "Fieldtrips": nodesToIDArray(nodeCategories, "Fieldtrips"),
        "People": nodesToIDArray(nodeCategories, "People"),
        "Places": nodesToIDArray(nodeCategories, "Places"),
        "Stories": nodesToIDArray(nodeCategories, "Stories"),
    };
    // for fieldtrips, people, places, stories
    for (let nodeType in pastNodes) {
        // add to links a series of links, not an array of links
        links.push(
            // get any primarily related nodes that are already on the the graph
            ...commonElements(primaryAssociates[nodeType], (pastNodes[nodeType]))
                // for all the matches, use their numeric ID
                .map(function(matchID) {
                    // create a link
                    return {
                        // from the current node
                        "source": id,
                        // to the node specified by matchID
                        "target": nodeCategories[nodeType].find(node => node.itemID === matchID).id,
                        // no intermediate node connecting the two
                        "linkNode": null,
                        // set its color to primary link color
                        "color": linkColors.primary,
                    };
                })
        );
    }
    // for fieldtrips, people, places, stories
    for (let nodeType in primaryAssociates) {
        // for the array of associated nodes by ontology, retrieve their IDs
        primaryAssociates[nodeType].forEach(function(linkID) {
            // variable to store the name of the linking node
            let object;
            // based on the type of node, get the object associated with the current ID
            switch (nodeType) {
                case "Fieldtrips":
                    object = model.getFieldtripsByID(linkID);
                    break;
                case "People":
                    object = model.getPeopleByID(linkID);
                    break;
                case "Places":
                    object = model.getPlacesByID(linkID);
                    break;
                case "Stories":
                    object = model.getStoryByID(linkID);
                    break;
                default:
                    // new node type we haven't prepared for yet, warn this and stop
                    console.warn(`Unhandled node type ${nodeType}`);
                    return;
            }
            // assuming that the ID is valid
            if (object !== null) {
                // get the name of the object
                const name = object[model.ontologyToDisplayKey[nodeType]];
                // get any potential secondary associates
                const secondaryAssociates = getPrimaryAssociates(linkID, nodeType);
                // for fieldtrips, people, places, stories
                for (let nodeType in pastNodes) {
                    // if any secondary associated nodes that are already on the graph
                    commonElements(secondaryAssociates[nodeType], pastNodes[nodeType])
                        // convert each of the numeric IDs to the node's name
                        .map(matchID => nodeCategories[nodeType].find(node => node.itemID === matchID).id)
                        // filter out links that point right back to the current node
                        .filter(matchID => matchID !== id)
                        // and, for each of the remaining secondarily associated nodes' links
                        .forEach(function(matchID) {
                            // if the link doesn't already exist in some sort of way
                            if (links.findIndex(
                                // the link currently being checked
                                testLink => (
                                    // if that link stems from the current node
                                    (testLink.source === id &&
                                        // and points to the secondary node
                                        testLink.target === matchID) ||
                                    // or, if that link starts at the secondary node
                                    (testLink.source === matchID &&
                                        // and points to the current node
                                        testLink.target === id)
                                    // whenever this condition is -1, the connection between the two doesn't exist yet, so add the link
                                )) === -1) {
                                // add a link
                                links.push({
                                    // from the current node
                                    "source": id,
                                    // to the secondarily-linked node
                                    "target": matchID,
                                    // via the intermediate primary linked node
                                    "linkNode": name,
                                    // set its color to secondary link color
                                    "color": linkColors.secondary,
                                });
                            }
                        });
                }
            }
        });
    }
    // return our composite of primary and secondary links
    return links;
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
    let color = "";
    // if the type has a corresponding color, in nodeColors
    if (nodeColors.hasOwnProperty(type)) {
        // set the color to that of nodeColors
        color = nodeColors[type];
    } else {
        // use the default if we couldn't find the type in nodeColors
        color = nodeColors.default;
    }
    // assemble the node
    return {
        // id of the node
        "id": name,
        // color of the node on the graph
        color,
        // item associated with the node
        item,
        // type of the node
        type,
        // id referring to item
        "itemID": id,
    };
}

/**
 * Adds a node to the graph
 * @param {*} id The ID of the node
 * @param {*} name The name of the node
 * @param {string} type The type of the node
 * @param {*} item The item associated with the node
 */
export function addNode(id, name, type, item) {
    // create the node object
    const newNode = createNode(id, name, type, item);
    // get graph info from localstorage
    let graphData = initializeGraph();
    let nodeCategories = initializeNodeCategories();
    // check if the blank node still is present
    if (graphData.nodes[0].id === "blank") {
        // remove the blank node
        graphData.nodes.splice(0, 1);
    }
    // if newNode doesn't already exist
    if (!graphData.nodes.includes(newNode)) {
        // add it to the nodes of graphData
        graphData.nodes.push(newNode);
        // add it to the relevant array in nodeCategories and update sessionStorage
        nodeCategories[type].push(newNode);
        setSessionStorage("nodeCategories", nodeCategories);
        // add any links for this node
        graphData.links.push(...createLinkage(newNode, nodeCategories));
        // because people don't have a "fieldtrip" attribute
        if (type === "People") {
            // when a person is added, go through each of the preexisting fieldtrip nodes
            nodeCategories.Fieldtrips.forEach(function(fieldtrip) {
                // get any links they may have with the person
                graphData.links.push(...createLinkage(fieldtrip, nodeCategories));
            });
        }
        // filter out graph links
        graphData.links = graphData.links
            .filter((link, index) =>
                // if the current link to check doesn't already exist in some sort of way
                graphData.links.findIndex(
                    // the link to test against
                    testLink => (
                        // if both share a soucre
                        (testLink.source === link.source &&
                            // and a target (dupes)
                            testLink.target === link.target) ||
                        // or, if that link ends where this one starts
                        (testLink.source === link.source &&
                            // and that starts where this ends (dupes, but in reverse direction)
                            testLink.target === link.target)
                        // this should be the first of that sort of link in order to keep it
                    )) === index
            );
        // update the general graph data in session
        setSessionStorage("graphData", graphData);
    }
}
