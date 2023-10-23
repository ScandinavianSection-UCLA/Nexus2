// types of actions we can perform
import * as actions from "../actions/actionTypes";
// fuzzy searcher
import Fuse from "fuse.js";
// array-ifier
import {arrayTransformation} from "../utils";
// function to get keywords
import {getKeywords} from "../data-stores/DisplayArtifactModel";
// starter state if there is no previous data
import initialState from "./initialState";

const keywords = getKeywords();

/**
 * Generic handler for searching keywords or display artifacts
 * @param {Object} state The pre-update state
 * @param {Object} action to do to the tabs (FUZZY_SEARCH, SEARCH_KEYWORD, SEARCH_DISPLAYARTIFACT)
 * @returns {Object} The updated state
 */
export default function search(state = initialState.search, action) {
    // depending on which action to perform
    switch (action.type) {
        case actions.FUZZY_SEARCH:
            return handleFuzzySearch(state, action.payload);
        case actions.SEARCH_KEYWORD:
            return searchKeyword(state, action.payload);
        case actions.SEARCH_ARTIFACT: {
            // get the state by performing the search
            const newState = searchArtifact(state, action.payload);
            // dispatch the action to update navigator's items with these results
            action.asyncDispatch({
                "type": actions.DISPLAY_ITEMS,
                "payload": newState.results,
            });
            // return the post-search state
            return newState;
        }
        case actions.SET_SEARCH_STATE:
            return setSearchState(state, action.payload);
        default:
            // warn that we hit a bad action
            console.warn(`Invalid action: ${action.type}`);
            // don't change anything
            return state;
    }
}

/**
 * Set the state of searching
 * @param {Object} ShallowPrevState The pre-update search state
 * @param {Boolean} newState Whether or not to be in a state of searching
 * @returns {Object} The updated search state
 */
function setSearchState(ShallowPrevState, newState) {
    return {
        ...ShallowPrevState,
        "searchingState": newState,
    };
}

/**
 *
 * @param {*} ShallowPrevState
 * @param {*} param1
 */
function handleFuzzySearch(ShallowPrevState, {SearchInput}) {
    let NewState = {...ShallowPrevState};
    let suggestions = NewState.suggestions;
    // define SearchableData = Is there anything in DisplayList? If yes, search within DisplayList, If no, search within Keywords
    let SearchableData = suggestions.length > 0 ? suggestions : keywords;
    // initialize new fuse object (fuzzy search dependency)
    const fuse = new Fuse(SearchableData, {
        "shouldSort": true,
        "threshold": .2,
        "location": 0,
        "distance": 10000,
        "maxPatternLength": 64,
        "minMatchCharLength": 1,
        "keys": [
            "search_string",
            "keyword_name",
            "name",
            "full_name",
        ],
    });
    let SearchResults;
    // if SearchInput has something call fuzzy search
    if (SearchInput.length > 0) {
        SearchResults = fuse.search(SearchInput);
    } else {
        // if SearchInput is empty (aka, user just clicked on search but hasn't entered anything), fill with 100 suggestions
        SearchResults = SearchableData.slice(0, 100);
    }
    // console.log(SearchResults, 'search results');

    NewState = {
        ...NewState,
        "inputValue": SearchInput,
        "results": SearchResults,
        "searchingState": true,
    };

    return NewState;
}

// TODO: implement searchDisplayArtifact function by copying search component's handleSearch
/**
 * Search for an artifact, and update the search state accordingly
 * @param {Object} ShallowPrevState Pre-search state
 * @param {*} DisplayArtifact Artifact to search for, or a keyword string
 * @returns {Object} Post-search state
 */
function searchArtifact(ShallowPrevState, DisplayArtifact) {
    let artifact = DisplayArtifact,
        // what to display as the search
        InputValue = "",
        // create an immutable copy of the previous state
        NewState = {...ShallowPrevState},
        // list of results of search
        SearchList = [],
        // list of search suggestions
        SuggestionList = [];
    // check if the artifact is just a keyword string
    if (typeof DisplayArtifact === "string") {
        // if it is, we need to get the keyword object from keywords
        const match = keywords.find((keyword) => keyword.keyword_name === artifact);
        // if we found a mtach
        if (typeof match !== "undefined") {
            // set artifact to that match
            artifact = match;
        } else {
            // if there is no a keyword match, just pull the first thing from results
            SearchList = NewState.results;
            InputValue = artifact;
            // set first suggested item
            artifact = SearchList[0];
        }
    } else {
        SearchList = [artifact];
        SuggestionList = NewState.results;
    }
    // check if DisplayArtifact is a story, keyword, place, or person
    if (typeof artifact !== "undefined") {
        // for keywords
        if ("keyword_id" in artifact) {
            // results are all associated stories
            SearchList = arrayTransformation(artifact.stories.story);
            // input value is the keyword's name
            InputValue = artifact.keyword_name;
        } else if ("story_id" in artifact) {
            // for stories, input value is its search string
            InputValue = artifact.search_string;
        } else if ("person_id" in artifact) {
            // for people, input value is their whole name
            InputValue = artifact.full_name;
        } else if ("place_id" in artifact) {
            // for places, input value is their name
            InputValue = artifact.name;
        }

        NewState = {
            "searchingState": false, // stops searching
            "inputValue": InputValue, // updates search field with search result
            "results": SearchList, // sets up list of results to display in navigator,
            "suggestions": SuggestionList,
            "keywordSearch": false,
        };
    } else {
        console.warn("DisplayArtifact is undefined");
    }
    return NewState;
}

// TODO: implement searchKeyword function...maybe if the searchDisplayArtifact function works out, I won't need to do this :D
function searchKeyword(ShallowPrevState, Keyword) {
    let NewState = {...ShallowPrevState};
}
