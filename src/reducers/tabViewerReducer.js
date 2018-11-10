import initialState from './initialState';
import {ADD_TAB, CLOSE_TAB, SWITCH_TABS} from "../actions/actionTypes";
import React from "react";
import {setSessionStorage} from "../data-stores/SessionStorageModel";

const NavigationObject = {
    "active": true,
    "id": 0,
    "name": "Home",
    "type": "Home",
};

export default function tabViewer(state=initialState.tabState, action){
    let newState = state;
    switch(action.type){
        case ADD_TAB:
            newState = state;
            console.log('ADD_TAB ACTION', newState);
            var DisplayArtifactID = action.payload['DisplayArtifactID'];
            var name = action.payload['name'];
            var type = action.payload['type'];
            return addTab(newState, DisplayArtifactID, name, type);
        case SWITCH_TABS:
            console.log('SWITCH_TABS ACTION', newState);
            return switchTab(newState, action.payload);
        case CLOSE_TAB:
            console.log('CLOSE_TAB ACTION', newState);
            return closeTab(newState, action.payload);
        default:
            return state;
    }
}

function addTab(ShallowNewState, inputID, name, type) {
    var NewState = JSON.parse(JSON.stringify(ShallowNewState));

    // see if we can get the preexisting view matching the tab to create
    const matchingView = NewState.views.find((view) => (view["id"] === inputID && view["type"] === type));

    // if we're trying to re-add an already existing view
    if (typeof matchingView !== "undefined") {
        // just set that view to the active
        NewState.views.map((view)=>{
           if(view === matchingView){
               view.active = true;
           } else {
               view.active = false;
           }
           return view;
        });
        return NewState;
    } else {
        // we actually need to make a new tab and view

        // object representing the new view
        const newView = {
            // id is the passed ID
            "id": inputID,
            // set it to the active view
            "active": true,
            // name is the passed name
            "name": name,
            // type is the passed type
            "type": type,
        };

        // for each of the preexisting views
        let updatedViews = NewState.views.map((view) => {
            return {
                // leave the view mostly untouched...
                ...view,
                // ...but set it to be inactive
                "active": false,
            };
        });

        // add in the new, active view
        updatedViews.push(newView);

        // if our window is smaller than 1100px (95% sure about the units)
        if (window.innerWidth <= 1100) {
            console.log("Window is small!");
            // if we have more than 5 tabs already (including home)
            if (updatedViews.length > 5) {
                // remove the first non-Home tab
                updatedViews.splice(1, 1);
            }
        } else if (updatedViews.length > 6) {
            // if we have more than 6 tabs already (including home)
            // remove the first non-Home tab
            updatedViews.splice(1, 1);
        }

        NewState['views'] = updatedViews;

        // update session storage with our new, updated state
        setSessionStorage("TabViewerSessionState", NewState);

        return NewState;
    }
}

function switchTab(OldState, SwitchToIndex) {

    var newViews = OldState.views;
    if(SwitchToIndex < newViews.length ){
        newViews.map((currentView, currentIndex)=>{
            if(currentIndex !== SwitchToIndex){
                currentView['active'] = false;
                return currentView;
            } else {
                currentView['active'] = true;
                return currentView;
            }
        });
        OldState.views = newViews;
    }
    //SUPER IMPORTANT!!! NEED TO CREATE DEEP COPY TO ENSURE IMMUTIBILITY
    var NewState = JSON.parse(JSON.stringify(OldState));
    console.log('switching tabs!', NewState);
    setSessionStorage("TabViewerSessionState", NewState);
    return NewState;
}

function closeTab(ShallowNewState, RemoveIndex) {
    var NewState = JSON.parse(JSON.stringify(ShallowNewState));
    // is current view being closed?
    var PreviousViewIndex =  false;
    NewState.views.forEach((view,i)=>{
        console.log(view.active, i, RemoveIndex);
        if(view.active && i === RemoveIndex){
            PreviousViewIndex = true;
        }
    });

    // find "view" in this.state.views and .active, and delete it. if .active then default to home tab
    NewState.views.splice(RemoveIndex, 1);
    if(PreviousViewIndex){
        NewState.views[0] = NavigationObject
    }
    console.log(NewState.views);
    setSessionStorage("TabViewerSessionState", NewState);

    return NewState;
}