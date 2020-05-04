import {combineReducers} from "redux";
import navigator from "./navigatorReducer";
import search from "./searchReducer";
import tabViewer from "./tabViewerReducer";

const rootReducer = combineReducers({
    navigator,
    search,
    tabViewer,
});

export default rootReducer;
