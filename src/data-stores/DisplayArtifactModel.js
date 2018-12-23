// import raw people data
import AllInformants from "../data/allinformants.json";
// import raw story data
import AllStories from "../data/allstories.json";
// import ETK data
import dataETK from "../data/cetk_indices.json";
// import data for fieldtrips
import FieldtripsData from "../data/cfieldtrips.json";
// import genre data
import dataGenre from "../data/cgenres.json";
// import people data
import informants from "../data/cinformants.json";
// import keyword data
import dataKeywords from "../data/ckeywords.json";
// import occupation data
import occupations from "../data/coccupations.json";
// import place data
import places from "../data/cplaces.json";
// import data for mentioned places
import PlacesMentionedData from "../data/cplaces_mentioned.json";
// import story data
import storySearch from "../data/cstories.json";
// import data for places with collected stories
import StoriesCollectedData from "../data/cstories_collected.json";
// import tango indices data
import dataTango from "../data/ctango_indices.json";
// import the arrayTransformation() function
import {arrayTransformation} from "../utils";

// helper functions

// not sure about this
function arrOfObjToObj(arrOfObj, id) {
    // store the resulting object
    let resultObj = {};

    // for each obj in the arrOfObj
    arrOfObj.forEach((obj) => {
        // my brain can't comprehend this for some reason
        // something about about setting the data inside the resulting object based on its appropriate or specified place i think
        resultObj[obj[id]] = obj;
    });

    // return the object
    return resultObj;
}

/**
 * @param {Array} list The list to search through
 * @param {*} key The key to check for
 * @returns {Array} An array of values with the same key
 */
function getSiblings(list, key) {
    // if key is one of these types
    if (["MAIN", "TOPIC", "PPS", ""].includes(key)) {
        // no need to modify it, apparently
        return list;
    } else if (typeof list !== "undefined" && typeof key !== "undefined") {
        // if we have a defined list and key
        // return the list, with any duplicates filtered out
        return list.filter((value, index) => list.indexOf(value) === index);
    } else {
        // failed to obtain anything, better alert this
        console.error("Can't get siblings!");
    }
}

// fieldtrip_id of all fieldtrip is -1
const allFieldtripId = -1;
// converted data for fieldtrips
const fieldtripsData = arrOfObjToObj(FieldtripsData.fieldtrip, "fieldtrip_id");
// converted data for stories
const formattedStoryData = arrOfObjToObj(AllStories, "story_id");
// converted general place data
const placesData = arrOfObjToObj(places.place, "place_id");
// converted data for mentioned places
const placesMentionedData = arrOfObjToObj(PlacesMentionedData.place, "place_id");
// converted data for people
const realPeopleData = arrOfObjToObj(AllInformants, "person_id");
// converted data for places with collected stories
const storiesCollectedData = arrOfObjToObj(StoriesCollectedData.place, "place_id");

// data for the ontology types
const data = {
    "keywords": dataKeywords.keyword,
    "tango": dataTango.tango_index,
    "etk": dataETK.etk_index,
    "genre": dataGenre.genre,
    "fieldtrips": FieldtripsData.fieldtrip,
    "people": informants.informant,
    "places": places.place,
    "stories": storySearch.story,
};

// data for keywords
const keywords = {
    "name": "keywords",
    "children": getSiblings(data.keywords, "keyword_name"),
};

// just a bunch of data for the ontologies
const ListModel = {
    "People": {
        "name": "People",
        "children": getSiblings(data.people, "full_name"),
        "level": 2,
    },
    "Places": {
        "name": "Places",
        "children": getSiblings(data.places, "name"),
        "level": 2,
    },
    "Stories": {
        "name": "Stories",
        "children": getSiblings(data.stories, "full_name"),
        "level": 2,
    },
    "ETK Index": {
        "name": "ETK Index",
        "children": getSiblings(data.etk, "heading_english"),
        "level": 2,
    },
    "Keywords": {
        "name": "Keywords",
        "children": getSiblings(data.keywords, "keyword_name"),
        "level": 2,
    },
    "Fieldtrips": {
        "name": "Fieldtrips",
        "children": getSiblings(data.fieldtrips, "fieldtrip_name"),
        "level": 2,
    },
    "Genres": {
        "name": "Genres",
        "children": getSiblings(data.genre, "name"),
        "level": 2,
    },
    "Tangherlini Index": {
        "name": "Tangherlini Index",
        "children": getSiblings(data.tango, "type"),
        "level": 2,
    },
};

/**
 * Used for tangoTypes
 * @param {*} value The value that the key should match
 * @param {boolean} isObj Controls whether the objects or their names should be returned
 * @returns {Array} An array of same key:pair value (i.e. gets me a list of all children of "Places")
 */
