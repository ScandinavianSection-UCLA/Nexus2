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

export function getStoryByID(story_id){
    console.log(formattedStoryData[story_id]);
    return formattedStoryData[story_id]
}

export function getPeopleByID(person_id){
    var personObject = realPeopleData[person_id];
    if(personObject['places'] !== null && personObject['stories']!==null){
        personObject['places'] = arrayTransformation(personObject['places'].place);
        personObject['stories'] = arrayTransformation(personObject['stories'].story)
    }
    console.log('Get People by ID',realPeopleData[person_id]);
    return realPeopleData[person_id];
}

export function getPlacesByID(place_id){
    var placeObject = placesData[place_id];
    console.log(placeObject.people);
    if(placeObject.people !== null && placeObject.people !== [] && typeof placeObject.people !== 'undefined'){
        placeObject['people'] = arrayTransformation(placesData[place_id].people.person);
    } else {
        delete placeObject.people
    }
    if(place_id in placesMentionedData && place_id in storiesCollectedData){
        placeObject['storiesCollected'] = arrayTransformation(storiesCollectedData[place_id].stories.story);
        placeObject['storiesMentioned'] = arrayTransformation(placesMentionedData[place_id].stories.story);
    } else if(place_id in storiesCollectedData) {
        placeObject['storiesCollected'] = arrayTransformation(storiesCollectedData[place_id].stories.story);
    } else if(place_id in placesMentionedData){
        placeObject['storiesMentioned'] = arrayTransformation(placesMentionedData[place_id].stories.story);
    }
    return placeObject;
}

export function getFieldtripsByID(fieldtrip_id){
    var fieldtripObject = fieldtripsData[fieldtrip_id];
    console.log('Get Fieldtrips by ID',fieldtripObject);
    if(fieldtripObject['people_visited'] !== null && fieldtripObject['places_visited'] !== null && fieldtripObject['stories_collected'] !== null){
        fieldtripObject['people_visited'] = arrayTransformation(fieldtripObject['people_visited'].person);
        fieldtripObject['places_visited'] = arrayTransformation(fieldtripObject['places_visited'].place);
        fieldtripObject['stories_collected'] = arrayTransformation(fieldtripObject['stories_collected'].story);
    }
    return fieldtripObject;
}

function arrayTransformation(item){
    var finalArray=[];
    console.log(typeof item,Array.isArray(item));
    if(Array.isArray(item)){
        finalArray = item;
    } else if(typeof item === 'object'){
        finalArray.push(item);
    }
    //if item is undefined (meaning there's no people/stories/places associated) then return empty array
    return finalArray;
}

function arrOfObjToObj(arrOfObj, id){
    var resultObj = {};

    arrOfObj.forEach((obj) => {
        resultObj[obj[id]] = obj;
    });
    return resultObj;
}