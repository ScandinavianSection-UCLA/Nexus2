// starter state if there is no previous data
import initialState from "./initialState";
// types of actions we can perform
import * as actions from "../actions/actionTypes";
// function to set session storage data
import {setSessionStorage} from "../data-stores/SessionStorageModel";

/**
 * Generic handler for manipulating the tabs and updating their state
 * @param {Object} state The pre-update state
 * @param {Object} action Action to do to the tabs (ADD_TAB, SWITCH_TABS, CLOSE_TAB)
 * @returns {Object} The updated state
 */
export default function tabViewer(state = initialState.tabState, action) {
    // depending on which action to perform
    switch (action.type) {
        // if we are to add a tab
        case actions.ADD_TAB:
            // console.log("ADD_TAB ACTION", state);
            return addTab(state, action.payload);
        // if we are to switch between tabs
        case actions.SWITCH_TABS:
            // console.log("SWITCH_TABS ACTION", state);
            return switchTab(state, action.payload);
        // if we are to close a tab
        case actions.CLOSE_TAB:
            // console.log("CLOSE_TAB ACTION", state);
            return closeTab(state, action.payload);
        // if we are to move around a tab
        case actions.MOVE_TAB:
            // console.log("MOVE_TAB ACTION", state);
            return moveTab(state, action.payload);
        // if we are to change a tab's color
        case actions.UPDATE_TAB:
            // console.log("UPDATE_TAB ACTION", state);
            return updateTab(state, action.payload);
        case actions.PIN_TAB:
            // console.log("PIN_TAB ACTION", state);
            return pinTab(state, action.payload);
        // unhandled action type
        default:
            // warn that we hit a bad action
            console.warn(`Invalid action: ${action.type}`);
            // don't change anything
            return state;
    }
}

/**
 * Switch to a new active tab
 * @param {Object} OldState The pre-switch state
 * @param {Number} SwitchToIndex The tab index to switch to
 * @returns {Object} The state with the new active tab
 */
function switchTab(OldState, SwitchToIndex) {
    // create an immutable separate copy of the old state
    let NewState = {...OldState};
    // assuming that the index is a valid tab
    if (SwitchToIndex < NewState.views.length) {
        // update the views with the new active tab
        NewState.views = NewState.views.map((currentView, currentIndex) => {
            return {
                // keep each view mostly the same
                ...currentView,
                // but set it to active if it is the index to switch to (inactive otherwise)
                "active": currentIndex === SwitchToIndex,
            };
        });
        // update session storage with the new active tab
        setSessionStorage("TabViewerSessionState", NewState);
    } else {
        // invalid index, raise a warning
        console.warn(`Invalid switch index ${SwitchToIndex}`);
    }
    // return the state with the new active tab, or the same state if the index was invalid
    return NewState;
}

/**
 * Remove a tab from the views by index
 * @param {Object} ShallowNewState The current, pre-removal state
 * @param {Number} RemoveIndex The index of the view to remove
 * @returns {Object} The state with the removed tab
 */
function closeTab(ShallowNewState, RemoveIndex) {
    // create a copy of the state to ensure immutability
    let NewState = {...ShallowNewState};
    // if the active view will be closed
    if (NewState.views[RemoveIndex].active === true) {
        // set the home view to be active
        NewState.views[0].active = true;
    }
    // remove the tab by the requested index
    NewState.views.splice(RemoveIndex, 1);
    // update session storage with our new state
    setSessionStorage("TabViewerSessionState", NewState);
    // return the updated state
    return NewState;
}

/**
 * Adds a tab to the views if needed
 * @param {Object} ShallowNewState The current state, before the tab is added
 * @param {Object} payload An action payload containing ID of the tab to add, display name of the tab, and the tab's type (People/Places/Fieldtrips/Book/Graph/Story)
 * @returns {Object} The new, updated state
 */
