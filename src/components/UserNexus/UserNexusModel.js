// functions to get people, places, stories
import * as model from "../../data-stores/DisplayArtifactModel";
// function to ensure an input is an array
import {arrayTransformation} from "../../utils";
import {getSessionStorage, setSessionStorage} from "../../data-stores/SessionStorageModel";

// colors of the nodes on the graph
const nodeColors = {
    "People": "blue",
    "Places": "red",
    "Stories": "grey",
    "Fieldtrips": "green",
    "default": "black",
};

/**
 * Get all IDs of a specified node type
 * @param {Array} nodeCategories An array containing all the nodes
 * @param {String} type Type of node to get
 * @returns {Array} An array containing the relevant nodes' IDs
 */
function nodesToIDArray(nodeCategories, type) {
    // for each node of the specified type, extract its ID
    return nodeCategories[type].map(node => node["itemID"]);
}

/**
 * Model initializer
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
 * Initialize the nodes of the graph
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
 * Helper function for createLinkage
 * @param {Node} node The node to get links for
 * @param {Object} nodeCategories An object containing pre-existing nodes on the graph
 * @returns {Array} An array of the primary-linked nodes' IDs already on the graph
 */
function createPrimaryLinkages({itemID, type}, nodeCategories) {
    // array to contain found targets
    let links = [],
        // object to store primary-linked nodes
        primaryAssociates = {
            "Fieldtrips": [],
            "People": [],
            "Places": [],
            "Stories": [],
        };

    // get primary associates based on the ontology
    switch (type) {
        case "Stories": {
            // get the informant's ID, fieldtrip, places relevant to this story
            const {fieldtrip, informant_id, places} = model.getStoryByID(itemID);

            // set the associated person to be the author.
            primaryAssociates["People"] = arrayTransformation(informant_id);
            // extract relevant places, ensure that it is an array, and get their IDs
            primaryAssociates["Places"] = arrayTransformation(places["place"]).map(place => place["place_id"]);
            // get the fieldtrip associated with the story, array-ified
            primaryAssociates["Fieldtrips"] = arrayTransformation(fieldtrip["id"]);

            break;
        }
        case "People": {
            // get the person's relevant places and stories
            const {places, stories} = model.getPeopleByID(itemID);

            // extract relevant places, ensure that it is an array, and get their IDs
            primaryAssociates["Places"] = arrayTransformation(places).map(place => place["place_id"]);
            // extract stories, ensure that it is an array, and get their IDs
            primaryAssociates["Stories"] = arrayTransformation(stories).map(story => story["story_id"]);

            break;
        }
        case "Places": {
            // get the place's relevant people and stories
            const {fieldtrips, people, storiesCollected, storiesMentioned} = model.getPlacesByID(itemID);

            // oh dear god please fix the data so i dont have to do this weird stuff
            // basically here's how the data currently looks:

            // [
            //     person: {
            //         personObject
            //     }
            // ]

            // so we need to extract person, then extract attributes from the object inside it
            // get the relevant people, ensure that it is an array, and get their IDs
            primaryAssociates["People"] = arrayTransformation(people).map(person => person["person"]["person_id"]);
            // extract stories collected here, ensure that it is an array, get their IDs
            // repeat for stories mentioning this
            // combine the two arrays
            primaryAssociates["Stories"] = [
                ...arrayTransformation(storiesCollected).map(story => story["story_id"]),
                ...arrayTransformation(storiesMentioned).map(story => story["story_id"]),
            ];

            // get the fieldtrips associated with the place, array-ified
            if (fieldtrips !== null) {
                primaryAssociates["Fieldtrips"] = arrayTransformation(fieldtrips["fieldtrip_id"]);
            }

            break;
        }
        case "Fieldtrips": {
            // get the people and places visited as well as the collected stories
            const {people_visited, places_visited, stories_collected} = model.getFieldtripsByID(itemID);

            // get the people visited, ensure that it is an array, and get their IDs
            primaryAssociates["People"] = arrayTransformation(people_visited).map(person => person["person_id"]);
            // get places visited, ensure that it is an array, and get their IDs
            primaryAssociates["Places"] = arrayTransformation(places_visited).map(place => place["place_id"]);
            // get collected stories, ensure that it is an array, and get their IDs
            primaryAssociates["Stories"] = arrayTransformation(stories_collected).map(story => story["story_id"]);

            break;
        }
        default:
            // unhandled node type, log that out and stop
            console.warn(`Linkages not yet implemented for node type: ${type}`);
            return;
    }

    // get the nodes already on the graph
    const pastNodes = {
        "Fieldtrips": nodesToIDArray(nodeCategories, "Fieldtrips"),
        "People": nodesToIDArray(nodeCategories, "People"),
        "Places": nodesToIDArray(nodeCategories, "Places"),
        "Stories": nodesToIDArray(nodeCategories, "Stories"),
    };

    // for fieldtrips, people, places, stories
    for (let nodeType in pastNodes) {
        // get any primarily related nodes that are already on the the graph
        let matches = primaryAssociates[nodeType].diff(pastNodes[nodeType]);
        // add to links a series of elements, not an array
        links.push(
            // all the matches, and for each of their itemIDs
            ...matches.map(matchID =>
                // substitute in the graph id of the node
                nodeCategories[nodeType].find(node => node["itemID"] === matchID)["id"])
        );
    }

    // return array of new links, and primarily related things
    return {
        "links": links,
        "primaryAssociates": primaryAssociates,
    };
}

