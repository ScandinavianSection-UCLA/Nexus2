import React, {Component} from "react";
import {getKeywords, DisplayArtifactToDisplayKey} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation} from "../../utils";
import Fuse from "fuse.js";
import "./search.css";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as searchActions from "../../actions/searchActions";
import connect from "react-redux/es/connect/connect";

class SearchComponent extends Component {
    constructor(props) {
        super(props);
        // set the initial state based on the props given
        this.state = {
            // initial input value based on the props (as if search is already complete)
            "inputValue": props.searchWord,
            // get all keywords
            "keywords": getKeywords(),
            // no search yet, can't be a keyword search
            "keywordSearch": false,
            // can't start with refined results
            "refinedResults": [],
            // no refined results = not in that state
            "refinedResultsState": false,
            // results start out as all possible keywords
            "results": getKeywords(),
            // we aren't searching on first load
            "searching": false,
            // don't render suggestions yet
            "suggestionJSX": "",
        };
    }

    componentDidMount() {
        // if we have a keyword to search for already
        if (this.props.searchWord !== "") {
            // do the search
            this.handleSearch(this.props.searchWord);
        }
    }

    handleSearch(selectedItem) {
        let SearchList;
        let inputValue = null;
        // check if selectItem is just a keyword string
        if (typeof selectedItem === "string") {
            // if it is, we need to get the keyword object from keywords
            this.state.keywords.forEach((keyword) => {
                if (keyword.keyword_name === selectedItem) {
                    selectedItem = keyword;
                    SearchList = [selectedItem];
                }
            });
            // if it is still a string that means no keyword matches, and we need to tell Navigation
            if (typeof selectedItem === "string") {
                let QueriedList = this.state.refinedResultsState ? "refinedResults" : "results";
                // send list of suggestions to Navigation
                SearchList = this.state[QueriedList];
                inputValue = selectedItem;
                // set first suggested item
                selectedItem = this.state[QueriedList][0];
            }
        } else {
            SearchList = [selectedItem];
        }

        // check if selectedItem is a story or keyword, place, or person
        let DisplayOntology = "";

        if (typeof selectedItem !== "undefined") {
            if ("story_id" in selectedItem) {
                DisplayOntology = "Stories";
            } else if ("keyword_id" in selectedItem) {
                let storiesList = [];
                if (typeof selectedItem.stories.story !== "undefined") {
                    storiesList = arrayTransformation(selectedItem.stories.story);
                }
                this.props.handleDisplayItems(storiesList, "Stories");
                this.setState({"searching": false, "searchTerm": selectedItem.keyword_name});
                return;
            } else if ("person_id" in selectedItem) {
                DisplayOntology = "People";
            } else if ("place_id" in selectedItem) {
                DisplayOntology = "Places";
            } else if ("fieldtrip_name" in selectedItem) {
                DisplayOntology = "Fieldtrips";
            }
            // end the search
            this.props.searchActions.setSearch(false);
            // this.props.searchOn(false);
            // only display the results from the search
            this.props.handleDisplayItems(SearchList, DisplayOntology);
            // update the state with the new input value, and stop searching
            this.setState({
                inputValue,
                "searching": false,
            });
        } else {
            console.warn("selectedItem is undefined");
        }
    }

    handleFuzzySearch(event) {
        this.props.searchActions.setSearch(true);
        this.props.searchOn(true);
        this.renderSuggestions();
        this.setState({
            "searching": true,
            "inputValue": event.target.value,
        }, () => {
            const data = this.props.displayList.length > 0 ? this.props.displayList : getKeywords();
            const fuse = new Fuse(data, {
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

            const input = this.state.inputValue;
            // if there's nothing in the input, render first 100 possible results
            if (input === "") {
                this.setState({
                    // 100 possibilites
                    "results": data.slice(0, 100),
                    "inputValue": input,
                });
            } else {
                // if there is something in input, call fuzzy search
                // results from fuzzy search from Keywords.json
                const results = fuse.search(input);
                const RefinedResultState = this.props.displayList.length > 0;
                const ResultList = RefinedResultState ? "refinedResults" : "results";
                let NewState = {
                    "inputValue": input,
                    "refinedResultState": RefinedResultState,
                };
                NewState[ResultList] = results;
                this.setState(NewState);
            }
        });
    }

    // migrated!
    renderListofSuggestions() {
        return this.props.state.results.map((keyword, i) => (
            <li
                key={i}
                style={{"cursor": "pointer"}}
                onClick={(event) => {
                    event.preventDefault();
                    this.handleSearch.bind(this)(keyword);
                }}>
                {keyword[DisplayArtifactToDisplayKey(keyword)]}
            </li>
        ));
    }

    renderSuggestions() {
        console.log("search state", this.props);
        // setState to save anything from this.props.displayList to this.state.refinedResults
        this.setState({
            "refinedResults": this.props.displayList,
            "refinedResultsState": this.props.displayList.length > 0,
            "searching": true,
        }, () => {
            return this.renderListofSuggestions();
        });
    }

    switchKeywordSearch(event) {
        this.props.handleDisplayItems([], "Stories");
        this.setState({
            "keywordSearch": event.target.checked,
            "inputValue": "",
        });
    }

    render() {
        return (
            <form
                className="SearchComponent"
                onSubmit={(e) => {
                    e.preventDefault();
                    this.handleSearch(this.props.state.inputValue);
                }}>
                <input
                    type="text"
                    placeholder="Search Term"
                    value={this.props.state.inputValue}
                    onChange={(event) => {
                        event.preventDefault();
                        this.props.searchActions.fuzzySearch(event.target.value, this.props.displayList);
                    }} />
                <label htmlFor="keyword-search-switch">Keyword Search Only</label>
                <input
                    type="checkbox"
                    name="keyword"
                    id="keyword-search-switch"
                    onChange={this.switchKeywordSearch.bind(this)} />
                {/* only show suggestions while a search is active */}
                {this.props.state.searchingState &&
                    <ul className="suggestions">
                        {this.renderListofSuggestions.bind(this)()}
                    </ul>}
            </form>
        );
    }
}

// check if displayList is properly formatted and assigned
SearchComponent.propTypes = {
    "displayList": PropTypes.array.isRequired,
    "handleDisplayItems": PropTypes.func.isRequired,
    "searchWord": PropTypes.string.isRequired,
    // must have tabViewerActions to open up a new book tab
    "searchActions": PropTypes.object.isRequired,
};

// assign default if not already defined
SearchComponent.defaultProps = {
    "displayList": [],
};

function mapStateToProps(state) {
    return {
        "state": state.search,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "searchActions": bindActionCreators(searchActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchComponent);
