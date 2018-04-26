/**
 * Created by danielhuang on 4/14/18.
 */
import React, { Component } from 'react';
import {getPeopleByID, arrayTransformation} from './model'
import { render } from 'react-dom';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import './RightBar.css'

class RightBar extends Component {

    constructor(){
        super();
        this.state = {
            isPaneOpen: false,
            isActive:{
                people:false,
                bio:false,
                places:false,
                stories:false,
                storiesMentioned:false,
            }
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    clickHandler(id,name,type){
        console.log(this.props);
        this.props.passID(id,name,type);
    }

    PPSClickHandler(section){
        this.setState((oldState)=>{

            oldState.isActive = {
                people:false,
                bio:false,
                places:false,
                stories:false,
                storiesMentioned:false,
            };

            oldState.isActive[section] = true;

            return {
                isPaneOpen: true,
                isActive:oldState.isActive,
            };
        }); //make side bar appear
    }

    renderControls(){
        //  if place then people story story
        if(this.props.view === 'Places'){
            return <div style={{marginTop:'150%', marginBottom:'20%'}}>
                <div className={`medium-2 cell ${this.state.isActive['people'] ? 'active':''} bio`}
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('people')}}>
                    <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                         className="icon"
                         alt="person"/>
                    <br/>
                    <div className="icon-label">People</div>
                </div>
                <div className={`medium-2 cell ${this.state.isActive['stories_mentioned'] ? 'active':''} stories-mentioned`}
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('stories_mentioned')}}>
                    <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                         className="icon"
                         alt="stories" />
                    <br/>
                    <div className="icon-label">Stories That Mention</div>
                </div>
                <div className={`medium-2 cell ${this.state.isActive['stories'] ? 'active':''} stories` }
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('stories')}}>
                    <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                         className="icon"
                         alt="stories" />
                    <br/>
                    <div className="icon-label">Stories Collected</div>
                </div>
            </div>
        } else if (this.props.view === 'Stories'){ //  if story then people place story
            return <div style={{marginTop:'150%', marginBottom:'20%'}}>
                <div className={`medium-2 cell ${this.state.isActive['people'] ? 'active':''} bio`}
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('bio')}}>
                    <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                         className="icon"
                         alt="person"/>
                    <br/>
                    <div className="icon-label">{this.props.object['informant_first_name']} {this.props.object['informant_last_name']}</div>
                </div>
                <div className={`medium-2 cell ${this.state.isActive['places'] ? 'active':''} places` }
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('places')}}>
                    <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                         className="icon"
                         alt="location"/>
                    <br/>
                    <div className="icon-label">Places</div>
                </div>
                <div className={`medium-2 cell ${this.state.isActive['stories'] ? 'active':''} stories` }
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('stories')}}>
                    <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                         className="icon"
                         alt="stories" />
                    <br/>
                    <div className="icon-label">Stories</div>
                </div>
            </div>
        } else if (this.props.view === 'People'){ //  if people then place story
            return <div style={{marginTop:'150%', marginBottom:'20%'}}>
                <div className={`medium-2 cell ${this.state.isActive['places'] ? 'active':''} places` }
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('places')}}>
                    <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                         className="icon"
                         alt="location"/>
                    <br/>
                    <div className="icon-label">Places</div>
                </div>
                <div className={`medium-2 cell ${this.state.isActive['stories'] ? 'active':''} stories` }
                     onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('stories')}}>
                    <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                         className="icon"
                         alt="stories" />
                    <br/>
                    <div className="icon-label">Stories</div>
                </div>
            </div>
        }
    }


    renderContent(){

        if(this.state.isActive['bio']){
            return this.renderBiography();
        } else if(this.state.isActive['places']){
            return this.renderPlaces();
        } else if(this.state.isActive['stories']){
            return this.renderStories();
        } else if(this.state.isActive['people']){
            return this.renderPeople();
        } else if(this.state.isActive['stories_mentioned']){
            return this.renderStories('mentioned')
        }
    }

    renderPeople(){

        if(this.props.people.length===0){
            return <div className="cell medium-10 content">
                <div className="callout alert">
                    <h6>There are no associated people.</h6>
                </div>
            </div>
        } else {
            return <div className="cell medium-10 content">
                <ul>
                    {this.props.people.map((person, i) => {
                        return <li key={i} onClick={
                            (e)=>{
                                e.preventDefault();
                                this.clickHandler.bind(this)(person['person_id'],person['full_name'],'People')
                                }
                            }
                        >{person['full_name']}</li>
                    })}
                </ul>
            </div>
        }
    }

    renderPlaces(){
        var cleanArray = this.props.places;
        if(cleanArray.length===0){
            return <div className="cell medium-10 content">
                <div className="callout alert">
                    <h6>There are no associated places.</h6>
                </div>
            </div>
        } else {
            return <div className="cell medium-10 content">
                <ul>
                    { cleanArray.map((place, i)=>{
                        return <li key={i}
                                   onClick={
                                       (e)=>{
                                           e.preventDefault();
                                           this.clickHandler.bind(this)(place['place_id'],place['name'],'Places')
                                       }
                                   }>
                            {place['display_name']}
                        </li>
                    })}
                </ul>
            </div>;
        }
    }

    renderStories(mentioned){
        var storiesByPerson = [];
        if(mentioned==='mentioned'){
            storiesByPerson = this.props.storiesMentioned;
        } else{
            storiesByPerson = this.props.stories;
        }
        if(storiesByPerson.length === 0){ //if there are no associated stories
            return <div className="cell medium-10 content">
                <div className="callout alert">
                    <h6>There are no {mentioned} stories.</h6>
                </div>
            </div>;
        } else {
            return <div className="cell medium-10 content">
                <ul>
                    { storiesByPerson.map((story, i)=>{
                        return <li key={i}
                                   onClick={
                                       (e)=>{
                                           e.preventDefault();
                                           this.clickHandler.bind(this)(story['story_id'],story['full_name'],'Stories')
                                       }
                                   }>
                            {story['full_name']}
                        </li>
                    })}
                </ul>
            </div>;
        }

    }

    renderBiography(){
        var personData = this.props.bio;
        return <div className="cell medium-10 content">
            <div className="grid-y">
                <div className="cell medium-3">
                    <div className="grid-x informant-bio-container">
                        <img src={require(`./informant_images/${[90,123,150,235,241].includes(this.props.object['informant_id'])? String(this.props.object['informant_id']) + '.jpg' : 'noprofile.png'}`)}
                             className="cell medium-6"/>
                        <div className="cell medium-6 details">
                            <div><b>Born</b> {personData['birth_date']}</div>
                            <div><b>Died</b> {personData['death_date']}</div>
                            <div><b>ID#</b> {String(this.props.object['informant_id'])}</div>
                            <a onClick={(e)=>{
                                e.preventDefault();
                                // console.log(personData);
                                this.clickHandler.bind(this)(personData['person_id'],personData['full_name'],'People')
                            }} className="button">Informant Page</a>
                        </div>
                    </div>
                </div>
                <div className="cell medium-9 biography">
                    {personData['intro_bio']}
                </div>
            </div>
        </div>
    }

    render() {

        return (
            <div className="medium-1 RightBar cell">
                <div className="grid-y">
                    <SlidingPane
                        className='right-bar full'
                        overlayClassName='some-custom-overlay-class'
                        isOpen={ this.state.isPaneOpen }
                        width='35vw'
                        onRequestClose={ () => {
                            // triggered on "<" on left top click or on outside click
                            this.setState({
                                isPaneOpen: false,
                                people:false,
                                bio:false,
                                places:false,
                                stories:false,
                                storiesMentioned:false,
                            });
                        } }>
                        <div className="grid-x control-container">
                            {/*side bar controls*/}
                            <div className="cell medium-2 controls">
                                <div className="grid-y">
                                    {this.renderControls()}
                                </div>
                            </div>
                            {/*side bar contents*/}
                            {this.renderContent()}
                        </div>
                    </SlidingPane>
                    {this.renderControls()}
                </div>
            </div>

        );
    }
}

export default RightBar;