/**
 * Create linkages for a node
 * @param {Node} node The node to create linkages for
 * @param {Array} nodeCategories An array of nodes to use to find linkages
 * @returns {Array} An array containing the formed linkages
 */
export function createLinkage({id, itemID, type}, nodeCategories) {
    // get the array of connected IDs and primary associated nodes for the current node
    const {links, primaryAssociates} = createPrimaryLinkages({"itemID": itemID, "type": type}, nodeCategories);

    // create primary links from the connected IDs
    let allLinks = links.map(function(targetID) {
        return {
            "source": id,
            "target": targetID,
            "linkNode": null,
        };
    });

    // for fieldtrips, people, places, stories
    for (let nodeType in primaryAssociates) {
        // for the array of associated nodes by ontology, retrieve their IDs
        primaryAssociates[nodeType].forEach(function(linkID) {
            // to the final links, we append the result
            allLinks.push(
                // the result is multiple link nodes, not an array (don't want a 2-D links array)
                ...(
                    // we find any primary linked IDs for the directly associated nodes (i.e. secondarily linked IDs)
                    createPrimaryLinkages({"itemID": linkID, "type": nodeType}, nodeCategories)["links"]
                        // remove any links that go back to this node (i.e. Jens => Jens via his story)
                        .filter(targetID => id !== targetID)
                        // and, for each of the resulting secondarily associated nodes
                        .map(function(targetID) {
                            // return a link from the current node to the secondarily associated node
                            // connected via the intermediate node we are currently iterating on
                            return {
                                "source": id,
                                "target": targetID,
                                "linkNode": linkID,
                            };
                        })
                )
            );
        });
    }

    // return our composite of primary and secondary links
    return allLinks;
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
        setSessionStorage("nodeCategories", nodeCategories);

        // add any links for this node
        graphData["links"].push(...createLinkage(newNode, nodeCategories));

        // because people don't have a "fieldtrip" attribute
        if (type === "People") {
            // when a person is added, go through each of the preexisting fieldtrip nodes
            nodeCategories["Fieldtrips"].forEach(function(fieldtrip) {
                // get any links they may have with the person
                graphData["links"].push(...createLinkage(fieldtrip, nodeCategories));
            });
        }

        // update the general graph data in session
        setSessionStorage("graphData", graphData);
    }
}
