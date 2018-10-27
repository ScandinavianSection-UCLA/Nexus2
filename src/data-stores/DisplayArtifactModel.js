// import story data
import AllStories from "../data/allstories.json";
// import people data
import AllInformants from "../data/allinformants.json";
// import general place data
import PlacesData from "../data/cplaces.json";
// import data for places with collected stories
import StoriesCollectedData from "../data/cstories_collected.json";
// import data for mendtioned places
import PlacesMentionedData from "../data/cplaces_mentioned.json";
// import data for fieldtrips
import FieldtripsData from "../data/cfieldtrips.json";
// import the arrayTransformation function
import {arrayTransformation} from "../utils";
import dataKeywords from "../data/ckeywords.json";
import dataTango from "../data/ctango_indices.json";
import dataETK from "../data/cetk_indices.json";
import dataGenre from "../data/cgenres.json";
import dataFieldtrips from "../data/cfieldtrips.json";
import informants from "../data/cinformants.json";
import storySearch from "../data/cstories.json";
import places from "../data/cplaces.json";

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

const data = {
    "keywords": dataKeywords.keyword,
    "tango": dataTango.tango_index,
    "etk": dataETK.etk_index,
    "genre": dataGenre.genre,
    "fieldtrips": dataFieldtrips.fieldtrip,
    "people": informants.informant,
    "places": places.place,
    "stories": storySearch.story, //data optimized for navigation - doesn't include all story data
};

const keywords = {
    "name": "keywords",
    "children": getSiblings(data.keywords, "keyword_name", true),
};

const ListModel = {
    "People": {
        "name": "People",
        "children": getSiblings(data.people, "full_name", true),
        "level": 2,
    },
    "Places": {
        "name": "Places",
        "children": getSiblings(data.places, "name", true),
        "level": 2,
    },
    "Stories": {
        "name": "Stories",
        "children": getSiblings(data.stories, "full_name", true),
        "level": 2,
    },
    "ETK Index": {
        "name": "ETK Index",
        "children": getSiblings(data.etk, "heading_english", true),
        "level": 2,
    },
    "Keywords": {
        "name": "Keywords",
        "children": getSiblings(data.keywords, "keyword_name", true),
        "level": 2,
    },
    "Fieldtrips": {
        "name": "Fieldtrips",
        "children": getSiblings(data.fieldtrips, "fieldtrip_name", true),
        "level": 2,
    },
    "Genres": {
        "name": "Genres",
        "children": getSiblings(data.genre, "name", true),
        "level": 2,
    },
    "Tangherlini Index": {
        "name": "Tangherlini Index",
        "children": getSiblings(data.tango, "type", true),
        "level": 2,
    },
};

export const ontologyToDisplayKey = {
    "ETK Index": "heading_english",
    "Tangherlini Index": "type",
    "Fieldtrips": "fieldtrip_name",
    "Genres": "name",
    "People": "full_name",
    "Places": "name",
    "Stories": "full_name",
};

// for finding links between people, places, stories
export const ontologyToSearchKey = {
    "ETK Index": "heading_english",
    "Tangherlini Index": "type",
    "Fieldtrips": "fieldtrip_name",
    "Genres": "name",
    "People": "full_name",
    "Places": "name",
    "Stories": "full_name",
};

