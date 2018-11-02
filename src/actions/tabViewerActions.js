import * as types from './actionTypes';

function url(){
    return 'www.google.com'
}

export function receiveStuff(json){
    return {type:types.RECEIVE_STUFF, stuff: json.stuff}
}

export function fetchStuff(){
    return {types:types.FETCH_STUFF, stuff: 'fetching stuff'}
}