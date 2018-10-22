/**
 * Created by danielhuang on 2/24/18.
 */
import React, { Component } from 'react';
import NavigatorComponent from './NavigatorComponent';
import SearchComponent from './SearchComponent';
import MapView from '../MapView/MapView';
import {setPlaceIDList} from '../../utils'
import {ontologyToDisplayKey, ontologyToID, dateFilterHelper} from './model';
import {addNode} from "../UserNexus/UserNexusModel";
import './navigation.css'
import UserNexus from "../UserNexus/UserNexus";

class Navigation extends Component {

    constructor(){
        super();
        this.state = {
            path:[],
            //lists visible on view
            lists:[
                {
                    name:'MAIN',
                    childArray:['Data Navigator','Topic & Index Navigator','[Select]'],
                    children:[this['Data Navigator'],this['Topic & Index Navigator']],
                    level:0
                },
            ],
            displayItemsList:[], //array of jsx items that will be rendered on view
            itemsList:[], //array of display artifact objects (JSON)
            fromDate:1887, //default start date
            fromSelect:false,
            toDate: 1899, //default end date
            toSelect:false,
            timeFilterOn:false,
            displayOntology:'', //defines which icon to display
            lastIDKey:'',
            lastDisplayKey:'',
            placeList:[],
            fieldtrips:[],
            nodes:[],
        };
        this.displayItems = this.displayItems.bind(this)
    }

    componentWillMount(){
        const displayOntology = JSON.parse(localStorage.getItem('displayOntology'));
        if(displayOntology !== null){
            const lists = localStorage.getItem('lists');
            const itemsList = localStorage.getItem('itemsList');
            const lastIDKey = JSON.parse(localStorage.getItem('lastIDKey'));
            const lastDisplayKey = JSON.parse(localStorage.getItem('lastDisplayKey'));

            this.setState({
                lists:JSON.parse(lists),
                displayOntology:displayOntology,
                itemsList:JSON.parse(itemsList),
                lastIDKey:lastIDKey,
                lastDisplayKey:lastDisplayKey,
                displayItemsList:JSON.parse(itemsList).map((itemInList,i)=>{
                    return <li key={i} className={displayOntology}
                               onClick={(e)=>{ e.preventDefault();
                                   this.handleIDQuery(itemInList[lastIDKey],itemInList[lastDisplayKey],displayOntology,itemInList)}}>
                        <span>
                            <img className={"convo-icon " + displayOntology} src={require('./icons8-chat-filled-32.png')} alt="story"/>
                            <img className={"person-icon " + displayOntology} src={require('./icons8-contacts-32.png')}  alt="person"/>
                            <img className={"location-icon " + displayOntology} src={require('./icons8-marker-32.png')}  alt="location"/>
                        </span> {itemInList[lastDisplayKey]}
                    </li>
                }),
                timeFilterOn:false,
            });
        }
    }

    displayList(list, displayKey, idKey, ontology){
        this.setState(()=>{
            return {
                displayItemsList: list.map((itemInList,i)=>{

                    return <li key={i} className={ontology}
                               onClick={(e)=>{ e.preventDefault();
                                   this.handleIDQuery(itemInList[idKey],itemInList[displayKey],ontology,itemInList)}}>
                        <span>
                            <img className={"convo-icon " + ontology} src={require('./icons8-chat-filled-32.png')} alt="story"/>
                            <img className={"person-icon " + ontology} src={require('./icons8-contacts-32.png')}  alt="person"/>
                            <img className={"location-icon " + ontology} src={require('./icons8-marker-32.png')}  alt="location"/>
                            <img className={"fieldtrip-icon " + ontology} src={require('./icons8-waypoint-map-32.png')}  alt="location"/>
                        </span> {itemInList[displayKey]}
                    </li>
                }),
                lastIDKey:idKey,
                lastDisplayKey:displayKey,
            }
        });

        // return list.map((item,i)=>{
        //     return <li key={i} className={ontology}
        //                onClick={(e)=>{ e.preventDefault();
        //                    this.handleIDQuery(item[idKey],item[displayKey],ontology,item)}}>
        //             <span>
        //                 <img className={"convo-icon " + ontology} src={require('./icons8-chat-filled-32.png')} alt="story"/>
        //                 <img className={"person-icon " + ontology} src={require('./icons8-contacts-32.png')}  alt="person"/>
        //                 <img className={"location-icon " + ontology} src={require('./icons8-marker-32.png')}  alt="location"/>
        //             </span> {item[displayKey]}
        //     </li>
        // });
    }

