// starter state if there is no previous data
import initialState from "./initialState";
// types of actions we can perform
import * as actions from "../actions/actionTypes";
import {getKeywords} from "../data-stores/DisplayArtifactModel";
import Fuse from "fuse.js";
import {arrayTransformation} from "../utils";

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
        case actions.SEARCH_ARTIFACT:
            return searchArtifact(state,action.payload);
        default:
            // warn that we hit a bad action
            console.warn(`Invalid action: ${action.type}`);
            // don't change anything
            return state;
    }
}

function handleFuzzySearch(ShallowPrevState, {SearchInput, DisplayList}){
    let NewState = {...ShallowPrevState};

    // Define SearchableData = Is there anything in DisplayList? If yes, search within DisplayList, If no, search within Keywords
    let SearchableData = DisplayList.length > 0 ? DisplayList : keywords;
    // Initialize new fuse object (fuzzy search dependency)
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
    // If SearchInput has something call fuzzy search
    if(SearchInput.length > 0){
        SearchResults = fuse.search(SearchInput);
    } else {
        // If SearchInput is empty (aka, user just clicked on search but hasn't entered anything), fill with 100 suggestions
        SearchResults = SearchableData.slice(0, 100);
    }
    // console.log(SearchResults, 'search results');

    NewState = {
        ...NewState,
        inputValue: SearchInput,
        results: SearchResults,
        searchingState: true,
    };

    return NewState;
}

//TODO: implement searchDisplayArtifact function by copying search component's handleSearch
function searchArtifact(ShallowPrevState, DisplayArtifact){
    let NewState = {...ShallowPrevState};

    let SearchList;
    let InputValue = null;
    // check if selectItem is just a keyword string
    if (typeof DisplayArtifact === "string") {
        // if it is, we need to get the keyword object from keywords
        keywords.forEach((keyword) => {
            if (keyword.keyword_name === DisplayArtifact) {
                DisplayArtifact = keyword;
                SearchList = [DisplayArtifact];
            }
        });
        // if it is still a string that means no keyword matches, and we need to tell Navigation
        if (typeof DisplayArtifact === "string") {
            // send list of suggestions to Navigation
            SearchList = NewState['results'];
            InputValue = JSON.parse(JSON.stringify(DisplayArtifact));
            // set first suggested item
            DisplayArtifact = SearchList[0];
        }
    } else {
        SearchList = [DisplayArtifact];
    }

    // check if DisplayArtifact is a story or keyword, place, or person
    let DisplayOntology = "";
    let SearchValue = "";

    if (typeof DisplayArtifact !== "undefined") {
        if ("story_id" in DisplayArtifact) {
            DisplayOntology = "Stories";
            SearchValue = 'search_string';
        } else if ("keyword_id" in DisplayArtifact) {
            let storiesList = [];
            if (typeof DisplayArtifact.stories.story !== "undefined") {
                storiesList = arrayTransformation(DisplayArtifact.stories.story);
            }
            this.props.handleDisplayItems(storiesList, "Stories");
            console.log('its a keyword!');
            this.setState({"searching": false, "searchTerm": DisplayArtifact.keyword_name});
            return;
        } else if ("person_id" in DisplayArtifact) {
            DisplayOntology = "People";
            SearchValue = 'full_name';
        } else if ("place_id" in DisplayArtifact) {
            DisplayOntology = "Places";
            SearchValue = 'name';
        } else if ("fieldtrip_name" in DisplayArtifact) {
            DisplayOntology = "Fieldtrips";
        }
        if(SearchList.length===1) { // else if there was a match found, change the search input to what was found
            InputValue = DisplayArtifact[SearchValue];
        }
        // initial input value based on the props (as if search is already complete)
        NewState = {
            searchingState:false, //stops searching
            ontology: DisplayOntology, // defines what ontology to use to display
            inputValue: InputValue, // updates search field with search result
            results: SearchList, // sets up list of results to display in navigator,
            keywordSearch: false,
        }
    } else {
        console.warn("DisplayArtifact is undefined");
    }

    return NewState;
}

//TODO: implement searchKeyword function...maybe if the searchDisplayArtifact function works out, I won't need to do this :D
function searchKeyword(ShallowPrevState, Keyword){
    let NewState = {...ShallowPrevState};
}