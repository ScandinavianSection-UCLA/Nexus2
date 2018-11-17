// function to get tab state from storage
import {getSessionStorage} from "../data-stores/SessionStorageModel";

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

// export the initialized state
export default {
    "tabState": InitializeTabs(),
};
