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
                bio:false,
                places:false,
                stories:false,
            }
        };

    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    PPSClickHandler(section){
        this.setState((oldState)=>{
            oldState.isActive = {
                bio:false,
                places:false,
                stories:false,
            };
            oldState.isActive[section] = true;
            console.log(section);
            return {
                isPaneOpen: true,
                isActive:oldState.isActive,
            };
        }); //make side bar appear
    }

    renderContent(){
        if(this.state.isActive['bio']){
            return this.renderBiography();
        } else if(this.state.isActive['places']){
            return this.renderPlaces();
        } else if(this.state.isActive['stories']){
            return this.renderStories();
        }
    }

    renderPlaces(){
        var cleanArray = arrayTransformation(this.props.story['places']['place']);
        return <div className="cell medium-10 content">
            <ul>
                { cleanArray.map((place, i)=>{
                    return <li key={i}>
                            {place['display_name']}
                    </li>
                })}
            </ul>
        </div>;
    }

    renderStories(){
        // var personData = getPeopleByID(this.props.story['informant_id']);
        var storiesByPerson = getPeopleByID(this.props.story['informant_id'])['stories'];
        return <div className="cell medium-10 content">
            <ul>
                { storiesByPerson.map((story, i)=>{
                    return <li key={i}>
                        {story['full_name']}
                    </li>
                })}
            </ul>
        </div>;
    }

    renderBiography(){
        var imgURL = '';
        var informantImgs = [90,123,150,235,241];
        if(this.props.story['informant_id'] === 90 || this.props.story['informant_id'] === 123 || this.props.story['informant_id'] === 150
            || this.props.story['informant_id'] === 235 || this.props.story['informant_id'] === 241){
            imgURL = './informant_images/' + String(this.props.story['informant_id']) + '.jpg';
            imgURL = `./informant_images/ ${[90,123,150,235,241].includes(this.props.story['informant_id'])? String(this.props.story['informant_id']) + '.jpg' : 'noprofile.jpg'}`
        } else {
            imgURL= './informant_images/noprofile.jpg';
        }

        // ()=>{if(this.props.story['informant_id'] === 90 || this.props.story['informant_id'] === 123 || this.props.story['informant_id'] === 150
        //     || this.props.story['informant_id'] === 235 || this.props.story['informant_id'] === 241){
        //     require('./informant_images/' + String(this.props.story['informant_id']) + '.jpg');
        // } else {
        //     return "https://png.icons8.com/wired/64/000000/circled-user.png";
        // }}

        // require(`./informant_images/${[90,123,150,235,241].includes(this.props.story['informant_id'])? String(this.props.story['informant_id']) + '.jpg' : 'noprofile.png'}`)

        var personData = getPeopleByID(this.props.story['informant_id']);
        return <div className="cell medium-10 content">
            <div className="grid-y">
                <div className="cell medium-3">
                    <div className="grid-x informant-bio-container">
                        <img src={require(`./informant_images/${[90,123,150,235,241].includes(this.props.story['informant_id'])? String(this.props.story['informant_id']) + '.jpg' : 'noprofile.png'}`)}
                             className="cell medium-4"/>
                        <div className="cell medium-8 details">
                            <div><b>Born</b> {personData['birth_date']}</div>
                            <div><b>Died</b> {personData['death_date']}</div>
                            <div><b>ID#</b> {String(this.props.story['informant_id'])}</div>
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
                <div className="pps grid-y">
                    <SlidingPane
                        className='right-bar full'
                        overlayClassName='some-custom-overlay-class'
                        isOpen={ this.state.isPaneOpen }
                        width='35vw'
                        onRequestClose={ () => {
                            // triggered on "<" on left top click or on outside click
                            this.setState({ isPaneOpen: false });
                        } }>
                        <div className="grid-x control-container">
                            {/*side bar controls*/}
                            <div className="cell medium-2 controls">
                                <div className="grid-y">
                                    <div style={{marginTop:'150%', marginBottom:'20%'}}
                                         className={"medium-2 cell bio "+`${this.state.isActive['bio'] ? 'active' : ''}`}
                                         onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('bio')}}>
                                        <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                                             className="icon"
                                             alt="person"/>
                                        <br/>
                                        <div className="icon-label">{this.props.story['informant_first_name']} {this.props.story['informant_last_name']}</div>
                                    </div>
                                    <div className={"medium-2 cell places "+`${this.state.isActive['places'] ? 'active' : ''}`}
                                         onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('places')}}>
                                        <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                                             className="icon"
                                             alt="location"/>
                                        <br/>
                                        <div className="icon-label">Places</div>
                                    </div>
                                    <div className={"medium-2 cell stories "+`${this.state.isActive['stories'] ? 'active' : ''}`}
                                         onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('stories')}}>
                                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                                             className="icon"
                                             alt="stories" />
                                        <br/>
                                        <div className="icon-label">Stories</div>
                                    </div>
                                </div>
                            </div>
                            {/*side bar contents*/}
                            {this.renderContent()}
                        </div>
                    </SlidingPane>

                    <div style={{marginTop:'150%', marginBottom:'20%'}} className="medium-2 cell"
                         onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('bio')}}>
                        <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                             className="icon"
                             alt="person"/>
                        <br/>
                        <div className="icon-label">{this.props.story['informant_first_name']} {this.props.story['informant_last_name']}</div>
                    </div>
                    <div className="medium-2 cell"
                         onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('places')}}>
                        <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                             className="icon"
                             alt="location"/>
                        <br/>
                        <div className="icon-label">Places</div>
                    </div>
                    <div className="medium-2 cell"
                         onClick={(e)=>{ e.preventDefault(); this.PPSClickHandler.bind(this)('stories')}}>
                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                             className="icon"
                             alt="stories" />
                        <br/>
                        <div className="icon-label">Stories</div>
                    </div>
                </div>
            </div>

        );
    }
}

export default RightBar;