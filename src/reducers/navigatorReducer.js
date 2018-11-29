// types of actions we can perform
import * as actions from "../actions/actionTypes";
// data helpers
import {
    dateFilterHelper,
    ontologyToID,
} from "../data-stores/DisplayArtifactModel";
// starter state if there is no previous data
import initialState from "./initialState";

/**
 * Update the items displayed in Navigator
 * @param {Object} prevState Pre-update state
 */
function updateItems(prevState) {
    // get the currently displayed ontology, and potential items to display
    const {displayOntology, fromDate, itemsList, timeFilterOn, toDate} = prevState;
    // if we have a restricted time range to look at
    if (timeFilterOn === true) {
        // key to get the ID of the items to display
        const idKey = ontologyToID[displayOntology],
            // get display artifacts that fit the time filter
            idsInRange = dateFilterHelper(fromDate, toDate, displayOntology)
                // convert them to IDs; this is to speed filtering later on
                .map((item) => item[idKey]);
        return {
            ...prevState,
            // update the displayed items
            "displayList": itemsList.filter(
                // only show items that are in the time range
                (item) => idsInRange.includes(item[idKey])
            ),
        };
    } else if (timeFilterOn === false) {
        // no filter, show all the possible items
        return {
            ...prevState,
            "displayList": itemsList,
        };
    } else {
        // time filter isn't boolean, what?
        console.warn(`Invalid time filter state: ${timeFilterOn}`);
        return prevState;
    }
}

/**
 *
 * @param {*} prevState
 * @param {*} payload
 * @returns {newState}
 */
function displayItems(prevState, {list, ontology}) {
    // set up the items based on
    const newState = {
        ...prevState,
        "displayList": list,
        "displayOntology": ontology,
        "itemsList": list,
        "placeList": list,
    };
    if (newState.timeFilterOn === true) {
        // if the time filter is on, we need
        return updateItems(newState);
    }
    return newState;
}

/**
 *
 * @param {*} filter
 * @param {*} event
 */
function timeFilterHandler(prevState, {filter, event}) {
    console.log("got here!");
    switch (filter) {
        case "fromDate": {
            const newState = {
                ...prevState,
                "fromDate": event.target.value,
            };
            // check if the dates are valid dates (4 digits, between 1887 and 1899)
            if (newState.fromDate >= 1887) {
                return updateItems(newState);
            } else {
                return newState;
            }
        }
        case "toDate": {
            const newState = {
                ...prevState,
                "toDate": event.target.value,
            };
            // check if the dates are valid dates (4 digits, between 1887 and 1899)
            if (newState.toDate <= 1899) {
                return updateItems(newState);
            } else {
                return newState;
            }
        }
        case "timelineFilter":
            return updateItems({
                ...prevState,
                "timeFilterOn": event.target.checked,
            });
        default:
            console.warn(`Invalid filter: ${filter}`);
            return prevState;
    }
}

/**
 * Generic handler for navigator
 * @param {Object} state The pre-update state
 * @param {Object} action Action to do to the tabs
 * @returns {Object} The updated state
 */
export default function navigator(state = initialState.navigator, action) {
    // depending on which action to perform
    switch (action.type) {
        // if we are to add a tab
        case actions.UPDATE_ITEMS:
            return updateItems(state);
        // if we are to add a tab
        case actions.DISPLAY_ITEMS:
            return displayItems(state, action.payload);
        // if we are to add a tab
        case actions.TIME_FILTER_HANDLER:
            return timeFilterHandler(state, action.payload);
        // unhandled action type
        default:
            // warn that we hit a bad action
            console.warn(`Invalid action: ${action.type}`);
            // don't change anything
            return state;
    }
}
