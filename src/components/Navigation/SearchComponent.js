import React, {Component} from "react";
import {DisplayArtifactToDisplayKey, getKeywords} from "../../data-stores/DisplayArtifactModel";
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
        // if we have a keyword to search for already
        if (props.searchWord !== "") {
            // do the search
            this.handleSearch(this.props.searchWord);
        }
        this.myRef = React.createRef();
    }

    // handleSearch(selectedItem) {
    //     let SearchList;
    //     let inputValue = null;
    //     // check if selectItem is just a keyword string
    //     if (typeof selectedItem === "string") {
    //         // if it is, we need to get the keyword object from keywords
    //         this.state.keywords.forEach((keyword) => {
    //             if (keyword.keyword_name === selectedItem) {
    //                 selectedItem = keyword;
    //                 SearchList = [selectedItem];
    //             }
    //         });
    //         // if it is still a string that means no keyword matches, and we need to tell Navigation
    //         if (typeof selectedItem === "string") {
    //             let QueriedList = this.state.refinedResultsState ? "refinedResults" : "results";
    //             // send list of suggestions to Navigation
    //             SearchList = this.state[QueriedList];
    //             inputValue = selectedItem;
    //             // set first suggested item
    //             selectedItem = this.state[QueriedList][0];
    //         }
    //     } else {
    //         SearchList = [selectedItem];
    //     }
    //
    //     // check if selectedItem is a story or keyword, place, or person
    //     let DisplayOntology = "";
    //     let SearchValue = "";
    //
    //     if (typeof selectedItem !== "undefined") {
    //         if ("story_id" in selectedItem) {
    //             DisplayOntology = "Stories";
    //             SearchValue = 'search_string';
    //         } else if ("keyword_id" in selectedItem) {
    //             let storiesList = [];
    //             if (typeof selectedItem.stories.story !== "undefined") {
    //                 storiesList = arrayTransformation(selectedItem.stories.story);
    //             }
    //             this.props.handleDisplayItems(storiesList, "Stories");
    //             console.log('its a keyword!');
    //             this.setState({"searching": false, "searchTerm": selectedItem.keyword_name});
    //             return;
    //         } else if ("person_id" in selectedItem) {
    //             DisplayOntology = "People";
    //             SearchValue = 'full_name';
    //         } else if ("place_id" in selectedItem) {
    //             DisplayOntology = "Places";
    //             SearchValue = 'name';
    //         } else if ("fieldtrip_name" in selectedItem) {
    //             DisplayOntology = "Fieldtrips";
    //         }
    //         // end the search
    //         this.props.searchOn(false);
    //         // only display the results from the search
    //         this.props.handleDisplayItems(SearchList, DisplayOntology);
    //         // update the state with the new input value, and stop searching
    //         console.log(selectedItem);
    //         this.setState({
    //             inputValue:selectedItem[SearchValue],
    //             "searching": false,
    //         });
    //     } else {
    //         console.warn("selectedItem is undefined");
    //     }
    // }

    handleSearch(SearchTerm){
        // search
        this.props.searchActions.searchArtifact(SearchTerm);
        // TODO: don't. get. lazy. just. do. it. aka. make a callback function to get navigation to work with updated state.
    }

    renderListofSuggestions() {
        return this.props.state.results.map((keyword, i) => {
            let displayKey = DisplayArtifactToDisplayKey(keyword);
            return (
                <li
                    key={i}
                    style={{"cursor": "pointer"}}
                    onClick={(e) => {
                        e.preventDefault();
                        this.handleSearch.bind(this)(keyword);
                    }}>
                    {keyword[displayKey]}
                </li>
            );
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
                    this.handleSearch.bind(this)(this.myRef.current.value);
                    // only display the results from the search
                    this.props.handleDisplayItems(this.props.state.results, this.props.state.ontology);
                }}>
                <input
                    type="text"
                    ref={this.myRef}
                    placeholder="Search Term"
                    value={this.props.state.inputValue}
                    // onChange={this.handleFuzzySearch.bind(this)}
                    onChange={(e)=>{
                        e.preventDefault();
                        this.props.searchActions.fuzzySearch(e.target.value, this.props.displayList)}}
                />
                <label htmlFor="keyword-search-switch" className="keyword-search">Keyword Search Only</label>
                <input
                    type="checkbox"
                    name="keyword"
                    id="keyword-search-switch"
                    onChange={this.switchKeywordSearch.bind(this)} />
                <ul className={`suggestions ${this.props.state.searchingState ? "active" : ""}`}>
                    {/*for #146 ${this.props.searchingState ? "active" : "" }*/}
                    {this.renderListofSuggestions.bind(this)()}
                </ul>
            </form>
        );
    }
}

//TODO: connect with props and redux stuff

// check if displayList is properly formatted and assigned
SearchComponent.propTypes = {
    "displayList": PropTypes.array.isRequired,
    "handleDisplayItems": PropTypes.func.isRequired,
    "searchOn": PropTypes.func.isRequired,
    "searchState": PropTypes.any,
    "searchWord": PropTypes.string.isRequired,
    "searchActions": PropTypes.object.isRequired,
    "state": PropTypes.object.isRequired,
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
