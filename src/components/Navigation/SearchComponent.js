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
        };
    }

    componentWillMount(){
        console.log("search component props have loaded!",this.props.displayList);
        this.setState({
            keywords:getKeywords(this.props.displayList),
            results:getKeywords(this.props.displayList)
        });

    }

    handleSearch(selectedItem){
        console.log('searching!', selectedItem);
        // check if selectItem is a string
        if(typeof selectedItem === 'string'){
            // console.log(selectedItem, this.state.keywords);
            this.state.keywords.forEach((keyword) => {
                if(keyword['keyword_name'] === selectedItem){
                    selectedItem = keyword;
                }
            })
        }
        // console.log(selectedItem);
        // check if selectedItem is a story or keyword, place, or person
        let DisplayOntology ='';
        let SearchValueKey =''
        if('story_id' in selectedItem){
            DisplayOntology = 'Stories';
            SearchValueKey = 'full_name';
        } else if('keyword_id' in selectedItem){
            var storiesList = [];
            var placesList = [];
            if(typeof selectedItem['stories']['story'] !== 'undefined'){
                storiesList = arrayTransformation(selectedItem['stories']['story']);
            }
            if(typeof selectedItem['places']['place'] !== 'undefined'){
                placesList = arrayTransformation(selectedItem['places']['place']);
            }
            var itemsList = storiesList.concat(placesList);
            //console.log(itemsList);
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
        // console.log(selectedItem);
        this.refs.searchString.value = selectedItem[SearchValueKey];
        this.refs.SuggestionList.classList.remove('active');
        this.props.handleDisplayItems([selectedItem],DisplayOntology);
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
            console.log("unfiltered results",this.state);
            console.log("filtered results", results);

            if(this.props.displayList.length > 0){
                this.setState({
                    refinedResults:results,
                    searchTerm:input,
                },()=>{
                    this.setState({
                        suggestionJSX: <ul className={`suggestions ${this.state.searching ? 'active' : ''}`}>
                            {this.renderListofSuggestions('refinedResults')}
                        </ul>
                    });
                });
            } else {
                this.setState({
                    results:results,
                    searchTerm:input,
                },()=>{
                    this.setState({
                        suggestionJSX: <ul className={`suggestions ${this.state.searching ? 'active' : ''}`}>
                            {this.renderListofSuggestions('results')}
                        </ul>
                    });
                });
            }
        }
    }

    renderKeywords(){
        if(typeof this.state.keywords !== 'undefined'){
            return this.state.keywords;
        }
    }

    renderListofSuggestions(QueriedList){
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
        this.refs.SuggestionList.classList.add('active');
        //setState to save anything from this.props.displayList to this.state.refinedResults
        this.setState({
            refinedResults:this.props.displayList,
            searching:true,
        },()=>{
            //in the callback function (once the state has been updated) check to see if the length of this.props.displayList > 0
            let QueriedList='';
            console.log(this.state.keywordSearch);
            if(this.state.keywordSearch){
                QueriedList = 'results';
                console.log('just keywords dude');
            } else if(this.props.displayList.length > 0){ //if there is something in the results table, then only search through displayed results
                QueriedList = 'refinedResults';
                console.log('refined results man');
            }

            //if so, return map of keyword from this.state['refinedResults']
            let SuggestionList = <ul className={`suggestions ${this.state.searching ? 'active' : ''}`}>
                {this.renderListofSuggestions(QueriedList)}
            </ul>;

            this.setState({
                suggestionJSX:SuggestionList,
            });
        });
    }

    switchKeywordSearch(e){
        this.setState({
            keywordSearch:e.target.checked,
        });
    }

    render() {
        return (
            <div className="SearchComponent">
                <div className="grid-x">
                    <form className="cell" onSubmit={(e)=>{e.preventDefault(); console.log(this.refs); this.handleSearch.bind(this)(this.refs.searchString.defaultValue)}}>
                        <input type="text" ref="searchString" placeholder="Search Term" value={this.state.searchTerm}
                               onClick={(e)=>{
                                   e.preventDefault();
                                   this.renderSuggestions.bind(this)();
                               }}
                        onChange={this.handleFuzzySearch.bind(this)}/>
                        <label htmlFor="keyword-search-switch">Keyword Search Only</label>
                        <input type="checkbox" name="keyword"
                               // value={this.state.keywordSearch}
                               id="keyword-search-switch"
                               ref="keywordSwitch"
                                onChange={(e)=>{
                                    // console.log(e.target.checked);
                                    this.switchKeywordSearch.bind(this)(e);
                                }}>
                        </input>
                        <div ref="SuggestionList" className="suggestion-wrapper">
                        {this.state['suggestionJSX']}
                        </div>
                    </form>
                    <div className="cell filters">

                    </div>
                </div>

            </div>
        );
    }
}

export default SearchComponent;