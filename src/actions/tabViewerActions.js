import * as types from "./actionTypes";

/**
 * triggers reducer for adding a tab
 * @param {integer} DisplayArtifactID
 * @param {string} name
 * @param {string} type
 * */
export function addTab(DisplayArtifactID, name, type) {
    const TabPayload = {DisplayArtifactID, name, type};
    return {"type": types.ADD_TAB, "payload": TabPayload};
}

/**
 * triggers reducer for closing a tab
 * @param {integer} TabKey to delete
 * */
export function closeTab(TabKey) {
    return {"type": types.CLOSE_TAB, "payload": TabKey};
}

/**
 * triggers reducer for switch a tab
 * @param {integer} TabKey to switch to
 * */
export function switchTabs(TabKey) {
    return {"type": types.SWITCH_TABS, "payload": TabKey};
}

/**
 * triggers reducer for moving a tab
 * @param {Number} OldTabIndex The tab to move
 * @param {Number} NewTabIndex The spot to move the tab to
 */
export function moveTab(OldTabIndex, NewTabIndex) {
    const TabPayload = {OldTabIndex, NewTabIndex};
    return {"type": types.MOVE_TAB, "payload": TabPayload};
}
