import React, {Component} from 'react';
import {getKeywords} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation} from "../../utils"
import Fuse from 'fuse.js';
import './search.css';
import PropTypes from "prop-types";

class SearchComponent extends Component {
    constructor () {
        super();
        this.state = {
            keywords: [],
            results: [],
            refinedResults: [],
            searching: false,
            suggestionJSX: '',
            keywordSearch: false,
            refinedResultsState: false,
            inputValue: '',
        };
    }

    componentWillMount() {
        this.setState({
            keywords: getKeywords(this.props.displayList),
            results: getKeywords(this.props.displayList)
        });

    }

    handleSearch(selectedItem) {
        let SearchList, NewState;
        NewState = {searching: false, }
        // check if selectItem is just a keyword string
        if (typeof selectedItem === 'string') {
            // if it is, we need to get the keyword object from keywords
            this.state.keywords.forEach((keyword) => {
                if (keyword['keyword_name'] === selectedItem) {
                    selectedItem = keyword;
                    SearchList = [selectedItem];
                }
            });
            //if it is still a string that means no keyword matches, and we need to tell Navigation
            if (typeof selectedItem === 'string') {
                let QueriedList = this.state.refinedResultsState ? 'refinedResults' : 'results';
                //send list of suggestions to Navigation
                console.log(this.state[QueriedList], 'Queried list!!!');
                SearchList = this.state[QueriedList];
                NewState['inputValue'] = selectedItem;
                selectedItem = this.state[QueriedList][0]; //set first suggested item
            }
        } else {
            SearchList = [selectedItem];
        }

        // check if selectedItem is a story or keyword, place, or person
        let DisplayOntology = '';
        let SearchValueKey = '';

        if (typeof selectedItem !== "undefined") {
            if ('story_id' in selectedItem) {
                DisplayOntology = 'Stories';
                SearchValueKey = 'full_name';
            } else if ('keyword_id' in selectedItem) {
                let storiesList = [];
                // let placesList = [];
                if (typeof selectedItem['stories']['story'] !== 'undefined') {
                    storiesList = arrayTransformation(selectedItem['stories']['story']);
                }

                this.props.handleDisplayItems(storiesList, 'Stories');
                this.setState({searching: false, searchTerm: selectedItem['keyword_name']});
                return;
            } else if ('person_id' in selectedItem) {
                DisplayOntology = 'People';
                SearchValueKey = 'full_name';
            } else if ('place_id' in selectedItem) {
                DisplayOntology = 'Places';
                SearchValueKey = 'name';
            } else if ('fieldtrip_name' in selectedItem) {
                DisplayOntology = 'Fieldtrips';
                SearchValueKey = 'fieldtrip_name';
            }

            if (NewState['searching']) {
                NewState = {searching: false, inputValue: selectedItem[SearchValueKey]};
            }
            this.props.searchOn(false);
            this.props.handleDisplayItems(SearchList, DisplayOntology); //only display the results from the search
            this.setState(NewState);
        } else {
            console.log("selectedItem is undefined");
        }
    }

    handleFuzzySearch(event) {
        this.props.searchOn(true);
        this.renderSuggestions();
        this.setState({
            searching: true,
            inputValue: event.target.value,
        }, () => {
            var data;
            if (this.props.displayList.length > 0) {
                data = this.props.displayList;
            } else {
                data = getKeywords();
            }

            const fuse = new Fuse(data, {
                shouldSort: true,
                threshold: .2,
                location: 0,
                distance: 10000,
                maxPatternLength: 64,
                minMatchCharLength: 1,
                keys: [
                    "search_string",
                    "keyword_name",
                    "name",
                    "full_name",
                ]
            });

            var input = this.state.inputValue;

            //if there's nothing in the input, render all possible results
            if (input === '') {
                this.setState({
                    results: data.slice(0, 100),
                    inputValue: input,
                });
            } else { //if there is something in input, call fuzzy search
                const results = fuse.search(input); //results from fuzzy search from Keywords.json
                let ResultList = '';
                let RefinedResultState = true;
                if (this.props.displayList.length > 0) {
                    ResultList = 'refinedResults';
                    RefinedResultState = true;
                } else {
                    ResultList = 'results';
                    RefinedResultState = false;
                }
                let NewState = {
                    inputValue: input,
                    refinedResultState: RefinedResultState,
                };
                NewState[ResultList] = results;
                this.setState(NewState);
            }
        });
    }

    renderKeywords() {
        if (typeof this.state.keywords !== 'undefined') {
            return this.state.keywords;
        }
    }

    renderListofSuggestions() {
        var QueriedList = this.state.refinedResultsState ? 'refinedResults' : 'results';
        return this.state[QueriedList].map((keyword, i) => {
            var displayKey = '';
            if ('keyword_name' in keyword) {
                displayKey = 'keyword_name';
            } else if ('search_string' in keyword) {
                displayKey = 'search_string';
            } else if ('full_name' in keyword) {
                displayKey = 'full_name';
            } else if ('name' in keyword) {
                displayKey = 'name';
            } else if ('fieldtrip_name' in keyword) {
                displayKey = 'fieldtrip_name'
            }
            return <li key={i} style={{cursor: 'pointer'}}
                onClick={(e) => {e.preventDefault(); this.handleSearch.bind(this)(keyword)}}>{keyword[displayKey]}</li>
        });
    }

    renderSuggestions() {
        // this.refs.SuggestionList.classList.add('active');
        let RefinedResultsState = false;
        if (this.props.displayList.length > 0) {
            RefinedResultsState = true;
        }
        //setState to save anything from this.props.displayList to this.state.refinedResults
        this.setState({
            refinedResults: this.props.displayList,
            refinedResultsState: RefinedResultsState,
            searching: true,
        }, () => {
            return this.renderListofSuggestions();
        });
    }

    switchKeywordSearch(e) {
        this.props.handleDisplayItems([], 'Stories');
        this.setState({
            keywordSearch: e.target.checked,
            inputValue: ''
        });
    }

    render() {
        return (
            <div className="SearchComponent">
                <div className="grid-x">
                    <form className="cell"
                        onSubmit={(e) => {e.preventDefault(); this.handleSearch.bind(this)(this.refs.searchString.defaultValue)}}
                    >
                        <input type="text" ref="searchString" placeholder="Search Term"
                            value={this.state.inputValue}
                            onChange={this.handleFuzzySearch.bind(this)}
                        />
                        <label htmlFor="keyword-search-switch">Keyword Search Only</label>
                        <input type="checkbox" name="keyword"
                            id="keyword-search-switch"
                            ref="keywordSwitch"
                            onChange={(e) => {this.switchKeywordSearch.bind(this)(e);}}>
                        </input>
                        <ul
                            className={`suggestions ${this.state.searching ? 'active' : ''}`}
                        >
                            {this.renderListofSuggestions.bind(this)()}
                        </ul>
                    </form>
                    <div className="cell filters">

                    </div>
                </div>

            </div>
        );
    }
}

// check if displayList is properly formatted and assigned
SearchComponent.propTypes = {
    "displayList": PropTypes.array.isRequired,
}

// assign default if not already defined
SearchComponent.defaultProps = {
    "displayList": [],
}

export default SearchComponent;
