/**
 * Created by danielhuang on 2/24/18.
 */
import React, { Component } from 'react';
import './navigatorComponent.css';
import NavigationDropdownMenu from './NavigationDropdownMenu';
import {getList, ontologyToDisplayKey, arrayTransformation, tangoTypes} from './model';

class Navigation extends Component {

    constructor(){
        super();
        this.state = {
            path: [],
            displayItemsList: [],
            navigators: [],
            dataNavView: true,
            dataNav: [],
            TINav: [],
            dropdownLists: [],
        };
        this.handleLevelTwoClick = this.handleLevelTwoClick.bind(this);
    }

    componentWillMount(){
        const prevState = JSON.parse(localStorage.getItem('NavCompState'));
        // console.log(prevState);
        if(prevState){
            this.setState(()=>{
                return{
                    navigators:[
                        {name:'Data Navigator', tabClass:'tab cell medium-6 dataNavView active'},
                        {name:'Topic & Index Navigator', tabClass:'tab cell medium-6 TINavView'}
                    ],
                    dataNav:['People','Places','Stories'],
                    TINav:['ETK Indice','Tangherlini Index','Fieldtrips','Genres'],
                    displayItemsList:prevState.displayItemsList,
                    dataNavView:prevState.dataNavView,
                    dropdownLists:prevState.dropdownLists,
                }
            });
        } else {
            this.setState(()=>{
                return{
                    navigators:[
                        {name:'Data Navigator', tabClass:'tab cell medium-6 dataNavView active'},
                        {name:'Topic & Index Navigator', tabClass:'tab cell medium-6 TINavView'}
                    ],
                    dataNav:['People','Places','Stories'],
                    TINav:['ETK Indice','Tangherlini Index','Fieldtrips','Genres'],
                }
            });
        }

    }

    handleTabClick(nav){
        //resets search/selection results
        this.props.handleDisplayItems([],'');
        if(nav['name'] === 'Data Navigator'){
            this.setState((oldState)=>{
                oldState['dataNavView'] = true;
                //erase any existing dropdown lists
                oldState['dropdownLists'] = [];
                oldState['navigators'] = [
                    {name:'Data Navigator', tabClass:'tab cell medium-6 dataNavView active'},
                    {name:'Topic & Index Navigator', tabClass:'tab cell medium-6 TINavView'}
                ];
                return oldState;
            });
        } else {
            this.setState((oldState)=>{
                oldState['dataNavView'] = false;
                oldState['dropdownLists'] = [];
                oldState['navigators'] = [
                    {name:'Data Navigator', tabClass:'tab cell medium-6 dataNavView '},
                    {name:'Topic & Index Navigator', tabClass:'tab cell medium-6 TINavView active'}
                ];
                return oldState;
            })
        }
    }

    //level 2 = indices, people, places, stories
    handleLevelTwoClick(ontology){
        this.props.handleDisplayItems([],''); //reset results display
        var itemsList = getList(ontology);
        var listObject = {};
        var isPPSF = (ontology === 'People' || ontology === 'Places' || ontology === 'Stories' || ontology === 'Fieldtrips');
        if(isPPSF){ //if it is part of Data navigator or it's a fieldtrip
            this.props.handleDisplayItems(itemsList, ontology); // send to navigation to display results
            this.setState({dropdownLists:[]})
        } else {
            //create additional options for people to be in the dropdown menu so people can select everything in the menu
            var selectString = '';
            if(ontology!=='ETK Indice'){
                selectString = "[Select "+ontology.slice(0,-1)+"]";
            } else {
                selectString = "[Select "+ontology+"]";
            }
            var displayKey = ontologyToDisplayKey[ontology];
            var selectObject = {};
            selectObject[displayKey] = selectString;
            var inList = false;
            itemsList.forEach((item)=>{
                if(item[displayKey] === selectObject[displayKey]){
                    console.log(item['name'],selectObject['name']);
                    inList = true;
                }
            });

            if(!inList){
                itemsList.unshift(selectObject);
            }
        }
        if(ontology !== 'Tangherlini Index' && !isPPSF) {
            //if it is an indice that isn't a tango index
            listObject = {
                selectValue:selectString,
                displayKey:displayKey,
                ontology:ontology,
                tango:false,
                list:itemsList
            };
            this.setState({dropdownLists:[listObject]});
        } else if (!isPPSF) {
            //ontology === tangherlini indices
            var tangoTypesList = Object.keys(tangoTypes);
            tangoTypesList.unshift('[Select a Class]');
            listObject = {
                selectValue:selectString,
                displayKey:displayKey,
                ontology:ontology,
                tango:true,
                list:tangoTypesList,
            };
            this.setState({dropdownLists:[listObject]})
        }

    }

    selectMenu(selectedItem,isTango){
        if(!isTango){
            var storiesList = arrayTransformation(selectedItem['stories']['story']);
            this.setState((oldState)=>{
                var newDropdownList = oldState.dropdownLists;
                newDropdownList[newDropdownList.length - 1]['selectValue'] = selectedItem['name'];
                console.log(newDropdownList);
                return {dropdownLists:newDropdownList}
            });
            this.props.handleDisplayItems(storiesList,'Stories');
            localStorage.setItem('navCompState',this.state);
        } else if(isTango){
            //need to make second dropdown list with those types
            this.setState((oldState)=>{
                var newList = tangoTypes[selectedItem]['children'];
                var selectString = '[Select an Ontology]';
                var selectObj = {name:selectString};
                newList.unshift(selectObj);
                var listObject = {
                   selectValue:selectString,
                   displayKey:'name',
                   ontology:'',
                   tango:false,
                   list:newList
                };
                var newDropdownList = oldState.dropdownLists;
                newDropdownList.splice(1,1,listObject);
                newDropdownList[0]['selectValue'] = selectedItem;
                return {dropwdownLists:newDropdownList}
            });
        }
    }

    render() {
        var ontologyType = this.state.dataNavView ? 'dataNav' : 'TINav';
        return (
            <div className="NavigatorComponent">
                <div className="navigator-tabs grid-x ">
                    {this.state.navigators.map((nav,i)=>{
                        return <div className={nav['tabClass']} key={i}
                                    onClick={(e)=>{e.preventDefault;this.handleTabClick(nav)}}>
                            {nav['name']}
                        </div>
                    })}
                </div>
                <div className="navigator-options-wrapper ">
                    <div className={`cell ${this.state.dataNavView ? 'active dataNavView' : 'TINavView active'}`}>
                        <ul className="ontologyList">
                            {this.state[ontologyType].map((ontology, i)=>{
                                return <li className={'ontology '+ ontology} key={i}
                                           onClick={(e)=>{e.preventDefault(); this.handleLevelTwoClick(ontology)}}>
                                    {ontology}
                                </li>
                            })}
                        </ul>
                    </div>
                    {
                        this.state.dropdownLists.map((list,i)=>{
                            return <NavigationDropdownMenu className="cell"
                                                            list = {list}
                                                           handleMenuSelect = {this.selectMenu.bind(this)}
                                                           key={i}/>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Navigation;