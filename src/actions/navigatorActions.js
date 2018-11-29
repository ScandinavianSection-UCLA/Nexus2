// get possible action types
import * as types from "./actionTypes";

/**
 * Update the items available to Navigator
 * @param {Array} list Items to give to navigator
 * @param {String} ontology Ontology of `list`
 */
export function displayItems(list, ontology) {
    return {
        "payload": {list, ontology},
        "type": types.DISPLAY_ITEMS,
    };
}

/**
 * Handler for a time filter's change
 * @param {String} filter The filter that was changed
 * @param {Event} event Event describing the change
 */
export function timeFilterHandler(filter, event) {
    return {
        "payload": {event, filter},
        "type": types.TIME_FILTER_HANDLER,
    };
}