export const tangoTypes = {
    "People Classes": {
        "name": "People Classes",
        "children": getChildren(data.tango, "type", "People Classes", true),
        "level": 3,
    },
    "Place Classes": {
        "name": "Places",
        "children": getChildren(data.tango, "type", "Place Classes", true),
        "level": 3,
    },
    "Tools, Items and Conveyances": {
        "name": "Tools, Items and Conveyances",
        "children": getChildren(data.tango, "type", "Tools, Items and Conveyances", true),
        "level": 3,
    },
    "Supernatural Beings": {
        "name": "Supernatural Beings",
        "children": getChildren(data.tango, "type", "Supernatural Beings", true),
        "level": 3,
    },
    "Animals": {
        "name": "Animals",
        "children": getChildren(data.tango, "type", "Animals", true),
        "level": 3,
    },
    "Action or events": {
        "name": "Action or events",
        "children": getChildren(data.tango, "type", "Action or events", true),
        "level": 3,
    },
    "Time, Season, Weather": {
        "name": "Time, Season, Weather",
        "children": getChildren(data.tango, "type", "Time, Season, Weather", true),
        "level": 3,
    },
    "Resolution": {
        "name": "Resolution",
        "childArray": getChildren(data.tango, "type", "Resolution", false),
        "parent": this["Topic & Navigator"],
        "children": getChildren(data.tango, "type", "Resolution", true),
        "level": 3,
    },
    "Stylistics": {
        "name": "Stylistics",
        "children": getChildren(data.tango, "type", "Stylistics", true),
        "level": 3,
    },
};

export const ontologyToID = {
    "Stories": "story_id",
    "Places": "place_id",
    "People": "person_id",
    "Fieldtrips": "fieldtrip_id",
};