function getChildren(value, isObj) {
    // data.tango filtered for items whose type matches the passed value
    let items = data.tango.filter(item => item.type === value);
    // if objects are not desired
    if (isObj === false) {
        // replace each object in the result with its name
        items = items.map(item => item.name);
    }
    // return the filtered, possibly modified list
    return items;
}

// array of occupations
export const OccupationDictionary = occupations.occupations;

// use this to get the display attribute for different ontologies
export const ontologyToDisplayKey = {
    "ETK Index": "heading_english",
    "Tangherlini Index": "type",
    "Fieldtrips": "fieldtrip_name",
    "Genres": "name",
    "People": "full_name",
    "Places": "name",
    "Stories": "full_name",
    "Keyword": "keyword_name",
};

// given an object, return the appropriate display attribute
/**
 * @return {string}
 */
export function DisplayArtifactToDisplayKey(DisplayArtifact) {
    if ("keyword_name" in DisplayArtifact) {
        return "keyword_name";
    } else if ("search_string" in DisplayArtifact) {
        return "search_string";
    } else if ("full_name" in DisplayArtifact) {
        return "full_name";
    } else if ("name" in DisplayArtifact) {
        return "name";
    } else if ("fieldtrip_name" in DisplayArtifact) {
        return "fieldtrip_name";
    }
}

/**
 * Find the ontology of a display artifact
 * @param {Object} DisplayArtifact Display Artifact to find ontology of
 * @returns {String} Ontology of the artifact
 */
export function DisplayArtifactToOntology(DisplayArtifact) {
    if (DisplayArtifact.hasOwnProperty("story_id")) {
        return "Stories";
    } else if (DisplayArtifact.hasOwnProperty("place_id")) {
        return "Places";
    } else if (DisplayArtifact.hasOwnProperty("person_id")) {
        return "People";
    } else if (DisplayArtifact.hasOwnProperty("fieldtrip_id")) {
        return "Fieldtrips";
    } else {
        console.warn("Artifact is invalid!", DisplayArtifact);
    }
}

// the ID attribute for different data types
export const ontologyToID = {
    "Stories": "story_id",
    "Places": "place_id",
    "People": "person_id",
    "Fieldtrips": "fieldtrip_id",
};

// get the id
/**
 * @return {string}
 */
export function ArtifactoID(DisplayArtifact) {
    if (typeof DisplayArtifact === "string") {
        if ("story_id" in DisplayArtifact) {
            return "story_id";
        } else if ("place_id" in DisplayArtifact) {
            return "place_id";
        } else if ("people_id" in DisplayArtifact) {
            return "people_id";
        }
    }
    return "you screwed up. this doesnt have an id";
}

// data for the tangherlini index part of topic & index navigator
export const tangoTypes = {
    "People Classes": {
        "name": "People Classes",
        "children": getChildren("People Classes", true),
        "level": 3,
    },
    "Place Classes": {
        "name": "Places",
        "children": getChildren("Place Classes", true),
        "level": 3,
    },
    "Tools, Items and Conveyances": {
        "name": "Tools, Items and Conveyances",
        "children": getChildren("Tools, Items and Conveyances", true),
        "level": 3,
    },
    "Supernatural Beings": {
        "name": "Supernatural Beings",
        "children": getChildren("Supernatural Beings", true),
        "level": 3,
    },
    "Animals": {
        "name": "Animals",
        "children": getChildren("Animals", true),
        "level": 3,
    },
    "Action or events": {
        "name": "Action or events",
        "children": getChildren("Action or events", true),
        "level": 3,
    },
    "Time, Season, Weather": {
        "name": "Time, Season, Weather",
        "children": getChildren("Time, Season, Weather", true),
        "level": 3,
    },
    "Resolution": {
        "name": "Resolution",
        "childArray": getChildren("Resolution", false),
        "children": getChildren("Resolution", true),
        "level": 3,
    },
    "Stylistics": {
        "name": "Stylistics",
        "children": getChildren("Stylistics", true),
        "level": 3,
    },
};

/**
 * Retrieve items between two specified years
 * @param {*} startYear Earlier boundary of the time interval
 * @param {*} endYear Later boundary of the time interval
 * @param {*} ontology Ontology of the items to retrieve
 * @returns {Array} All desired items in the specified range
 */
