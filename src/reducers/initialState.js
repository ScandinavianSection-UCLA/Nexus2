import * as TabViewer from "../components/TabViewer/TabViewer";
import {getSessionStorage} from "../data-stores/SessionStorageModel";

const NavigationObject = {
    "active": true,
    "id": 0,
    "name": "Home",
    "type": "Home",
};

export default {
    tabState:InitializeTabs(),
};


function InitializeTabs(){
    const CachedState = getSessionStorage("TabViewerSessionState");
    var NewState = {};
    console.log(TabViewer, 'tab viewer');
    if(CachedState){
        const cachedViews = CachedState["views"];
        NewState = {
            views: cachedViews
        }

        // NewState['views']['jsx'] = TabViewer.
    } else {
        NewState = {
            views:[NavigationObject]
        }
    }
    return NewState;
}