export var OccupationDictionary = [
    {
        "ID": 1,
        "occupation": "pensioner(f)/aftægtskone",
        "": "",
    },
    {
        "ID": 2,
        "occupation": "pensioner(m)/aftægtsmand",
        "": "",
    },
    {
        "ID": 3,
        "occupation": "poverty assistance recipient/almisselem",
        "": "",
    },
    {
        "ID": 4,
        "occupation": "county council member/amtsrådsmedlem",
        "": "",
    },
    {
        "ID": 5,
        "occupation": "Anders Højbjærgs kone", // find english for this one, not in list
        "": "",
    },
    {
        "ID": 6,
        "occupation": "railway foreman/bane formand",
        "": "",
    },
    {
        "ID": 7,
        "occupation": "pedlar/bissekræmmer",
        "": "",
    },
    {
        "ID": 8,
        "occupation": "C. A. Kondrups kone",
        "": "",
    },
    {
        "ID": 9,
        "occupation": "theologian/Cand. Theol.",
        "": "",
    },
    {
        "ID": 10,
        "occupation": "clog maker/træskomand",
        "": "",
    },
    {
        "ID": 11,
        "occupation": "veterinarian/dyrlæge",
        "": "",
    },
    {
        "ID": 12,
        "occupation": "widow/enke",
        "": "",
    },
    {
        "ID": 13,
        "occupation": "fader var lærer", // no translation
        "": "",
    },
    {
        "ID": 14,
        "occupation": "fattighuslem", // no translation
        "": "",
    },
    {
        "ID": 15,
        "occupation": "pauper/fattiglem",
        "": "",
    },
    {
        "ID": 16,
        "occupation": "wheel repairer/felbereder",
        "": "",
    },
    {
        "ID": 17,
        "occupation": "field worker/markarbejder",
        "": "",
    },
    {
        "ID": 18,
        "occupation": "fisherman/fisker",
        "": "",
    },
    {
        "ID": 19,
        "occupation": "forhen. Ridedreng",
        "": "",
    },
    {
        "ID": 20,
        "occupation": "school principal/forstander",
        "": "",
    },
    {
        "ID": 21,
        "occupation": "lady/fru",
        "": "",
    },
    {
        "ID": 22,
        "occupation": "farmer/gaardmand",
        "": "",
    },
    {
        "ID": 23,
        "occupation": "farm owner/gårdejer",
        "": "",
    },
    {
        "ID": 24,
        "occupation": "farmer/gårdmand",
        "": "",
    },
    {
        "ID": 25,
        "occupation": "old farmowner/gårdmand (forhenværende gårdejer)",
        "": "",
    },
    {
        "ID": 26,
        "occupation": "farmer's daughter/gårdmandsdatter",
        "": "",
    },
    {
        "ID": 27,
        "occupation": "farmer's wife/gårdmandskone",
        "": "",
    },
    {
        "ID": 28,
        "occupation": "farmer's son/gårdmandssøn",
        "": "",
    },
    {
        "ID": 29,
        "occupation": "guddum fattiggård",
        "": "",
    },
    {
        "ID": 30,
        "occupation": "housewife",
        "": "",
    },
    {
        "ID": 31,
        "occupation": "house owner/husejer",
        "": "",
    },
    {
        "ID": 32,
        "occupation": "house wife/huskone",
        "": "",
    },
    {
        "ID": 33,
        "occupation": "small holder (cotter)/husmand",
        "": "",
    },
    {
        "ID": 34,
        "occupation": "Husmand og signetstikker", // no translation
        "": "",
    },
    {
        "ID": 35,
        "occupation": "husmandsdatter", // cotter's daughter?
        "": "",
    },
    {
        "ID": 36,
        "occupation": "house wife/husmoder",
        "": "",
    },
    {
        "ID": 37,
        "occupation": "house wife/hustru",
        "": "",
    },
    {
        "ID": 38,
        "occupation": "pensioner/indsidder",
        "": "",
    },
    {
        "ID": 39,
        "occupation": "Iver Bundgård Skades hustru",
        "": "",
    },
    {
        "ID": 40,
        "occupation": "J.P. Larsens hustru",
        "": "",
    },
    {
        "ID": 41,
        "occupation": "simgle woman/jomfru",
        "": "",
    },
    {
        "ID": 42,
        "occupation": "midwife/jordemoder",
        "": "",
    },
    {
        "ID": 43,
        "occupation": "journeyman miller/møllersvend",
        "": "",
    },
    {
        "ID": 44,
        "occupation": "church employee/kirkestilling ved Slagelse",
        "": "",
    },
    {
        "ID": 45,
        "occupation": "gypsy/kjæltringsfolket",
        "": "",
    },
    {
        "ID": 46,
        "occupation": "folk healer (male)/klog mand",
        "": "",
    },
    {
        "ID": 47,
        "occupation": "folk healer (male)/klogmand",
        "": "",
    },
    {
        "ID": 48,
        "occupation": "grocer/købmand",
        "": "",
    },
    {
        "ID": 49,
        "occupation": "grocer's wife/købmands kone",
        "": "",
    },
    {
        "ID": 50,
        "occupation": "wife/kone",
        "": "",
    },
    {
        "ID": 51,
        "occupation": "broom maker/kostebinder",
        "": "",
    },
    {
        "ID": 52,
        "occupation": "teacher/lærer",
        "": "",
    },
    {
        "ID": 53,
        "occupation": "retired teacher/lærer (pens)",
        "": "",
    },
    {
        "ID": 54,
        "occupation": "teacher/lærer",
        "": "mange år biskolelærer ved Sunds 4 biskoler",
    },
    {
        "ID": 55,
        "occupation": "teachers wife/lærers kone",
        "": "",
    },
    {
        "ID": 56,
        "occupation": "Lars Jensens kone",
        "": "",
    },
    {
        "ID": 57,
        "occupation": "lady/madam",
        "": "",
    },
    {
        "ID": 58,
        "occupation": "dairy worker/mejerist",
        "": "",
    },
    {
        "ID": 59,
        "occupation": "miller/møller",
        "": "",
    },
    {
        "ID": 60,
        "occupation": "Niels Pedersens kone",
        "": "",
    },
    {
        "ID": 61,
        "occupation": "par gamle mænd",
        "": "",
    },
    {
        "ID": 62,
        "occupation": "pastor/pastor",
        "": "",
    },
    {
        "ID": 63,
        "occupation": "Pensioner/indsidder", // there are like 3 different translations, i chose this one
        "": "",
    },
    {
        "ID": 64,
        "occupation": "rag pedlar/pjaltekræmmer",
        "": "",
    },
    {
        "ID": 65,
        "occupation": "minister/præst",
        "": "",
    },
    {
        "ID": 66,
        "occupation": "horse boy/ridedreng",
        "": "",
    },
    {
        "ID": 67,
        "occupation": "stall hand/røgter",
        "": "",
    },
    {
        "ID": 68,
        "occupation": "forest ranger/skovfoged",
        "": "",
    },
    {
        "ID": 69,
        "occupation": "tailor/skrædder",
        "": "",
    },
    {
        "ID": 70,
        "occupation": "small holder/husmand",
        "": "",
    },
    {
        "ID": 71,
        "occupation": "smith/smed",
        "": "",
    },
    {
        "ID": 72,
        "occupation": "Smed og et par andre mænd",
        "": "",
    },
    {
        "ID": 73,
        "occupation": "cabinet maker/snedker",
        "": "",
    },
    {
        "ID": 74,
        "occupation": "bailiff/sognefoged",
        "": "",
    },
    {
        "ID": 75,
        "occupation": "søn ejede Rask Mølle",
        "": "",
    },
    {
        "ID": 76,
        "occupation": "folk musician/spillemand (omvandrende)",
        "": "",
    },
    {
        "ID": 77,
        "occupation": "station foreman/stationsforstander",
        "": "",
    },
    {
        "ID": 78,
        "occupation": "Sygpige",
        "": "",
    },
    {
        "ID": 79,
        "occupation": "carpenter/tømrer",
        "": "",
    },
    {
        "ID": 80,
        "occupation": "clog maker/træskomand",
        "": "",
    },
    {
        "ID": 81,
        "occupation": "drejer/turner",
        "": "",
    },
    {
        "ID": 82,
        "occupation": "cooperative leader/uddeler",
        "": "",
    },
    {
        "ID": 83,
        "occupation": "wheatbread woman/hvedebrødskone",
        "": "",
    },
    {
        "ID": 84,
        "occupation": "ungkarl", // bachelor?
        "": "",
    },
    {
        "ID": 85,
        "occupation": "gartner/gartner",
        "": "",
    },
    {
        "ID": 86,
        "occupation": "shoemaker/skomager",
        "": "",
    },
];

