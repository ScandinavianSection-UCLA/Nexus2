// types of actions we can perform
import * as actions from "../actions/actionTypes";
// data helpers
import {
    DisplayArtifactToOntology,
    dateFilterHelper,
    ontologyToID, getPlacesByID,
} from "../data-stores/DisplayArtifactModel";
// starter state if there is no previous data
import initialState from "./initialState";

/**
 * Generic handler for navigator
 * @param {Object} state The pre-update state
 * @param {Object} action Action to do to the tabs
 * @returns {Object} The updated state
 */
export default function navigator(state = initialState.navigator, {payload, type}) {
    // depending on which action to perform
    switch (type) {
        // if we are to add a tab
        case actions.UPDATE_ITEMS:
            return updateItems(state);
        // if we are to add a tab
        case actions.DISPLAY_ITEMS:
            return displayItems(state, payload);
        // if we are to add a tab
        case actions.TIME_FILTER_HANDLER:
            return timeFilterHandler(state, payload);
        // unhandled action type
        default:
            // warn that we hit a bad action
            console.warn(`Invalid action: ${type}`);
            // don't change anything
            return state;
    }
}

/**
 * Update the items displayed in Navigator
 * @param {Object} prevState Pre-update state
 * @returns {Object} State with an updated displayList
 */
function updateItems(prevState) {
    // get the currently displayed ontology, and potential items to display
    const {fromDate, itemsList, timeFilterOn, toDate} = prevState;
    if (itemsList.length > 0) {
        const displayOntology = DisplayArtifactToOntology(itemsList[0]);
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
    } else {
        return {
            ...prevState,
            "displayList": [],
        };
    }
}

/**
 * Set new display items
 * @param {Object} prevState Previous state to change
 * @param {Object} list Items to display
 * @returns {Object} The state with new items
 */
function displayItems(prevState, list) {
    // set placeList - if people, then pull places associated with people, etc.
    let PlaceList = ["hi"],
        InitialItem = list[0];
    if (typeof InitialItem !== "undefined") {
        // if item is a person
        if ("residence_place" in InitialItem) {
            PlaceList = list.filter((person) => person.residence_place !== null)
                .map((person) => ({
                    ...person.residence_place,
                    "full_name": person.full_name,
                }));
        } else if ("latitude" in InitialItem) { // if item is a place
            PlaceList = list;
        } else {
            PlaceList = list.filter((story) => typeof story.place_recorded !== "undefined")
                .map((story) => ({
                    ...getPlacesByID(story.place_recorded.id),
                    "full_name": story.full_name,
                }));
        }
    }
    // set up the items based on
    const newState = {
        ...prevState,
        "displayList": list,
        "itemsList": list,
        "placeList": PlaceList,
    };
    if (newState.timeFilterOn === true) {
        // if the time filter is on, we need
        return updateItems(newState);
    }
    return newState;
}

/**
 * Handler for when a timeline filter is changed
 * @param {Object} prevState Pre-event state
 * @param {Object} target Describes the action that occured
 * @returns {Object} The new, post-event state
 */
function timeFilterHandler(prevState, {checked, name, value}) {
    console.log('time filter on!');
    switch (name) {
        case "fromYear": {
            const newState = {
                ...prevState,
                "fromDate": value,
            };
            // check if the dates are valid dates (4 digits, between 1887 and 1899)
            if (newState.fromDate >= 1887) {
                return updateItems(newState);
            } else {
                return newState;
            }
        }
        case "toYear": {
            const newState = {
                ...prevState,
                "toDate": value,
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
                "timeFilterOn": checked,
            });
        default:
            console.warn(`Invalid filter: ${name}`);
            return prevState;
    }
}
