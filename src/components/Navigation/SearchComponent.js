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
            searching:false,
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
        // check if selectItem is a string
        if(typeof selectedItem === 'string'){
            // console.log(selectedItem, this.state.keywords);
            this.state.keywords.forEach((keyword) => {
                if(keyword['keyword_name'] === selectedItem){
                    selectedItem = keyword;
                }
            })
        }
        console.log(selectedItem);
        // check if selectedItem is a story or keyword
        if('story_id' in selectedItem){
            this.props.handleDisplayItems([selectedItem],'Stories');
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
        }
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
            console.log(results);
            this.setState({
                results: results,
                searchTerm:input,
            });
        }
    }

    renderKeywords(){
        if(typeof this.state.keywords !== 'undefined'){
            return this.state.keywords;
        }
    }

    renderSuggestions(){
        if(this.props.displayList.length > 0){
            //TODO: Figure out how to set results
            this.state.results = this.props.displayList;
            return this.state.results.map((keyword,i)=>{
                var displayKey = '';
                if('keyword_name' in keyword){
                    displayKey = 'keyword_name';
                } else if ('search_string' in keyword) {
                    displayKey = 'search_string';
                } else if('full_name' in keyword){
                    displayKey = 'full_name';
                } else if('name' in keyword){
                    displayKey = 'name';
                }
                return <li key={i} style={{cursor:'pointer'}}
                           onClick={(e)=>{e.preventDefault();this.handleSearch.bind(this)(keyword)}}>{keyword[displayKey]}</li>
            });

        } else if(typeof this.state.results !== 'undefined'){
            return this.state.results.map((keyword,i)=>{
                var displayKey = '';
                if('keyword_name' in keyword){
                    displayKey = 'keyword_name';
                } else if ('search_string' in keyword) {
                    displayKey = 'search_string';
                }
                return <li key={i} style={{cursor:'pointer'}}
                           onClick={(e)=>{e.preventDefault();this.handleSearch.bind(this)(keyword)}}>{keyword[displayKey]}</li>
            });
        }

    }

    render() {
        return (
            <div className="SearchComponent">
                <div className="grid-x">
                    <form className="cell" onSubmit={(e)=>{e.preventDefault(); console.log(this.refs); this.handleSearch.bind(this)(this.refs.searchString.defaultValue)}}>
                        <input type="text" ref="searchString" placeholder="Search Term" value={this.state.searchTerm}
                               onClick={(e)=>{
                                   e.preventDefault();
                                   //reset results column
                                   // this.props.handleDisplayItems([],'Stories');
                                   this.setState({searching:true});
                               }}

                        onChange={this.handleFuzzySearch.bind(this)}/>
                        <ul className={`suggestions ${this.state.searching ? 'active' : ''}`}>
                            {this.renderSuggestions.bind(this)()}
                        </ul>


                    </form>
                    <div className="cell filters">

                    </div>
                </div>

            </div>
        );
    }
}

export default SearchComponent;