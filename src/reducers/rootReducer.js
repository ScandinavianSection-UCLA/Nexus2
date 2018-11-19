import {combineReducers} from 'redux';
import tabViewer from './tabViewerReducer';
import search from './searchReducer';

const rootReducer = combineReducers({
    tabViewer,
    search,
});

export default rootReducer;