    handleSearchQuery(){}

    handleIDQuery(id, name, type, item){
        console.log(item);
        this.refs.map.updateMarkers(); // update this.props.places for the map component
        addNode(id,name,type,item); // add node to network graph
        this.props.addID(id,name,type);
    }

    displayItems(items, ontology){

        var displayKey = ontologyToDisplayKey[ontology];
        var idKey = ontologyToID[ontology];

        var PlaceIDList = setPlaceIDList(items,ontology);

        /*Save items to local storage for data to continue to exist after tab switch/page refresh  */
        sessionStorage.setItem('lists', JSON.stringify(this.state['lists']));
        sessionStorage.setItem('itemsList', JSON.stringify(items));
        sessionStorage.setItem('displayOntology', JSON.stringify(ontology));
        sessionStorage.setItem('lastIDKey', JSON.stringify(idKey));
        sessionStorage.setItem('lastDisplayKey',JSON.stringify(displayKey));
        this.setState(()=>{
            return {
                displayOntology:ontology,
                itemsList:items,
                displayItemsList: this.displayList(items,displayKey,idKey,ontology),
                placeList: items,
            }
        },()=>{
            if(this.state.timeFilterOn && typeof items !== 'undefined'){
                this.updateItems.bind(this)()
            }
        });
    }

    updateItems(){
        var displayKey = ontologyToDisplayKey[this.state.displayOntology];
        var idKey = ontologyToID[this.state.displayOntology];
        if(this.state.timeFilterOn){
            //filter by time to get array with display artifacts that fit the time filter
            var itemsWithinFieldtrips = dateFilterHelper(this.refs.fromDate.value, this.refs.toDate.value,this.state.displayOntology);
            //if an item is in the itemsWithinFieldtrips, change what is displayed, NOT items list
            var displayList = [];
            //if it isn't a fieldtrip
            if(this.state.displayOntology !== 'Fieldtrips'){
                var idsWithinFieldtrips = [];
                if(typeof itemsWithinFieldtrips !== 'undefined'){

                    //create array of display artifact ids within time filter (this is to speed filtering process later)
                    itemsWithinFieldtrips.forEach((item)=>{
                        idsWithinFieldtrips.push(item[idKey]);
                    });

                    // set items that are within timeline into the display list
                    this.state.itemsList.forEach((item)=>{
                        //if something in the current items list is in the range of the date
                        if(idsWithinFieldtrips.indexOf(item[idKey]) > -1){
                            displayList.push(item);
                        }
                    });

                    //set display ontology to allow icons to show
                    let displayOntologyTimeline = this.state.displayOntology;

                    this.setState({
                        displayItemsList:this.displayList(displayList,displayKey,idKey, displayOntologyTimeline)
                    })
                }
            } else { //else it is a fieldtrip
                this.setState({
                    displayItemsList:this.displayList(itemsWithinFieldtrips,displayKey,idKey,'Fieldtrips')
                })
            }
        } else if(!this.state.timeFilterOn) {
            //set display ontology to define which icon to show
            let displayOntologyTimeline = this.state.displayOntology;
            this.setState({
                displayItemsList:this.displayList(this.state.itemsList,displayKey,idKey,displayOntologyTimeline)
            })
        }

    }

    //sets time filters
    timeFilterHandler(){
        var fromDateForm = parseInt(this.refs.fromDate.value);
        var toDateForm = parseInt(this.refs.toDate.value);
        //check if the dates are valid dates (4 digits, between 1887 and 1899)
        if( fromDateForm >= 1887 && toDateForm <= 1899){
            //check if time filter was switched
            if(this.refs.TimeFilterOn.checked !== this.state.timeFilterOn){
                //if they are, then set this.state variables
                this.setState({
                    timeFilterOn:!this.state.timeFilterOn,
                    fromDate:fromDateForm,
                    toDate:toDateForm,
                }, ()=>{
                    this.updateItems.bind(this)()
                })
            } else {
                //just change from/to dates
                this.setState({
                    fromDate:fromDateForm,
                    toDate:toDateForm,
                }, ()=>{
                    this.updateItems.bind(this)()
                })
            }
        }
    }

