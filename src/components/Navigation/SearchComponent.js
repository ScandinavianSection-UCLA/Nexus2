import React, {Component} from "react";
import {getKeywords, DisplayArtifactToDisplayKey} from "../../data-stores/DisplayArtifactModel";
import "./search.css";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as navigatorActions from "../../actions/navigatorActions";
import * as searchActions from "../../actions/searchActions";
import connect from "react-redux/es/connect/connect";

class SearchComponent extends Component {
    constructor(props) {
        super(props);
        // currently unused, getKeywords() is an unused import if we don't need this
        this.state = {
            "inputValue": "",
            "keywords": getKeywords(),
        };
        this.renderListofSuggestions = this.renderListofSuggestions.bind(this);
        this.switchKeywordSearch = this.switchKeywordSearch.bind(this);
    }

    renderListofSuggestions() {
        return this.props.searchState.results.map((keyword, i) => (
            <li
                key={i}
                style={{"cursor": "pointer"}}
                onClick={(event) => {
                    event.preventDefault();
                    this.props.actions.searchArtifact(keyword);
                }}>
                {keyword[DisplayArtifactToDisplayKey(keyword)]}
            </li>
        ));
    }

    switchKeywordSearch(event) {
        this.props.actions.displayItems([]);
        this.setState({
            "keywordSearch": event.target.checked,
            "inputValue": "",
        });
    }

    render() {
        return (
            <form
                className="SearchComponent"
                onSubmit={(event) => {
                    event.preventDefault();
                    this.props.actions.searchArtifact(this.props.searchState.inputValue);
                }}>
                <input
                    type="text"
                    placeholder="Search Term"
                    value={this.props.searchState.inputValue}
                    onChange={(event) => {
                        event.preventDefault();
                        this.props.actions.fuzzySearch(
                            event.target.value,
                            this.props.navigatorState.itemsList
                        );
                    }} />
                <label htmlFor="keyword-search-switch">Keyword Search Only</label>
                <input
                    type="checkbox"
                    name="keyword"
                    id="keyword-search-switch"
                    onChange={this.switchKeywordSearch} />
                {/* only show suggestions while a search is active */}
                {this.props.searchState.searchingState === true &&
                    <ul className="suggestions">
                        {this.renderListofSuggestions()}
                    </ul>}
            </form>
        );
    }
}

SearchComponent.propTypes = {
    "actions": PropTypes.object.isRequired,
    "navigatorState": PropTypes.shape({
        "displayList": PropTypes.array,
        "fromDate": PropTypes.number,
        "itemsList": PropTypes.array.isRequired,
        "placeList": PropTypes.array,
        "timeFilterOn": PropTypes.bool,
        "toDate": PropTypes.number,
    }).isRequired,
    "searchState": PropTypes.shape({
        "inputValue": PropTypes.string.isRequired,
        "keywordSearch": PropTypes.bool,
        "ontology": PropTypes.string,
        "results": PropTypes.array.isRequired,
        "searchingState": PropTypes.bool.isRequired,
    }).isRequired,
};

/**
 * Set certain props to access Redux states
 * @param {Object} state All possible Redux states
 * @returns {Object} Certain states that are set on props
 */
function mapStateToProps(state) {
    return {
        "navigatorState": state.navigator,
        "searchState": state.search,
    };
}

/**
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": {
            ...bindActionCreators(searchActions, dispatch),
            ...bindActionCreators(navigatorActions, dispatch),
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchComponent);
