import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Black magic, see https://stackoverflow.com/a/41260990
const asyncDispatchMiddleware = store => next => action => {
    let syncActivityFinished = false;
    let actionQueue = [];

    function flushQueue() {
        actionQueue.forEach(a => store.dispatch(a)); // flush queue
        actionQueue = [];
    }

    function asyncDispatch(asyncAction) {
        actionQueue = actionQueue.concat([asyncAction]);
        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch = Object.assign({}, action, {asyncDispatch});

    next(actionWithAsyncDispatch);
    syncActivityFinished = true;
    flushQueue();
};

/**
 * Redux black magic
 */
export default function configureStore() {
    return createStore(
        rootReducer,
        composeEnhancer(applyMiddleware(thunk, asyncDispatchMiddleware)),
    );
}
