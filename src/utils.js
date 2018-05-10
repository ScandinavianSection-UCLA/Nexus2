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

Array.prototype.diff = function(arr2, type) {
    var ret = [],
        id='';
    var typeToID = {
        Stories: 'story_id',
        People: 'person_id',
        Places: 'place_id',
    };
    id = typeToID[type];
    this.sort((a,b)=>{return a[id] - b[id];}); // sort by id in descending order
    arr2.sort((a,b)=>{return a[id] - b[id];});

    for(var i = 0; i < this.length; i += 1) {
        if(arr2.find((element)=>{ return element[id] === this[i][id]; })){ //if (arr2.find((element)=>{ return element['id'] === this[i] })
            ret.push(this[i]);
        }
    }
    return ret;
};

//TODO: function to extract id's into an array