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
 * Convert a list of places to a list of IDs
 * @param {Array} places The list of places to convert
 * @returns {Array} A list of the places' IDs
 */
export function getPlaceIDList(places) {
    return places.map((places) => places.place_id);
}

/**
 * Creates a given array to only have unique values
 * @param {Array} array array we want to remove duplicates for
 * @return {Array} the array with unique values
 */
export function ArrNoDupe(array) {
    return array.filter((item, index) => array.indexOf(item) === index);
}
