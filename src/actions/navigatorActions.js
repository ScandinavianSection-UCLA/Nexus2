// get possible action types
import * as types from "./actionTypes";

/**
 * Update the items available to Navigator
 * @param {Array} list Items to give to navigator
 */
export function displayItems(list) {
    return {
        "payload": list,
        "type": types.DISPLAY_ITEMS,
    };
}

/**
 * Handler for a time filter's change
 * @param {Event} event Event describing the change
 */
export function timeFilterHandler({target}) {
    return {
        "payload": target,
        "type": types.TIME_FILTER_HANDLER,
    };
}