function addTab(ShallowNewState, {DisplayArtifactID, name, type}) {
    // get a copy of the state to ensure immutability
    let newState = {...ShallowNewState};
    // see if we can get the preexisting view matching the tab to create
    const matchingViewIndex = ShallowNewState.views.findIndex((view) => (
        // check if the name and type matches
        view.name === name && view.type === type && view.id === DisplayArtifactID
    ));
    if (matchingViewIndex !== -1) {
        // if we're trying to re-add an already existing view
        // just switch to that tab
        return switchTab(ShallowNewState, matchingViewIndex);
    } else {
        // we actually need to make a new tab and view
        // get a copy of the state (ensure immutability)
        // object representing the new view
        const newView = {
            // id is the passed ID
            "id": DisplayArtifactID,
            // set it to the active view
            "active": true,
            // name is the passed name
            "name": name,
            // type is the passed type
            "type": type,
            // color is the default active/inactive color
            "color": null,
            // pinned is whether or not its pinned to not be automatically deleted
            "pinned": false,
        };
        // for each of the preexisting views
        let updatedViews = newState.views.map((view) => {
            return {
                // leave the view mostly untouched...
                ...view,
                // ...but set it to be inactive
                "active": false,
            };
            // and add in the new view at the end
        }).concat(newView);
        // tracker if we need to remove a tab
        var RemoveTab = false;
        // if our window is smaller than 1100px (95% sure about the units)
        // and
        // if we have more than 5 tabs already (including home)
        if (window.innerWidth <= 1100 && updatedViews.length > 5) {
            RemoveTab = true;
        } else if (updatedViews.length > 6) {
            // if we have more than 6 tabs already (including home) and regardless of screen size
            RemoveTab = true;
        }
        // check if first non-home tab is not pinned
        // and
        // if we need to remove a tab
        if( RemoveTab){
            // index to remove
            let RemoveIndex = 1;
            // if the tab is pinned then remove the next tab
            if(updatedViews[RemoveIndex].pinned){
                RemoveIndex++;
            }
            // remove the first non-Home tab
            updatedViews.splice(RemoveIndex, 1);
        }
        // update the state's views
        newState.views = updatedViews;
        // update session storage with our new, updated state
        setSessionStorage("TabViewerSessionState", newState);
        // return our updated state
        return newState;
    }
}

/**
 * Move a tab to a new index
 * Note that you cannot move a tab to index 0 (Home is fixed to index 0)
 * @param {Object} OldState The pre-drag state of the tabs
 * @param {Object} indices Object containing the tab index to move (OldTabIndex) and where to move it to (NewTabIndex)
 * @returns {Object} The updated, tab-moved state
 */
function moveTab(OldState, {OldTabIndex, NewTabIndex}) {
    // make sure we are not affecting the home tab
    if (NewTabIndex !== 0 && OldTabIndex !== 0) {
        // get a copy of the views to ensure immutability
        let {views} = {...OldState};
        // get the view that we are to move
        const viewToMove = views[OldTabIndex];
        // delete the tab at its old index
        views.splice(OldTabIndex, 1);
        // re-add it at the desired index
        views.splice(NewTabIndex, 0, viewToMove);
        return {
            // leave the state mostly unmodified
            ...OldState,
            // but update the view with the move tab
            views,
        };
    } else {
        // can't move home tab!
        console.warn("Cannot move the home tab!");
        // don't change anything
        return OldState;
    }
}

/**
 * Update a tab's attributes
 * @param {Object} OldState The pre-update state
 * @param {Object} payload Contains TabIndex, to indicate the tab to change, and updates that indicate what properties to set to what
 * @returns {Object} The state with the updated tab
 */
function updateTab(OldState, {TabIndex, updates}) {
    // get a new copy of the state to keep immutability
    let newState = {...OldState};
    // get the view to update
    let view = newState.views[TabIndex];
    // update that view
    newState.views[TabIndex] = {
        // use the previous properties
        ...view,
        // but override any specified properties
        ...updates,
    };
    // return the state with the updated tab
    return newState;
}

/**
 * Pin a tab to not be removed
 * @param {Object} OldState with the pre-updated state
 * @param {Number} TabIndex to pin
 * */
function pinTab(OldState, TabIndex){
    // save old state to a new state to keep immutability
    let newState = {...OldState};
    // get the view to pin
    let view = newState.views[TabIndex];
    // toggle pinned state
    newState.views[TabIndex] = {
        ...view,
        pinned: !newState.views[TabIndex].pinned,
    };
    return newState;
}

