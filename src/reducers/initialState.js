// function to get tab state from storage
import {getSessionStorage} from "../data-stores/SessionStorageModel";

// export the initialized state
export default {
    "tabState": InitializeTabs(),
    "search": InitializeSearch(),
    "navigator": InitializeNavigator(),
};

/**
 * Initialize the tabs, whether from a clean state or session storage
 * @returns {Object} The state of the tabs
 */
function InitializeTabs() {
    // get tab state from storage
    const CachedState = getSessionStorage("TabViewerSessionState");
    // if we have previously loaded tabs
    if (CachedState) {
        // start up with those previous tabs
        return {
            "views": CachedState.views,
        };
    } else {
        // otherwise, just start out with a single home tab
        return {
            "views": [{
                "active": true,
                "id": 0,
                "name": "Home",
                "type": "Home",
                "color": null,
            }],
        };
    }
}

/**
 * Initialize the search state
 * @returns {Object} The initial search state
 */
function InitializeSearch() {
    return {
        // initial input value based on the props (as if search is already complete)
        "inputValue": "",
        // no search yet, can't be a keyword search
        "keywordSearch": false,
        // we aren't searching on first load
        "searchingState": false,
        // results to display as suggestions or displayList in Navigator
        "results": [],
        // ontology that's being displayed
        "ontology": "",
    };
}

/**
 * TODO: implement this
 */
function InitializeNavigator() {

}
