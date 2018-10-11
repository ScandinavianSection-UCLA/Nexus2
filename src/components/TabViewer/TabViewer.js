/**
 * Created by danielhuang on 1/28/18.
 */
import React, { Component } from 'react';
import Navigation from '../Navigation/Navigation';
import StoryView from '../StoryView/StoryView';
import PlaceView from '../PlaceView/PlaceView';
import PeopleView from '../PeopleView/PeopleView';
import FieldtripView from '../FieldtripView/FieldtripView';
import BookView from '../BookView/BookView';
import {getStoryByID, getPeopleByID, getPlacesByID, getFieldtripsByID} from "./model";
import './TabViewer.css'

class TabViewer extends Component {

    constructor(){
        super();
        this.state = {
            views:[],
            storyPath:'',
            inView:[],
        };
        this.handleID = this.handleID.bind(this);
        this.tabController = this.tabController.bind(this);
        this.switchTab = this.switchTab.bind(this);
        this.closeTab = this.closeTab.bind(this);
        this.renderPDF = this.renderPDF.bind(this);
        this.renderPPFS = this.renderPPFS.bind(this);
    }

    componentWillMount(){
        var navigationObject = {
            jsx: <Navigation addID={this.handleID}/>,
            active: true,
            id:0,
            name:'Home',
            type:'Home'
        };

        //load previously opened tabs from session
        if(JSON.parse(sessionStorage.getItem('inView')) !== null){
            const cachedViews = JSON.parse(sessionStorage.getItem('views'));
            const cachedInView = JSON.parse(sessionStorage.getItem('inView'))[0]; //object
            this.setState(()=>{
                //reconstruct jsx from id and type
                var newViews = [];
                cachedViews.forEach((view)=>{
                   newViews.push({
                       active: view['active'],
                       id:view['id'],
                       name:view['name'],
                       type:view['type'],
                       jsx: this.renderPPFS(view['id'],view['type']),
                   })
                });
                var newInView = {
                    active:cachedInView['active'],
                    id:cachedInView['id'],
                    name:cachedInView['name'],
                    type:cachedInView['type'],
                    jsx: this.renderPPFS(cachedInView['id'],cachedInView['type']),
                };

                //if route set to home tab, make home tab the active and inview tab
                if(this.props.home){
                    newViews.map((currentView)=>{
                        if(currentView['name'] === 'Home'){
                            currentView = navigationObject;
                        }
                    });
                    newInView = navigationObject;
                }

                return {
                    views:newViews,
                    inView: [newInView],
                }
            })
        } else {
            //if no previous session data or data from route, just load a home tab
            this.setState((prevState)=>{
                var newState = prevState.views;
                newState.push(navigationObject);
                return {views:newState, inView:newState}
            });
        }
    }

    renderPPFS(id,type){
        if(type==='People'){
            var personObject = getPeopleByID(id);
            return <PeopleView person={personObject} addID={this.handleID}/>
        } else if(type==='Places'){
            var place = getPlacesByID(id);
            return <PlaceView place={place} addID={this.handleID}/>
        } else if(type==='Fieldtrips'){
            var fieldtrip = getFieldtripsByID(id);
            return <FieldtripView fieldtrip={fieldtrip} addID={this.handleID}/>
        } else if(type==='Stories'){
            var storyObject = getStoryByID(id);
            return <StoryView story={storyObject} addID={this.handleID}/>;
        } else if(type==='Home' || type==='home'){
            return <Navigation addID={this.handleID}/>;
        }
    }
    //update views with PDF views
    renderPDF(chapter, name){
        var nameUpdated = true;
        if(this.state.inView.name === name){
            nameUpdated = false;
        } else {
            this.state.views.forEach((view)=>{
                if(view.name === name){
                    nameUpdated = false;
                }
            });
        }
        if(name !== undefined && nameUpdated){
            var PDFObject = {
                name:name,
                chapter:chapter,
                jsx:<BookView chapter={chapter} name={name}>{name}</BookView>,
                active:true
            };
            this.setState((prevState)=>{
                var newState = prevState;
                newState.views.forEach((view)=>{
                    view.active = false;
                });
                newState.views.push(PDFObject);
                return {views:newState.views, inView:[PDFObject]}
            });
        }
    }
    //7)A catch all function will take in an ID and name of the selected object
    // depending on what was selected (story, people, places, fieldtrips) add a different type of object to add to views and inView

