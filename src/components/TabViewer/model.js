// import story data
import AllStories from "../../data/allstories.json";
// import people data
import AllInformants from "../../data/allinformants.json";
// import general place data
import PlacesData from "../../data/cplaces.json";
// import data for places with collected stories
import StoriesCollectedData from "../../data/cstories_collected.json";
// import data for mendtioned places
import PlacesMentionedData from "../../data/cplaces_mentioned.json";
// import data for fieldtrips
import FieldtripsData from "../../data/cfieldtrips.json";

// converted data for people
const realPeopleData = arrOfObjToObj(AllInformants, "person_id");
// converted data for stories
const formattedStoryData = arrOfObjToObj(AllStories, "story_id");
// converted general place data
const placesData = arrOfObjToObj(PlacesData["place"], "place_id");
// converted data for places with collected stories
const storiesCollectedData = arrOfObjToObj(StoriesCollectedData["place"], "place_id");
// converted data for mentioned places
const placesMentionedData = arrOfObjToObj(PlacesMentionedData["place"], "place_id");
// converted data for fieldtrips
const fieldtripsData = arrOfObjToObj(FieldtripsData["fieldtrip"], "fieldtrip_id");
// fieldtrip_id of all fieldtrip is -1
const allFieldtripId = -1;

// retrieve a story by its id
export function getStoryByID(story_id) {
    // just get it from the relevant array
    return formattedStoryData[story_id];
}

// retrieve a person by its id
export function getPeopleByID(person_id) {
    // an object to store the person;
    var personObject = realPeopleData[person_id];
    // check if the person is actually defined
    if (typeof personObject !== "undefined") {
        // if places exists in personObject
        var DefinedPlaces = "places" in personObject,
            // if stories exists in personObject
            DefinedStories = "stories" in personObject,
            // if place exists in  places
            DefinedPlace = "place" in personObject["places"],
            // if story defined inside story
            DefinedStory = "story" in personObject["stories"];
        // if places attribute is valid
        if (DefinedPlaces && DefinedPlace) {
            // ensure that places is a proper array
            personObject["places"] = arrayTransformation(personObject["places"]["place"]);
        }
        // if stories attribute is valid
        if (DefinedStories && DefinedStory) {
            // ensure that stories is a proper array
            personObject["stories"] = arrayTransformation(personObject["stories"]["story"]);
        }

        // return the object
        return personObject;
    } else { // person_object must not be defined
        // log this info
        console.warn(`personObject for id: ${person_id} is undefined`);
    }
}

// retrieve a place by its id
export function getPlacesByID(place_id) {
    // retrieve the relevant place
    var placeObject = placesData[place_id];
    // if the place is actually defined
    if (typeof placeObject !== "undefined") {
        // if the people attribute is properly defined
        if (typeof placeObject["people"] !== "undefined" && placeObject["people"] !== [] && placeObject["people"] !== null) {
            // ensure that the placeData's people is an array, and set the object's people to it
            placeObject["people"] = arrayTransformation(placesData[place_id]["people"]);
        } else {
            // delete people if it's not defined
            delete placeObject["people"];
        }
        // if place is a collected story here place
        if (place_id in storiesCollectedData) {
            // ensure that storiesCollected is an array
            placeObject["storiesCollected"] = arrayTransformation(storiesCollectedData[place_id]["stories"]["story"]);
        }
        // if place is mentioned
        if (place_id in placesMentionedData) {
            // ensure that storiesMentioned is an array
            placeObject["storiesMentioned"] = arrayTransformation(placesMentionedData[place_id]["stories"]["story"]);
        }
        return placeObject;
    } else { // placeObject must be undefined
        // log out this info
        console.warn(`placeObject for id: ${place_id} is undefined`);
    }
}

// retrieve a fieldtrip by its id
export function getFieldtripsByID(fieldtrip_id) {
    // if anything but the all fieldtrip is selected
    if (fieldtrip_id !== allFieldtripId) {
        // retrieve the relevant information
        var fieldtripObject = fieldtripsData[fieldtrip_id];
        // if people_visited exists in fieldtripObject
        if ("people_visited" in fieldtripObject) {
            // ensure that people_visited is an array
            fieldtripObject["people_visited"] = arrayTransformation(fieldtripObject["people_visited"]["person"]);
        }
        // if places_visited in fieldtripObject
        if ("places_visited" in fieldtripObject) {
            // ensure that places_visited is an array
            fieldtripObject["places_visited"] = arrayTransformation(fieldtripObject["places_visited"]["place"]);
        }
        // if stories_collected in fieldtripObject
        if ("stories_collected" in fieldtripObject) {
            // ensure that stories_collected is an array
            fieldtripObject["stories_collected"] = arrayTransformation(fieldtripObject["stories_collected"]["story"]);
        }
        // return the object
        return fieldtripObject;
    } else { // else, the all fieldtrip is selected
        // create a base fieldtrip
        var allFieldtrip = {
            "end_date": "1898-06-08",
            "fieldtrip_id": allFieldtripId,
            "fieldtrip_name": "All fieldtrips",
            "people_visited": [],
            "places_visited": [],
            "shapefile": "",
            "start_date": "1887-02-03",
            "stories_collected": [],
        };

        // loop through all fieldtrips
        for (var fieldtripIdLoop in fieldtripsData) {
            // get the fieldtrip
            var fieldtrip = fieldtripsData[fieldtripIdLoop];

            // don't use the all fieldtrip id
            if (fieldtripIdLoop !== allFieldtripId) {
                // for each of the keys in allFieldTrip
                for (var key in allFieldtrip) {
                    // if the key stores an array (people, places, stories)
                    if (Array.isArray(allFieldtrip[key]) && typeof fieldtrip[key] !== "undefined") {
                        // handling for the weirdly structured data, the key needed to get the relevant array from the fieldtrip
                        var currentKey = Object.keys(fieldtrip[key])[0];
                        // obtain the array from the fieldtrip
                        var fieldtripValue = fieldtrip[key][currentKey];
                        // enssure that the data is indeed an array
                        fieldtripValue = arrayTransformation(fieldtripValue);
                        // iterate for each datum in the data
                        fieldtripValue.forEach(function(datum) {
                            // boolean to check if the datum needs to be added
                            var pushDatum = true;
                            // iterate for each element in the relevant array in allFieldtrip
                            allFieldtrip[key].forEach(function(element) {
                                // if the current element to add matches the element we're currently checking it against
                                if (datum["full_name"] === element["full_name"]) {
                                    // since the same name already exists, don't add the datum
                                    pushDatum = false;
                                }
                            });
                            // if the datum doesn't already exist
                            if (pushDatum) {
                                // add it to the relevant property of allFieldtrip
                                allFieldtrip[key].push(datum);
                            }
                        });
                    }
                }
            }
        }
        // return our created mash of the fieldtrips
        return allFieldtrip;
    }
}

// if item is not an array, convert it to a single-element array
function arrayTransformation(item) {
    // if the input is null or already an array
    if (Array.isArray(item) || item === null) {
        // return the input
        return item;
    } else if (typeof item === "object") { // if the input is pretty much anything else defined
        // return an array containing solely that element
        return [item];
    } else { // item must be undefined
        // we can just return an empty array
        return [];
    }
}

// not sure about this
function arrOfObjToObj(arrOfObj, id) {
    // store the resulting object
    var resultObj = {};

    // for each obj in the arrOfObj
    arrOfObj.forEach((obj) => {
        // my brain can't comprehend this for some reason
        // something about about setting the data inside the resulting object based on its appropriate or specified place i think
        resultObj[obj[id]] = obj;
    });

    // return the object
    return resultObj;
}
