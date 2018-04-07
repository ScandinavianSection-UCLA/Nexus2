/**
 * Created by danielhuang on 1/21/18.
 */
import dataKeywords from '../../data/ckeywords.json'
import dataTango from '../../data/ctango_indices.json'
import dataETK from '../../data/cetk_indices.json'
import dataGenre from '../../data/cgenres.json'
import dataFieldtrips from '../../data/cfieldtrips.json'
import informants from '../../data/cinformants.json'
import storySearch from '../../data/cstories.json'
import places from '../../data/cplaces.json'

const data = {
    keywords:dataKeywords.keyword,
    tango:dataTango.tango_index,
    etk:dataETK.etk_index,
    genre:dataGenre.genre,
    fieldtrips:dataFieldtrips.fieldtrip,
    people: informants.informant,
    places: places.place,
    stories: storySearch.story,
};

//return array of same key:pair value (i.e. gets me a list of all children of "Places")
function getChildren(list,key,value,isObj){
    var items=[];
    for(var i=0; i<list.length; i++){
        if(value === list[i][key]){
            if(isObj){
                items.push(list[i]);
            } else {
                items.push(list[i].name);
            }
        }
    }
    return items;
}

//return array of values with the same key
function getSiblings(list,key,isObj) {
    if (key === 'MAIN' || key === 'TOPIC' || key === 'PPS' || key === '') {
        return list;
    }
    if (typeof list !== 'undefined' && typeof key !== 'undefined') {
        var prev = [];
        for (var i = 0; i < list.length; i++) {
            var curr = list[i][key];
            if (!prev.includes(curr)) {
                if(isObj){
                    prev.push(list[i])
                } else {
                    prev.push(curr);
                }
            }
        }
        return prev;
    }
    alert("Can't get siblings!");
}

export function arrayTransformation(item){
    var finalArray=[];
    if(Array.isArray(item)){
        finalArray = item;
    } else if(typeof item === 'object'){
        finalArray.push(item);
    }
    //if item is undefined (meaning there's no people/stories/places associated) then return empty array
    return finalArray;
}

export function getList(ontology){
    return ListModel[ontology]['children'];
}

export function getKeywords(){
    var keywordsAll = keywords['children'].concat(ListModel['Stories']['children']);
    return keywordsAll;
}

const keywords = {
    name:'keywords',
    children:getSiblings(data.keywords,'keyword_name',true)
};

export const ontologyToDisplayKey = {
    'ETK Indice':'heading_english',
    'Tangherlini Index':'type',
    'Fieldtrips':'fieldtrip_name',
    'Genres':'name',
    'People':'full_name',
    'Places':'name',
    'Stories':'full_name'
};

export const tangoTypes = {
    'People Classes':{
        name:'People Classes',
        children:getChildren(data.tango,'type','People Classes',true),
        level:3
    },
    'Place Classes':{
        name:'Places',
        children:getChildren(data.tango,'type','Place Classes',true),
        level:3
    },
    'Tools, Items and Conveyances':{
        name:'Tools, Items and Conveyances',
        children:getChildren(data.tango,'type','Tools, Items and Conveyances',true),
        level:3
    },
    'Supernatural Beings':{
        name:'Supernatural Beings',
        children:getChildren(data.tango,'type','Supernatural Beings',true),
        level:3
    },
    'Animals':{
        name:'Animals',
        children:getChildren(data.tango,'type','Animals',true),
        level:3
    },
    'Action or events':{
        name:'Action or events',
        children:getChildren(data.tango,'type','Action or events',true),
        level:3
    },
    'Time, Season, Weather':{
        name:'Time, Season, Weather',
        children:getChildren(data.tango,'type','Time, Season, Weather',true),
        level:3
    },
    'Resolution':{
        name:'Resolution',
        childArray:getChildren(data.tango,'type','Resolution', false),
        parent:this['Topic & Navigator'],
        children:getChildren(data.tango,'type','Resolution',true),
        level:3
    },
    'Stylistics':{
        name:'Stylistics',
        children:getChildren(data.tango,'type','Stylistics',true),
        level:3
    },
};


//TODO: clean up undefined/empty values (i.e. last value of fieldtrip search results)

const ListModel = {
    'People':{
        name:'People',
        children:getSiblings(data.people,'full_name',true),
        level:2
    },
    'Places':{
        name:'Places',
        children:getSiblings(data.places,'name',true),
        level:2
    },
    'Stories':{
        name:'Stories',
        children:getSiblings(data.stories,'full_name',true),
        level:2
    },
    'ETK Indice':{
        name:'ETK Indice',
        children:getSiblings(data.etk,'heading_english',true),
        level:2
    },
    'Keywords':{
        name:'Keywords',
        children:getSiblings(data.keywords,'keyword_name',true),
        level:2
    },
    'Fieldtrips':{
        name:'Fieldtrips',
        children:getSiblings(data.fieldtrips,'fieldtrip_name',true),
        level:2
    },
    'Genres':{
        name:'Genres',
        children:getSiblings(data.genre,'name',true),
        level:2
    },
    'Tangherlini Index':{
        name:'Tangherlini Index',
        children:getSiblings(data.tango,'type',true),
        level:2
    },
};

export const ontologyToID = {
    'Stories':'story_id',
    'Places':'place_id',
    'People':'person_id',
    'Fieldtrips':'fieldtrip_id'
};

export function dateFilterHelper(startDate, endDate, ontology){
    console.log(startDate,endDate,ontology);
    //go through fieldtrips to see which fieldtrips fit within dates
    var fieldtripsInDates = [];
    data.fieldtrips.forEach((fieldtrip)=>{
        if(parseInt(fieldtrip['start_date']) >= startDate && parseInt(fieldtrip['end_date']) <= endDate){
            fieldtripsInDates.push(fieldtrip);
        }
    });
    if(ontology !== 'Fieldtrips'){
        //this is because the data structure is stupid so you have stories_collected { story: {}/[] } so you have to get
        //access to "story" instead of just "stories_collected to get what you want
        var ontologyToFieldtripKey = {
            'Stories':{firstKey:'stories_collected', secondKey:'story'},
            'Places' :{firstKey:'places_visited', secondKey:'place'},
            'People' :{firstKey:'people_visited', secondKey:'person'},
        };
        var fieldtripKey = ontologyToFieldtripKey[ontology];
        //for fieldtrips that fit within dates, return list of either story, people, or places visited
        var UniqueItems = [];
        if(typeof fieldtripKey !== 'undefined'){
            fieldtripsInDates.forEach((fieldtrip)=>{
                //for each fieldtrip, get array of people, places, or stories
                var uncleanedItems = fieldtrip[fieldtripKey['firstKey']][fieldtripKey['secondKey']];
                var CurrentFieldtripItems = arrayTransformation(uncleanedItems);
                if(typeof CurrentFieldtripItems !== 'undefined'){
                    var IDKey = Object.keys(CurrentFieldtripItems[0])[0]; //the ID key will be the first key of every item object
                    //create unique list of people, places, or stories
                    CurrentFieldtripItems.forEach((item) =>{
                        var notExistsInList = true;
                        UniqueItems.forEach((currentItem)=>{
                            if(currentItem[IDKey] === item[IDKey]){
                                notExistsInList = false;
                            }
                        });
                        if(notExistsInList){
                            UniqueItems.push(item);
                        }
                    });
                }
            });
            console.log(UniqueItems);
            return UniqueItems;
        }
    } else {
        return fieldtripsInDates;
    }
}