    timeInputClickHandler(year){
        //display slider
        if(year === 'ToYear'){
            //set this.state.toSelect = true
            this.setState(()=>{return {toSelect:true}});
        } else {
            //set this.state.fromSelect = true
            this.setState(()=>{return {fromSelect:true}});
        }
    }

    timeInputEnd(year){
        //display slider
        if(year === 'toDate'){
            //set this.state.toSelect = true
            this.setState(()=>{return {toSelect:false}},
                ()=>{this.timeFilterHandler.bind(this)});
        } else {
            //set this.state.fromSelect = true
            this.setState(()=>{return {fromSelect:false}},
                ()=>{this.timeFilterHandler.bind(this)});
        }
    }

    render() {
        return (
            <div className="Navigation">
                <div className="navigation grid-x grid-padding-x">
                    <div className="medium-3 cell dataNavigation">
                        <SearchComponent handleDisplayItems={this.displayItems.bind(this)} displayList={this.state.itemsList}/>
                        <NavigatorComponent handleDisplayItems={this.displayItems.bind(this)}/>
                    </div>
                    <div className="medium-5 cell AssociatedStoriesViewer">
                        <div className="grid-y" style={{'height':'100%'}}>
                            <div className="cell medium-2">
                                <form className="time-filter grid-x">
                                    <div className="medium-2 medium-offset-1 cell">
                                        <div className="switch">
                                            <input className="switch-input" id="exampleSwitch" type="checkbox" checked={this.state.timeFilterOn}
                                                   name="exampleSwitch" onChange={this.timeFilterHandler.bind(this)} ref="TimeFilterOn"/>
                                            <label className="switch-paddle" htmlFor="exampleSwitch"><br/>
                                                <span style={{fontSize:".8em",color:'black',width:'150%'}}>Timeline</span>
                                                <span className="show-for-sr">Enable Timeline</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="medium-2 cell text"><b>From</b></div>
                                    <div className="medium-2 cell">
                                        <input className="year" type="text" name="FromYear" ref="fromDate"
                                               value={this.state.fromDate}
                                               onChange={this.timeFilterHandler.bind(this)} onClick={(e)=>{ e.preventDefault();
                                            this.timeInputClickHandler.bind(this)('FromYear')}}/>
                                        <input className={`slider ${this.state.fromSelect ? 'active' : '' }`}
                                               type="range" min="1887" max={this.state.toDate} value={this.state.fromDate}
                                               onChange={this.timeFilterHandler.bind(this)}
                                               onMouseUp={(e)=>{e.preventDefault(); this.timeInputEnd.bind(this)('fromDate')}}
                                               ref="fromDate"
                                               id="myRange"/>
                                    </div>
                                    <div className="medium-1 cell text"><b>To</b></div>
                                    <div className="medium-2 cell">
                                        <input className="year" type="text" name="ToYear" ref="toDate"
                                               value={this.state.toDate}
                                               onChange={this.timeFilterHandler.bind(this)} onClick={(e)=>{ e.preventDefault();
                                            this.timeInputClickHandler.bind(this)('ToYear')}}/>
                                        <input className={`slider ${this.state.toSelect ? 'active' : '' }`}
                                               type="range" min={this.state.fromDate} max="1899" value={this.state.toDate}
                                               onChange={this.timeFilterHandler.bind(this)}
                                               onMouseUp={(e)=>{e.preventDefault(); this.timeInputEnd.bind(this)('toDate')}}
                                               ref="toDate"
                                               id="myRange"/>
                                    </div>
                                </form>
                            </div>
                            <div className="stories-container cell medium-10">
                                <ul className="book medium-cell-block-y">
                                    {this.state.displayItemsList}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="medium-4 cell">
                        <div className="grid-y" style={{'height':'100%'}}>
                            <UserNexus className="medium-6 cell" ref="UserNexus"/>
                            <MapView className="medium-6 cell" ref="map" places={this.state.placeList} fieldtrips={this.state.fieldtrips}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigation;
