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