export function dateFilterHelper(startYear, endYear, ontology) {
    // go through fieldtrips to see which fieldtrips fit within dates
    const fieldtripsInDates = data.fieldtrips.filter((fieldtrip) =>
        parseInt(fieldtrip.start_date, 10) >= startYear &&
        parseInt(fieldtrip.end_date, 10) <= endYear),
        // get the key needed to retrieve IDs
        IDKey = ontologyToID[ontology];
    let fieldtripKey,
        // array to store IDs of items to return
        UniqueItemIDs = [],
        // array to store the actual items to return
        UniqueItems = [];
    // handling to get the necessary objects from fieldtrips, due to weird data
    switch (ontology) {
        case "Fieldtrips":
            // we already have the fieldtrips in range, so we can return that and stop
            return fieldtripsInDates;
        case "People":
            fieldtripKey = {
                "firstKey": "people_visited",
                "secondKey": "person",
            };
            break;
        case "Places":
            fieldtripKey = {
                "firstKey": "places_visited",
                "secondKey": "place",
            };
            break;
        case "Stories":
            fieldtripKey = {
                "firstKey": "stories_collected",
                "secondKey": "story",
            };
            break;
        default:
            // invalid ontology, warn this and return nothing
            console.warn(`Invalid ontology: ${ontology}`);
            return [];
    }
    // for fieldtrips that fit within dates
    fieldtripsInDates.forEach((fieldtrip) => {
        let uncleanedItems;
        // if we can directly get an array, it is good data and we can just use that
        if (Array.isArray(fieldtrip[fieldtripKey.firstKey]) === true) {
            uncleanedItems = fieldtrip[fieldtripKey.firstKey];
        } else {
            // bad data, must use the ugly double key access to get the proper array
            uncleanedItems = fieldtrip[fieldtripKey.firstKey][fieldtripKey.secondKey];
        }
        // for each of the retrieved items
        arrayTransformation(uncleanedItems).forEach((item) => {
            // make sure we aren't adding a dupe item
            if (UniqueItemIDs.includes(item[IDKey]) === false) {
                // add it to our array to return
                UniqueItems.push(item);
                // add it to the ID list of found items
                UniqueItemIDs.push(item[IDKey]);
            }
        });
    });
    return UniqueItems;
}

/**
 * Retrieve a fieldtrip by its ID
 * @param {Number} fieldtrip_id The ID of the fieldtrip to get
 * @returns {Fieldtrip} The requested fieldtrip, or null if the ID is invalid
 */
export function getFieldtripsByID(fieldtrip_id) {
    // if anything but the all fieldtrip is selected
    if (fieldtrip_id !== allFieldtripId) {
        // check if the fieldtrip ID is valid
        if (fieldtripsData.hasOwnProperty(fieldtrip_id)) {
            // retrieve the relevant information
            // iMPORTANT: use spread syntax so that we don't mutate the original fieldtrip data
            let fieldtripObject = {...fieldtripsData[fieldtrip_id]};
            // if people_visited exists in fieldtripObject
            if ("people_visited" in fieldtripObject) {
                // ensure that people_visited is an array
                fieldtripObject.people_visited = arrayTransformation(fieldtripObject.people_visited.person);
            }
            // if places_visited in fieldtripObject
            if ("places_visited" in fieldtripObject) {
                // ensure that places_visited is an array
                fieldtripObject.places_visited = arrayTransformation(fieldtripObject.places_visited.place);
            }
            // if stories_collected in fieldtripObject
            if ("stories_collected" in fieldtripObject) {
                // ensure that stories_collected is an array
                fieldtripObject.stories_collected = arrayTransformation(fieldtripObject.stories_collected.story);
            }
            // return the object
            return fieldtripObject;
        } else {
            // if not, return null and warn of an invalid ID
            console.warn(`Fieldtrip ID ${fieldtrip_id} is invalid.`);
            return null;
        }
    } else { // else, the all fieldtrip is selected
        // basic object to store the people, places, stories
        let allFieldtrip = {
            "people_visited": [],
            "places_visited": [],
            "stories_collected": [],
        };
        // loop through all fieldtrips
        for (let fieldtripIdLoop in fieldtripsData) {
            // get the fieldtrip
            let fieldtrip = fieldtripsData[fieldtripIdLoop];
            // don't use the all fieldtrip
            if (fieldtripIdLoop !== allFieldtripId.toString()) {
                // for people, places, associated with each fieldtrip
                for (let ontology in allFieldtrip) {
                    // get an array of the current ontology's names already stored
                    const allFieldtripKeyNames = allFieldtrip[ontology].map(element => element.full_name);
                    // handling for the weirdly structured data, the key needed to get the relevant array from the fieldtrip
                    const currentKey = Object.keys(fieldtrip[ontology])[0];
                    // obtain the array from the fieldtrip
                    let fieldtripValue = fieldtrip[ontology][currentKey];
                    // enssure that the data is indeed an array
                    fieldtripValue = arrayTransformation(fieldtripValue);
                    // add to our ontology's array the elements from the current fieldtrip's ontology
                    allFieldtrip[ontology].push(...fieldtripValue.filter(
                        // but make sure we don't add duplicates
                        datum => allFieldtripKeyNames.includes(datum.full_name) === false
                    ));
                }
            }
        }
        // add in other necessary info for the total fieldtrip
        allFieldtrip = {
            ...allFieldtrip,
            "end_date": "1898-06-08",
            "fieldtrip_id": allFieldtripId,
            "fieldtrip_name": "All fieldtrips",
            "shapefile": "",
            "start_date": "1887-02-03",
        };
        // return our created mash of the fieldtrips
        return allFieldtrip;
    }
}

