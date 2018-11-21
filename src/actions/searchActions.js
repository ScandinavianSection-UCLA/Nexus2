import * as types from "./actionTypes";

/**
 * Trigger fuzzy search to render suggestions and update search input field. If there's currently results in the area, search among results there
 * @param {String} SearchInput
 * @param {array} DisplayList
 * */
export function fuzzySearch(SearchInput, DisplayList) {
    return {
        "type": types.FUZZY_SEARCH,
        "payload": {SearchInput, DisplayList},
    };
}

/**
 * Trigger search for a display artifact (people, places, stories, fieldtrips)
 * @param {integer} DisplayArtifact
 * */
export function searchArtifact(DisplayArtifact) {
    return {
        "type": types.SEARCH_ARTIFACT,
        "payload": DisplayArtifact,
    };
}

/**
 * Trigger search for keyword either as a string or as an object
 * @param {String, Object} Keyword
 * */
export function searchKeyword(Keyword) {
    return {
        "type": types.SEARCH_KEYWORD,
        "payload": Keyword,
    };
}
