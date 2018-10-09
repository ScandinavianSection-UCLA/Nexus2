/**
 * Created by danielhuang on 4/14/18.
 */
import React, { Component } from 'react';
import {addNode} from "../UserNexus/UserNexusModel";
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import './RightBar.css'

class RightBar extends Component {

    constructor() {
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

    clickHandler(id,name,type,item) {
        console.log(this.props);
        addNode(id,name,type,item);
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
        }); // make side bar appear
    }

    renderControls() {
        // If place is selected, then create tabs for people, stories that mentioned it, and stories collected
        if (this.props.view === 'Places') {
            // First <div> is the people tab
            // Second <div> is the stories that mention it tab
            // Third <div> is the stories collected tab
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
        } else if (this.props.view === 'Stories') { // If story is selected, then create tabs for author, places, and stories
            // First <div> is the author tab
            // Second <div> is the places tab
            // Third <div> is the stories tab
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
        } else if (this.props.view === 'People') { // If person selected, then create tabs for places and stories
            // First <div> is the plaes tab
            // Second <div> is the stories tab
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

    renderContent() {
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

    renderPeople() {
        if(this.props.people.length===0){
            return <div className="cell medium-10 large-9 content">
                <div className="callout alert">
                    <h6>There are no associated people.</h6>
                </div>
            </div>
        } else {
            return <div className="cell medium-10 large-9 content">
                <ul>
                    {this.props.people.map((person, i) => {
                        return <li key={i} onClick={
                            (e)=>{
                                e.preventDefault();
                                this.clickHandler.bind(this)(person['person_id'],person['full_name'],'People',person)
                                }
                            }
                        >{person['full_name']}</li>
                    })}
                </ul>
            </div>
        }
    }

    renderPlaces() {
        console.log(this.props.places);
        var cleanArray = this.props.places;
        if (!(cleanArray instanceof Array)) {
          cleanArray = [cleanArray]
        }
        if(cleanArray.length === 0){
            return <div className="cell medium-10 large-9 content">
                <div className="callout alert">
                    <h6>There are no associated places.</h6>
                </div>
            </div>
        } else {
            return <div className="cell medium-10 large-9 content">
                <ul>
                    { cleanArray.map((place, i)=>{
                        return <li key={i}
                                   onClick={
                                       (e)=>{
                                           e.preventDefault();
                                           this.clickHandler.bind(this)(place['place_id'],place['name'],'Places', place)
                                       }
                                   }>
                            {place['display_name']}
                        </li>
                    })}
                </ul>
            </div>;
        }
    }

    renderStories(mentioned) {
        var storiesByPerson = [];
        if(mentioned==='mentioned'){
            storiesByPerson = this.props.storiesMentioned;
        } else{
            storiesByPerson = this.props.stories;
        }
        if(storiesByPerson.length === 0){ // if there are no associated stories
            return <div className="cell medium-10 large-9 content">
                <div className="callout alert">
                    <h6>There are no {mentioned} stories.</h6>
                </div>
            </div>;
        } else {
            return <div className="cell medium-10 large-9 content">
                <ul>
                    { storiesByPerson.map((story, i)=>{
                        return <li key={i}
                                   onClick={
                                       (e)=>{
                                           e.preventDefault();
                                           this.clickHandler.bind(this)(story['story_id'],story['full_name'],'Stories', story)
                                       }
                                   }>
                            {story['full_name']}
                        </li>
                    })}
                </ul>
            </div>;
        }

    }

    renderBiography() {
        var personData = this.props.bio;
        return <div className="cell medium-10 large-9 content">
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
                                this.clickHandler.bind(this)(personData['person_id'],personData['full_name'],'People', personData)
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
        console.log("right bar", this.props);
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
                            <div className="cell medium-2 large-3 controls">
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