// sometimes it's used with a parameter...but it has no parameters
/**
 * Retrieves keywords, combined with stories.
 * @returns {Array} Keywords
 */
export function getKeywords() {
    return keywords.children.concat(ListModel.Stories.children);
}

/**
 * Retrieve the children of the specified ontology in ListModel
 * @param {*} ontology The property of ListModel to use
 * @returns {Array} The requested ontology's children array
 */
export function getList(ontology) {
    // just get the data from ListModel
    return ListModel[ontology].children;
}

/**
 * Retrieve a person by its ID
 * @param {Number} person_id The ID of the person to get
 * @returns {Person} The requested person, or null if the ID is invalid
 */
export function getPeopleByID(person_id) {
    // check if the person ID is valid
    if (realPeopleData.hasOwnProperty(person_id)) {
        // an object to store the person;
        let personObject = realPeopleData[person_id];
        if (typeof personObject === "object") {
            // if places exists in personObject
            const DefinedPlaces = "places" in personObject,
                // if stories exists in personObject
                DefinedStories = "stories" in personObject,
                // if place exists in  places
                DefinedPlace = "place" in personObject.places,
                // if story defined inside story
                DefinedStory = "story" in personObject.stories;
            // if places attribute is valid
            if (DefinedPlaces && DefinedPlace) {
                // ensure that places is a proper array
                personObject.places = arrayTransformation(personObject.places.place);
            }
            // if stories attribute is valid
            if (DefinedStories && DefinedStory) {
                // ensure that stories is a proper array
                personObject.stories = arrayTransformation(personObject.stories.story);
            }
            // return the object
            return personObject;
        } else {
            // if the ID is invalid, warn this and return null
            console.warn(`Person ID ${person_id} is invalid.`);
            return null;
        }
    } else {
        // if the ID is invalid, warn this and return null
        console.warn(`Person ID ${person_id} is invalid.`);
        return null;
    }
}

/**
 * Retrieve a place by its id
 * @param {Number} place_id The ID of the place to get
 * @returns {Place} The requested place, or null if the ID is invalid
 */
export function getPlacesByID(place_id) {
    // if the place ID is valid
    if (placesData.hasOwnProperty(place_id)) {
        // retrieve the relevant place
        let placeObject = placesData[place_id];
        // if the people attribute is properly defined
        if (typeof placeObject.people !== "undefined" && placeObject.people !== [] && placeObject.people !== null) {
            // ensure that the placeData's people is an array, and set the object's people to it
            placeObject.people = arrayTransformation(placesData[place_id].people);
        } else {
            // delete people if it's not defined
            delete placeObject.people;
        }
        // if place is a collected story here place
        if (place_id in storiesCollectedData) {
            // ensure that storiesCollected is an array
            placeObject.storiesCollected = arrayTransformation(storiesCollectedData[place_id].stories.story);
        }
        // if place is mentioned
        if (place_id in placesMentionedData) {
            // ensure that storiesMentioned is an array
            placeObject.storiesMentioned = arrayTransformation(placesMentionedData[place_id].stories.story);
        }
        return placeObject;
    } else {
        // if the place ID is invalid, warn this and return null
        console.warn(`Place ID ${place_id} is invalid.`);
        return null;
    }
}

/**
 * Retrieve a story by its ID
 * @param {Number} story_id The ID of the story to get
 * @returns {Story} The requested story, or null if the ID is invalid
 */
export function getStoryByID(story_id) {
    // if the story ID is valid
    if (formattedStoryData.hasOwnProperty(story_id)) {
        // just get it from the relevant array
        return formattedStoryData[story_id];
    } else {
        // if the story ID is invalid, warn this and return null
        console.warn(`Story ID ${story_id} is invalid.`);
        return null;
    }
}