    handleID(InputID, Name, Type){
        // adds tab to viewer
        // console.log(InputID,Name, Type);
        //check if input id is already in views
        var inView = false;
        var viewIndex = -1;
        this.state.views.forEach((view,i)=>{
            if(view['id']===InputID && view['type']===Type){
                inView = true;
                viewIndex = i;
            }
        });
        if(inView){
            //if it's already in views, make it in view
            this.setState((prevState)=>{
                return {inView:[prevState['views'][viewIndex]]}
            });
        } else {
            var itemObject = {
                jsx:this.renderPPFS(InputID,Type,Name),
                id:InputID,
                active:true,
                name:Name,
                type:Type
            };
            this.setState((prevState)=>{
                var newViews = prevState.views;
                newViews.forEach((view)=>{
                    view.active = false;
                });
                newViews.push(itemObject);
                var width = window.innerWidth;

                if (width<=1100){
                    console.log('window is small!')
                    if(newViews.length>5){
                        newViews.splice(1,1);
                    }
                } else {
                    if(newViews.length>6){
                        newViews.splice(1,1);
                    }
                }

                return {
                    views:newViews,
                    inView:[itemObject]
                }
            },
                ()=>{
                    sessionStorage.setItem('views',JSON.stringify(this.state.views));
                    sessionStorage.setItem('inView',JSON.stringify(this.state.inView));
            }
            );
        }
    }

    tabController(){
        for(var i=0; i<this.state.views.length;i++){
            if(this.state.views[i].active){
                return this.state.views[i].jsx;
            }
        }
    }

    switchTab(view){

        this.setState((prevState)=>{
            var newViews = prevState.views;
            newViews.forEach((currentView)=>{
                if(currentView.name !== view.name){
                    currentView.active = false;
                } else {
                    currentView.active = true;
                    if(currentView.type === 'story'){

                        currentView.jsx = this.renderStory(currentView.id);
                        view = currentView;
                    }
                }
            });
            //check if view has been deleted from list of views
            if(newViews.includes(view)){
                return { views:newViews, inView:[view] }
            } else {
                return{ views:newViews }
            }
        },()=>{
            sessionStorage.setItem('inView',JSON.stringify(this.state.inView));
        });
    }

    closeTab(view){
        //find 'view' in this.state.views and .inView, and delete it. if .inView then default to home tab
        this.setState((prevState)=>{
            var newState = prevState;
            var removeViewIndex = -1;
            this.state.views.forEach((currentView,i)=>{
                if(currentView['name'] === view['name']){
                    removeViewIndex = i;
                }
            });
            newState.views.splice(removeViewIndex,1);
            if(newState.inView[0]['name'] === view['name']){ // is current view being closed?
                return {
                    views:newState.views,
                    inView:[newState.views[newState.views.length-1]]
                }
            } else { // if current view isn't being closed, don't change what's inView
                return {
                    views:newState.views,
                }
            }
        },()=>{
            sessionStorage.setItem('views',JSON.stringify(this.state.views));
        })
    }

    renderTabs(){
        // this.renderPDF(this.props.menuItem.url,this.props.menuItem.name);
        return this.state.inView.map((view, i)=>{ return <div style={{height:'inherit'}} key={i}>{view.jsx}</div> });
    }

    render() {
        return (
            <div className="TabViewer grid-container full">
                <div className="grid-y">
                    {/*Wrapper/container for the View, not including the tabs*/}
                    <div className="view cell fill"> {/*Class "fill" fills out the rest of the application space with the view*/}
                        {/*Function below generates/sorts out which view should be displayed*/}
                        {this.renderTabs.bind(this)()}
                    </div>
                    {/*List of tabs that are displayed at the bottom of the browser/app*/}
                    <ul className="tabs cell medium-1"> {/*medium-1 sets the height of the tabs*/}
                        {this.state.views.map((view,i)=>{
                            return <li onClick={(event)=>{event.preventDefault();this.switchTab(view);}}
                                       key={i} className={`${view.name === this.state.inView[0].name ? 'active' : ''}`}>
                                {view.name}
                                <img src="https://png.icons8.com/material/50/000000/delete-sign.png" alt="Close Icon"
                                     className={`closeTabIcon ${view.name === 'Home'? 'noClose':''}`} onClick={(event)=>{event.preventDefault(); this.closeTab(view)}}/>
                            </li>})}
                    </ul>
                </div>
            </div>
        );
    }
}

export default TabViewer;