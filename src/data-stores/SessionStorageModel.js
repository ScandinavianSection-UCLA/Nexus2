/*
* Session Storage Functions with type + data checking
* */

/**
* Sets Session Storage Data - Performs typecheck of data stored in Session Storage before setting it in sessionStorage
* @param {String} name Name of the item to be stored
* @param {Object} object Object to be stored
* */
export function setSessionStorage(name, object) {
    // make sure the name is a string
    if (typeof name !== "string") {
        throw new Error("Name is not a String!");
    }
    // make sure that we are setting an object
    if (!(object instanceof Object)) {
        throw new Error("Object is not an Object!");
    }
    sessionStorage.setItem(name, JSON.stringify(object));
}

/**
 * Gets Session Storage Data - Performs typecheck of data retrieved, returns false if data is null or not an object
 * @param {String} ItemName Name of the item to be retrieved
 * @returns {Object} null if invalid session retrieval, or the SessionItem found in sessionStorage
* */
export function getSessionStorage(ItemName) {
    // get the relevant item from session storage
    const SessionItem = JSON.parse(sessionStorage.getItem(ItemName));
    // return null if it isn't an object
    if (!(SessionItem instanceof Object)) {
        return null;
    } else {
        // success! return the retrieved item
        return SessionItem;
    }
}
