import * as types from "./actionTypes";

/**
 * Add a tab to the view
 * @param {Number} DisplayArtifactID ID referring to the item to display
 * @param {String} name Display name of the tab
 * @param {String} type Type of the display
 */
export function addTab(DisplayArtifactID, name, type) {
    return {
        "type": types.ADD_TAB,
        "payload": {DisplayArtifactID, name, type},
    };
}

/**
 * Close a tab
 * @param {Number} TabKey Index of the tab to close
 */
export function closeTab(TabKey) {
    return {
        "type": types.CLOSE_TAB,
        "payload": TabKey,
    };
}

/**
 * Switch to the specified tab
 * @param {Number} TabKey Index of the tab to switch to
 */
export function switchTabs(TabKey) {
    return {
        "type": types.SWITCH_TABS,
        "payload": TabKey,
    };
}

/**
 * Move a tab to a new index
 * @param {Number} OldTabIndex The tab to move
 * @param {Number} NewTabIndex The spot to move the tab to
 */
export function moveTab(OldTabIndex, NewTabIndex) {
    return {
        "type": types.MOVE_TAB,
        "payload": {OldTabIndex, NewTabIndex},
    };
}

/**
 * Change a tab's color
 * @param {Number} TabIndex The tab to colorize
 * @param {*} Color The new color of the tab - `null` resets it to the active/inactive color
 */
export function changeTabColor(TabIndex, Color) {
    return {
        "type": types.CHANGE_TAB_COLOR,
        "payload": {TabIndex, Color},
    };
}
