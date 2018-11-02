import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';

export default function configureStore(){
    return createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION_ && window.REDUX_DEVTOOLS_EXTENSION_(),
        applyMiddleware(thunk)
    );
}