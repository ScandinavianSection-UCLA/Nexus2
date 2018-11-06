/**
 * Created by danielhuang on 1/14/18.
 */
// return array of same key:pair value (i.e. gets me a list of all children of "Places")
export function getChildren(list, key, value) {
    var items = [];
    for (var i = 0; i < list.length; i++) {
        if (value === list[i][key]) {
            items.push(list[i]);
        }
    }
    return items;
}

// return array of values with the same key
export function getSiblings(list, key) {
    if (key === "MAIN" || key === "TOPIC" || key === "PPS" || key === "") {
        return list;
    }
    if (typeof list !== "undefined" && typeof key !== "undefined") {
        var prev = [];
        for (var i = 0; i < list.length; i++) {
            var curr = list[i][key];
            if (!prev.includes(curr)) {
                prev.push(curr);
            }
        }
        return prev;
    }
    alert("Can't get siblings!");
}

/**
 * Ensure that the input is an array
 * @param {*} item The input to array-ify
 * @returns {Array} Either the input if it was already an array, or a single element array containing the input
 */
export function arrayTransformation(item) {
    if (Array.isArray(item)) {
        // if the input is already an array, just return it
        return item;
    } else if (typeof item !== "undefined" && item !== null) {
        // assuming it is defined properly, return a single element array with the input in it
        return [item];
    } else {
        // return empty if the item is undefined/null
        return [];
    }
}

/**
 * Get the common elements of two arrays
 * @param {Array} array1 An array to check for common elements with
 * @param {Array} array2 Another array to check for common elements with
 * @returns {Array} An array contianing the elements present in both arrays
 */
export function diff(array1, array2) {
    // return array1, filtered for only elements that are also in array2
    return array1.filter(element => array2.includes(element));
}

// convert list of place objects to list of place id's
export function setPlaceIDList(items, ontology) {
    var PlaceIDList = [];
    if (ontology === "Stories") {

        if (ontology === "Fieldtrips") {
            this.setState({"fieldtrips": items});
        }

        // list must only contain stories, for each story get the place_recorded id

        items.forEach((item) => {
            if (item["place_recorded"] && typeof item["place_recorded"] === "object") {
                PlaceIDList.push(item["place_recorded"]["id"]);
            }
        });

        // var PlaceList = getPlaces(PlaceIDList);
    } else { // if this isn't a story, this is a place
        items.forEach((item) => {
            PlaceIDList.push(item["place_id"]);
        });
    }
    return PlaceIDList;
}
