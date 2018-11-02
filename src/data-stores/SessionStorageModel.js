/*
* Session Storage Functions with type + data checking
* */

/**
* Sets Session Storage Data - Performs typecheck of data stored in Session Storage before setting it in sessionStorage
* @param {String} name of item to be stored
* @param {Object} object to be stored
* */
export function setSessionStorage(name, object){
    if(typeof name !== 'string'){
        throw "Name is not a String!"
    }
    if(!(object instanceof Object)){
        throw "Object is not an Object"
    }
    sessionStorage.setItem(name,JSON.stringify(object));
}

/**
 * Gets Session Storage Data - Performs typecheck of data retrieved, returns false if data is null or not an object
 * @param {String} ItemName of item to be retrieved
 * @returns false if invalid session retrieval, or the SessionItem found in sessionStorage
* */
export function getSessionStorage(ItemName){
    let SessionItem = JSON.parse(sessionStorage.getItem(ItemName));
    //typecheck if item is not an object or it is null
    if(!(SessionItem instanceof Object) || SessionItem === null){
        return false;
    } else {
        return SessionItem;
    }
}