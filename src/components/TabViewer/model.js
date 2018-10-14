/**
 * Created by danielhuang on 1/29/18.
 */
import AllStories from '../../data/allstories.json';
import AllInformants from '../../data/allinformants.json';
import PlacesData from '../../data/cplaces.json';
import StoriesCollectedData from '../../data/cstories_collected.json';
import PlacesMentionedData from '../../data/cplaces_mentioned.json';
import FieldtripsData from '../../data/cfieldtrips.json';

const realPeopleData = arrOfObjToObj(AllInformants,'person_id');
const formattedStoryData = arrOfObjToObj(AllStories,'story_id');
const placesData = arrOfObjToObj(PlacesData.place,'place_id');
const storiesCollectedData = arrOfObjToObj(StoriesCollectedData.place,'place_id');
const placesMentionedData = arrOfObjToObj(PlacesMentionedData.place,'place_id');
const fieldtripsData = arrOfObjToObj(FieldtripsData.fieldtrip,'fieldtrip_id');
// fieldtrip_id of all fieldtrip is -1
const all_fieldtrip_id = -1;

export function getStoryByID(story_id) {
    return formattedStoryData[story_id];
}

export function getPeopleByID(person_id){
    var personObject = realPeopleData[person_id];
    var DefinedPerson = typeof personObject !== 'undefined';
    if (DefinedPerson) {
      var DefinedPlaces = typeof personObject['places'] !== 'undefined',
          DefinedStories = typeof personObject['stories']!== 'undefined',
          DefinedPlace = typeof personObject['places'].place !== 'undefined',
          DefinedStory = typeof personObject['stories'].story !== 'undefined';
      if(DefinedPlaces && DefinedStories && DefinedPlace && DefinedStory){
            personObject['places'] = arrayTransformation(personObject['places'].place);
            personObject['stories'] = arrayTransformation(personObject['stories'].story);
      }

      return realPeopleData[person_id];
    }

    console.log("person_id doesn't exist");
}

export function getPlacesByID(place_id) {
    var placeObject = placesData[place_id];
    if (typeof placeObject !== 'undefined') {
      if (typeof placeObject.people !== 'undefined' && placeObject.people !== [] && placeObject.people !== null) {
        placeObject['people'] = arrayTransformation(placesData[place_id].people);
      } else {
        delete placeObject.people;
      }
      if (place_id in placesMentionedData && place_id in storiesCollectedData) {
        placeObject['storiesCollected'] = arrayTransformation(storiesCollectedData[place_id].stories.story);
        placeObject['storiesMentioned'] = arrayTransformation(placesMentionedData[place_id].stories.story);
      } else if (place_id in storiesCollectedData) {
        placeObject['storiesCollected'] = arrayTransformation(storiesCollectedData[place_id].stories.story);
      } else if (place_id in placesMentionedData) {
        placeObject['storiesMentioned'] = arrayTransformation(placesMentionedData[place_id].stories.story);
      }
      return placeObject;
    } else {
      console.log("placeObject not defined.");
    }
}

export function getFieldtripsByID(fieldtrip_id) {
    if (fieldtrip_id !== all_fieldtrip_id) {
        var fieldtripObject = fieldtripsData[fieldtrip_id];
        if (fieldtripObject['people_visited'] !== null && fieldtripObject['places_visited'] !== null && fieldtripObject['stories_collected'] !== null){
            fieldtripObject['people_visited'] = arrayTransformation(fieldtripObject['people_visited'].person);
            fieldtripObject['places_visited'] = arrayTransformation(fieldtripObject['places_visited'].place);
            fieldtripObject['stories_collected'] = arrayTransformation(fieldtripObject['stories_collected'].story);
        }
        return fieldtripObject;
    } else { // if all fieldtrip is selected
        var allFieldTrip = {
            'end_date': '1898-06-08',
            'fieldtrip_id': all_fieldtrip_id,
            'fieldtrip_name': 'All fieldtrips',
            'people_visited': [],
            'places_visited': [],
            'shapefile': '',
            'start_date': '1887-02-03',
            'stories_collected': [],
        };
        for (var fieldtrip_id in fieldtripsData) {
            var fieldtrip = fieldtripsData[fieldtrip_id];
            if (fieldtrip_id !== all_fieldtrip_id) {
                for (var key in allFieldTrip) {
                    if (Array.isArray(allFieldTrip[key]) && typeof fieldtrip[key] !== 'undefined') {
                        var fieldtripValue = fieldtrip[key];
                        allFieldTrip[key] = allFieldTrip[key].concat(fieldtripValue[Object.keys(fieldtripValue)[0]]);
                    }
                }
            }
        }
        return allFieldTrip;
    }
}

function arrayTransformation(item) {
    var finalArray = [];

    if (Array.isArray(item) || item === null) {
        finalArray = item;
    } else if (typeof item === 'object') {
        finalArray.push(item);
    }

    // if item is undefined (meaning there's no people/stories/places associated) then return empty array
    return finalArray;
}

function arrOfObjToObj(arrOfObj, id) {
    var resultObj = {};

    arrOfObj.forEach((obj) => {
        resultObj[obj[id]] = obj;
    });

    return resultObj;
}