/**
 * Retrieve a story by its ID
 * @param {Number} story_id The ID of the story to get
 * @returns {Story} The requested story
 */
export function getStoryByID(story_id) {
    // just get it from the relevant array
    return formattedStoryData[story_id];
}

/**
 * Retrieve a person by its ID
 * @param {Number} person_id The ID of the person to get
 * @returns {Person} The requested person
 */
export function getPeopleByID(person_id) {
    // an object to store the person;
    var personObject = realPeopleData[person_id];
    // check if the person is actually defined
    if (typeof personObject !== "undefined" && person_id !== null) {
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
        return {
            "person_id": -1,
            "birth_date": "",
            "core_informant": -1,
            "death_date": "",
            "first_name": "",
            "fullbio": "",
            "gender": "",
            "image": "",
            "intro_bio": "",
            "last_name": "",
            "occupations": {},
            "places": [],
            "stories": [],
        };
    }
}

/**
 * Retrieve a place by its id
 * @param {Number} place_id The ID of the place to get
 * @returns {Place} The requested place
 */
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

/**
 * Retrieve a fieldtrip by its ID
 * @param {Number} fieldtrip_id The ID of the fieldtrip to get
 * @returns {Fieldtrip} The requested fieldtrip
 */
export function getFieldtripsByID(fieldtrip_id) {
    // if anything but the all fieldtrip is selected
    if (fieldtrip_id !== allFieldtripId) {
        // retrieve the relevant information
        // iMPORTANT: use spread syntax so that we don't mutate the original fieldtrip data
        var fieldtripObject = {...fieldtripsData[fieldtrip_id]};
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
                        fieldtripValue.forEach(function (datum) {
                            // boolean to check if the datum needs to be added
                            var pushDatum = true;
                            // iterate for each element in the relevant array in allFieldtrip
                            allFieldtrip[key].forEach(function (element) {
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

// return array of same key:pair value (i.e. gets me a list of all children of "Places")
function getChildren(list, key, value, isObj) {
    var items = [];
    for (var i = 0; i < list.length; i++) {
        if (value === list[i][key]) {
            if (isObj) {
                items.push(list[i]);
            } else {
                items.push(list[i].name);
            }
        }
    }
    return items;
}

// return array of values with the same key
function getSiblings(list, key, isObj) {
    if (key === "MAIN" || key === "TOPIC" || key === "PPS" || key === "") {
        return list;
    }
    if (typeof list !== "undefined" && typeof key !== "undefined") {
        var prev = [];
        for (var i = 0; i < list.length; i++) {
            var curr = list[i][key];
            if (!prev.includes(curr)) {
                if (isObj) {
                    prev.push(list[i]);
                } else {
                    prev.push(curr);
                }
            }
        }
        return prev;
    }
    alert("Can't get siblings!");
}

export function getList(ontology) {
    return ListModel[ontology]["children"];
}

export function getKeywords() {
    var keywordsAll = keywords["children"].concat(ListModel["Stories"]["children"]);
    return keywordsAll;
}

// tODO: clean up undefined/empty values (i.e. last value of fieldtrip search results)

export function dateFilterHelper(startDate, endDate, ontology) {
    console.log(startDate, endDate, ontology);
    // go through fieldtrips to see which fieldtrips fit within dates
    var fieldtripsInDates = [];
    data.fieldtrips.forEach((fieldtrip) => {
        if (parseInt(fieldtrip["start_date"]) >= startDate && parseInt(fieldtrip["end_date"]) <= endDate) {
            fieldtripsInDates.push(fieldtrip);
        }
    });
    if (ontology !== "Fieldtrips") {
        // this is because the data structure is stupid so you have stories_collected { story: {}/[] } so you have to get
        // access to "story" instead of just "stories_collected to get what you want
        var ontologyToFieldtripKey = {
            "Stories": {"firstKey": "stories_collected", "secondKey": "story"},
            "Places": {"firstKey": "places_visited", "secondKey": "place"},
            "People": {"firstKey": "people_visited", "secondKey": "person"},
        };
        var fieldtripKey = ontologyToFieldtripKey[ontology];
        // for fieldtrips that fit within dates, return list of either story, people, or places visited
        var UniqueItems = [];
        if (typeof fieldtripKey !== "undefined") {
            fieldtripsInDates.forEach((fieldtrip) => {
                // for each fieldtrip, get array of people, places, or stories
                // handle fieldtrip data if second key doesn't exist (i.e. stories_collected:[stories...] and stories_collected:{stories...})
                var uncleanedItems;

                if (fieldtrip[fieldtripKey["firstKey"]] instanceof Array) {
                    uncleanedItems = fieldtrip[fieldtripKey["firstKey"]];
                    console.log("An array!!!");
                } else {
                    // if fieldtrip['stories_collected'] has object ({'stories':[stories...]}), get to stories
                    uncleanedItems = fieldtrip[fieldtripKey["firstKey"]][fieldtripKey["secondKey"]];
                }

                var CurrentFieldtripItems = arrayTransformation(uncleanedItems);

                if (typeof CurrentFieldtripItems !== "undefined") {
                    var IDKey = Object.keys(CurrentFieldtripItems[0])[0]; // the ID key will be the first key of every item object
                    // create unique list of people, places, or stories
                    CurrentFieldtripItems.forEach((item) => {
                        var notExistsInList = true;
                        UniqueItems.forEach((currentItem) => {
                            if (currentItem[IDKey] === item[IDKey]) {
                                notExistsInList = false;
                            }
                        });
                        if (notExistsInList) {
                            UniqueItems.push(item);
                        }
                    });
                }
            });
            return UniqueItems;
        }
    } else {
        return fieldtripsInDates;
    }
}

// called when there's a list of place_id's
export function getPlaces(PlaceIDList) {
    var PlaceList = [];
    var place = {};
    PlaceIDList.forEach((placeID) => {
        place = data["places"].find((place) => {
            return place["place_id"] === placeID;
        });
        PlaceList.push(place);
    });

    return PlaceList;
}
