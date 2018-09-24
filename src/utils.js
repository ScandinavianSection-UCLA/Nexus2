/**
 * Created by danielhuang on 1/14/18.
 */
//return array of same key:pair value (i.e. gets me a list of all children of "Places")
export function getChildren(list,key,value){
    var items=[];
    for(var i=0; i<list.length; i++){
        if(value === list[i][key]){
            items.push(list[i]);
        }
    }
    return items;
}

//return array of values with the same key
export function getSiblings(list,key){
    if(key==='MAIN' || key==='TOPIC' || key==='PPS' || key===''){
        return list;
    }
    if(typeof list !== 'undefined' && typeof key !== 'undefined'){
        var prev = [];
        for(var i=0;i<list.length;i++){
            var curr = list[i][key];
            if(!prev.includes(curr)){
                prev.push(curr);
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
    } else {
        finalArray.push(item);
    }
    //if item is undefined (meaning there's no people/stories/places associated) then return empty array
    return finalArray;
}

Array.prototype.diff = function(arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for(var i = 0; i < this.length; i += 1) {
        if(arr2.indexOf(this[i]) > -1){
            ret.push(this[i]);
        }
    }
    return ret;
};

//convert list of place objects to list of place id's
export function setPlaceIDList(items, ontology){
    var PlaceIDList = [];
    if(ontology==='Stories'){

        if(ontology==='Fieldtrips'){this.setState({fieldtrips:items})}

        //list must only contain stories, for each story get the place_recorded id

        items.forEach((item)=>{
            if(item['place_recorded'] && typeof item['place_recorded'] === 'object'){
                PlaceIDList.push(item['place_recorded']['id']);
            }
        });

        // var PlaceList = getPlaces(PlaceIDList);
    }else{ //if this isn't a story, this is a place
        items.forEach((item) =>{
            PlaceIDList.push(item['place_id']);
        });
    }
    return PlaceIDList;
}