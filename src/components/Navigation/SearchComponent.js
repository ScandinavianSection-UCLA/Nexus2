/**
 * Created by danielhuang on 3/3/18.
 */
import React, { Component } from 'react';
import {getKeywords, arrayTransformation} from './model';
import Fuse from 'fuse.js';
import './search.css';

class SearchComponent extends Component {

    constructor(){
        super();
        this.state = {
            keywords:[],
            results:[],
            refinedResults:[],
            searching:false,
            suggestionJSX:'',
            keywordSearch:false,
            refinedResultsState:false,
        };
    }

    componentWillMount(){
        this.setState({
            keywords:getKeywords(this.props.displayList),
            results:getKeywords(this.props.displayList)
        });

    }

    handleSearch(selectedItem){
        // check if selectItem is just a keyword string
        if(typeof selectedItem === 'string'){
            // if it is, we need to get the keyword object from keywords
            this.state.keywords.forEach((keyword) => {
                if(keyword['keyword_name'] === selectedItem){
                    selectedItem = keyword;
                }
            })
        }

        // check if selectedItem is a story or keyword, place, or person
        let DisplayOntology ='';
        let SearchValueKey ='';

        if('story_id' in selectedItem){
            DisplayOntology = 'Stories';
            SearchValueKey = 'full_name';
        } else if('keyword_id' in selectedItem){
            let storiesList = [];
            let placesList = [];
            if(typeof selectedItem['stories']['story'] !== 'undefined'){
                storiesList = arrayTransformation(selectedItem['stories']['story']);
            }
            // if(typeof selectedItem['places']['place'] !== 'undefined'){
            //     placesList = arrayTransformation(selectedItem['places']['place']);
            // }
            // // var itemsList = storiesList.concat(placesList);

            this.props.handleDisplayItems(storiesList,'Stories');
            this.setState({searching:false, searchTerm:selectedItem['keyword_name']});
            return;
        } else if('person_id' in selectedItem){
            DisplayOntology = 'People';
            SearchValueKey = 'full_name';
        } else if('place_id' in selectedItem){
            DisplayOntology = 'Places';
            SearchValueKey = 'name';
        } else if('fieldtrip_name' in selectedItem){
            DisplayOntology = 'Fieldtrips';
            SearchValueKey = 'fieldtrip_name';
        }

        this.refs.searchString.value = selectedItem[SearchValueKey]; //set text input field to the selected item
        this.props.handleDisplayItems([selectedItem],DisplayOntology); //only display the results from the search
        this.setState({searching:false});
    }

    handleFuzzySearch(){
        var data;
        if(this.props.displayList.length > 0){
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
            keys:[
                "search_string",
                "keyword_name",
                "name",
                "full_name",
            ]
        });

        var input = this.refs.searchString.value;

        //if there's nothing in the input, render all possible results
        if (input === '') {
            this.setState({
                results: data.slice(0, 100),
                searchTerm:input,
            });
        } else { //if there is something in input, call fuzzy search
            const results =  fuse.search(input); //results from fuzzy search from Keywords.json
            let ResultList = '';
            let RefinedResultState = true;
            if(this.props.displayList.length > 0){
                ResultList = 'refinedResults';
                RefinedResultState = true;
            } else {
                ResultList = 'results';
                RefinedResultState = false;
            }
            let NewState = {
                searchTerm:input,
                refinedResultState:RefinedResultState,
            };
            NewState[ResultList] = results;
            this.setState(NewState );
        }
    }

    renderKeywords(){
        if(typeof this.state.keywords !== 'undefined'){
            return this.state.keywords;
        }
    }

    renderListofSuggestions(){
        var QueriedList = this.state.refinedResultsState ? 'refinedResults' :'results';
        return this.state[QueriedList].map((keyword,i)=>{
            var displayKey = '';
            if('keyword_name' in keyword){
                displayKey = 'keyword_name';
            } else if ('search_string' in keyword) {
                displayKey = 'search_string';
            } else if('full_name' in keyword){
                displayKey = 'full_name';
            } else if('name' in keyword){
                displayKey = 'name';
            } else if('fieldtrip_name' in keyword){
                displayKey = 'fieldtrip_name'
            }
            return <li key={i} style={{cursor:'pointer'}}
                       onClick={(e)=>{e.preventDefault();this.handleSearch.bind(this)(keyword)}}>{keyword[displayKey]}</li>
        });
    }

    renderSuggestions(){
        // this.refs.SuggestionList.classList.add('active');
        let RefinedResultsState = false;
        if(this.props.displayList.length > 0){
            RefinedResultsState = true;
        }
        //setState to save anything from this.props.displayList to this.state.refinedResults
        this.setState({
            refinedResults:this.props.displayList,
            refinedResultsState:RefinedResultsState,
            searching:true,
        },()=>{
            return this.renderListofSuggestions();
        });
    }

    switchKeywordSearch(e){
        this.props.handleDisplayItems([],'Stories');
        this.setState({
            keywordSearch:e.target.checked,
        });
    }

    render() {
        return (
            <div className="SearchComponent">
                <div className="grid-x">
                    <form className="cell"
                          onSubmit={(e)=>{e.preventDefault(); this.handleSearch.bind(this)(this.refs.searchString.defaultValue)}}
                    >
                        <input type="text" ref="searchString" placeholder="Search Term" value={this.state.searchTerm}
                               onClick={(e)=>{
                                   e.preventDefault();
                                   this.renderSuggestions.bind(this)();
                               }}
                                onChange={this.handleFuzzySearch.bind(this)}
                        />
                        <label htmlFor="keyword-search-switch">Keyword Search Only</label>
                        <input type="checkbox" name="keyword"
                               // value={this.state.keywordSearch}
                               id="keyword-search-switch"
                               ref="keywordSwitch"
                                onChange={(e)=>{this.switchKeywordSearch.bind(this)(e);}}>
                        </input>
                        <ul className={`suggestions ${this.state.searching ? 'active' : ''}`}>
                            {this.renderListofSuggestions.bind(this)()}
                        </ul>
                        {/*<div ref="SuggestionList" className="suggestion-wrapper">*/}
                        {/*{this.state['suggestionJSX']}*/}
                        {/*</div>*/}
                    </form>
                    <div className="cell filters">

                    </div>
                </div>

            </div>
        );
    }
}

export default SearchComponent;