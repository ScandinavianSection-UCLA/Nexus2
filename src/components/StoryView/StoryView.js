/**
 * Created by danielhuang on 1/28/18.
 */
import React, { Component } from 'react';
import './StoryView.css'

class StoryView extends Component {

    constructor(){
        super();
        this.state = {
            StoryObject:{},
            StoryPath:'',
            isTabOpen:[true,false,false,false],
            storyVersionOpen:[true,false,false,false,false],
            twoVersions:false,
            lastStoryVersionOpen:0,
            indexToVersion: {
                0: 'english_manuscript',
                1: 'english_publication',
                2: 'danish_manuscript',
                3: 'danish_publication',
            }
        };
        this.arrayTransformation = this.arrayTransformation.bind(this);
        this.renderStories = this.renderStories.bind(this);
        this.renderPlaces = this.renderPlaces.bind(this);
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    arrayTransformation(item){
        var finalArray=[];
        if(Array.isArray(item)){
            finalArray = item;
        } else if(typeof item === 'object'){
            finalArray.push(item);
        }
        //if item is undefined (meaning there's no people/stories/places associated) then return empty array
        return finalArray;
    }

    renderStories(){
        console.log(this.props.story['stories_mentioned'])
        if(this.props.story['stories_mentioned']!==null){
            var storyArray = this.arrayTransformation(this.props.story['stories_mentioned'].story);
            return <ul>
                {storyArray.map((story,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(story['story_id'], story['full_name'],'Stories')}
                    }>{story['full_name']}</li>
                })}
            </ul>
        } else {
            return <div className="callout alert">
                <h6>No related stories.</h6>
            </div>
        }

    }

    renderPlaces(){
        var placeArray = this.arrayTransformation(this.props.story['places'].place);
        return <div>
            <h4>Associated Places</h4>
            <ul>
                {placeArray.map((place,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(place['place_id'],place['name'],'Places')}
                    }>{place['display_name']}</li>
                })}
            </ul>
        </div>
    }

    accordionHandler(tab){
        this.setState((prevState)=>{
            prevState.isTabOpen = [false,false,false,false];
            prevState.isTabOpen[tab] = true;
            return { isTabOpen:prevState.isTabOpen }
        })
    }

    placeRecorded(){
        var cleanArray = this.arrayTransformation(this.props.story['places']['place']);
        var placeObject = {};
        cleanArray.forEach((place)=>{
            if(place['type']==='place_recorded'){
                placeObject = place;
            }
        });
        return placeObject;
    }
    placesMentioned(){
        var cleanArray = this.arrayTransformation(this.props.story['places']['place']);
        var placeObjects = [];
        cleanArray.forEach((place)=>{
            if(place['type']==='place_mentioned'){
                placeObjects.push(place)
            }
        });
        return placeObjects;
    }
    bibliographicReferences(){
        if(this.props.story['bibliography_references'] === null){
            return <div className="callout alert">
                <h6>No references for this story.</h6>
            </div>
        } else {
            return <table>
                <tbody>
                {
                    this.arrayTransformation(this.props.story['bibliography_references']['reference']).map((reference,i)=>{
                        return <tr key={i}>
                            <td>{reference['display_string']}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        }
    }

    storyViewerClickHandler(version){
        //TODO: new line breaks /n + html tags (transform character into escape characters)
        this.setState((prevState)=>{
            //check if more than 2 versions open
            var versionCount = 0;
            prevState.storyVersionOpen.forEach((ver)=>{
                if(ver){
                    versionCount++;
                }
            });
            //check if clicked version is already open, if so then close it
            if(prevState.storyVersionOpen[version] === true){
                if(versionCount >= 2){
                    prevState.storyVersionOpen[version] = false;
                }
                prevState.twoVersions = false;

                prevState.storyVersionOpen.forEach((version, i)=>{
                    if(version){
                        prevState.lastStoryVersionOpen = i;
                    }
                });
            } else {
                prevState.twoVersions = true;
                if(versionCount >= 2){
                    //close the last open version
                    prevState.storyVersionOpen[prevState.lastStoryVersionOpen] = false;
                }
                prevState.storyVersionOpen[version] = true; //open clicked version
                prevState.lastStoryVersionOpen = version; //clicked version is now the last version that was opened
            }
            return {
                storyVersionOpen:prevState.storyVersionOpen,
                lastStoryVersionOpen:prevState.lastStoryVersionOpen,
                twoVersions:prevState.twoVersions,
            }
        });
    }
    renderProperty(property){
        if(property!== null && typeof property !== 'undefined'){
            return property;
        } else {
            return 'N/A';
        }
    }
    renderComponentView(component, name){
        if(component!==null && typeof component !== 'undefined'){
            return component;
        } else {
            return <div className="callout alert">
                <h6>{name} does not exist.</h6>
            </div>
        }
    }
    PPSClickHandler(e){
        e.preventDefault();
        //make side bar appear
    }

    render() {
        return (
            <div className="StoryView grid-x">
                <div className="medium-3 cell">
                    <img src={require('./mapplaceholder.png')} alt="map"/>
                    <ul className="accordion" data-accordian>
                        <li className={`accordion-item ${this.state.isTabOpen[0] ? 'is-active':''}`}
                            onClick={(e)=>{e.preventDefault(); this.accordionHandler.bind(this)(0)}}>
                            <a href="#" className="accordion-title">Story Data</a>
                            <div className="body">
                                <b>Order Told</b> {this.renderProperty.bind(this)(this.props.story['order_told'])}<br/>
                                <b>Recorded during fieldtrip</b> {this.renderProperty.bind(this)(this.props.story['fieldtrip']['id'])}<br/>
                                <b>Fieldtrip dates</b> {this.renderProperty.bind(this)(this.props.story['fieldtrip_start_date'])} to {this.renderProperty.bind(this)(this.props.story['fieldtrip_end_date'])}<br/>
                                <b>Place recorded</b> {this.renderProperty.bind(this)(this.placeRecorded.bind(this)()['display_name'])} <br/>
                                <b>Field diary pages</b> {this.renderProperty.bind(this)(this.props.story['fielddiary_page_start'])} to {this.props.story['fielddiary_page_end']}<br/>
                                <b>Associated Keywords</b><br/>{
                                this.arrayTransformation(this.props.story['keywords']['keyword']).map((keyword,i)=>{
                                    return <div className="keyword-well" key={i}>{keyword['keyword']}</div>
                                })
                            }<br/>
                                <b>Places mentioned in story</b> {this.placesMentioned.bind(this)().map((place,i)=>{
                                    return <span key={i} className="keyword-well"> {place['name']} </span>
                                })}
                                <br/>
                            </div>
                        </li>
                        <li className={`accordion-item ${this.state.isTabOpen[1] ? 'is-active':''}`}
                            onClick={(e)=>{e.preventDefault(); this.accordionHandler.bind(this)(1)}}>
                            <a href="#" className="accordion-title">Story Indices</a>
                            <div className="body">
                                <b>Genre</b> {this.props.story['genre']['name']}<br/>
                                <b>ETK Index</b> {this.props.story['etk_index']['heading_english']}<br/>
                                <b>Tangherlini Indices</b><br/>
                                {this.arrayTransformation(this.props.story['tango_indices']['tango_index']).map((index,i)=> {
                                    return <div className="keyword-well" key={i}>{index['display_name']}</div>
                                })
                                }
                            </div>
                        </li>
                        <li className={`accordion-item ${this.state.isTabOpen[2] ? 'is-active':''}`}
                            onClick={(e)=>{e.preventDefault(); this.accordionHandler.bind(this)(2)}}>
                            <a href="#" className="accordion-title">Bibliographical References</a>
                            <div className="body">
                                {this.bibliographicReferences.bind(this)()}
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="medium-9 cell">
                    <h2 className="title">{this.props.story.full_name}</h2>
                    <h4 style={{marginLeft:'1.5%'}}>{this.props.story.informant_full_name}</h4>
                    <div className="grid-x">
                        <div className="medium-11 cell">
                            <div className="grid-padding-x">
                                <div className="story-viewer cell">
                                    <ul className=" button-group story-viewer-options">
                                        <li className={`button ${this.state.storyVersionOpen[0] ? '': 'secondary'}`}
                                            onClick={(e)=>{e.preventDefault(); this.storyViewerClickHandler.bind(this)(0)}}>English ms Translation</li>
                                        <li className={`button ${this.state.storyVersionOpen[1] ? '': 'secondary'}`}
                                            onClick={(e)=>{e.preventDefault(); this.storyViewerClickHandler.bind(this)(1)}}>English Published Version</li>
                                        <li className={`button ${this.state.storyVersionOpen[2] ? '': 'secondary'}`}
                                            onClick={(e)=>{e.preventDefault(); this.storyViewerClickHandler.bind(this)(2)}}>Danish ms Transcription</li>
                                        <li className={`button ${this.state.storyVersionOpen[3] ? '': 'secondary'}`}
                                            onClick={(e)=>{e.preventDefault(); this.storyViewerClickHandler.bind(this)(3)}}>Danish Published Version</li>
                                        {/*<li className="secondary button">Manuscript</li>*/}
                                    </ul>
                                    <div className="grid-x">
                                        { this.state.storyVersionOpen.map((version, i)=>{
                                            if(version){
                                                return <div className={`cell story ${this.state.twoVersions ? 'medium-6' : ''}`} key={i}>
                                                    <div className="card">
                                                        <div className="card-section">
                                                            {this.renderComponentView.bind(this)(this.props.story[this.state.indexToVersion[i]],'Version')}
                                                            </div>
                                                    </div>
                                                </div>
                                            }
                                        })}
                                    </div>
                                </div>
                                <div className="cell">
                                    <div className="grid-x">
                                        <div className="medium-8 cell">
                                            <div className="card annotation">
                                                <h5 className="title">Annotation</h5>
                                                <div className="card-section">
                                                    {this.renderComponentView.bind(this)(this.props.story['annotation'],'Annotation')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="medium-4 cell relatedStories">
                                            <h5 className="title">Related Stories</h5>
                                            {this.renderStories.bind(this)()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="medium-1 cell">
                            <div className="pps grid-y">
                                <div style={{marginTop:'150%', marginBottom:'20%'}} className="medium-2 cell"
                                    onClick={this.PPSClickHandler.bind(this)}>
                                    <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                                         className="icon"
                                         alt="person"/>
                                    <br/>
                                    <div className="icon-label">{this.props.story['informant_first_name']} {this.props.story['informant_last_name']}</div>
                                </div>
                                <div className="medium-2 cell"
                                     onClick={this.PPSClickHandler.bind(this)}>
                                    <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                                         className="icon"
                                         alt="location"/>
                                    <br/>
                                    <div className="icon-label">Places</div>
                                </div>
                                <div className="medium-2 cell"
                                     onClick={this.PPSClickHandler.bind(this)}>
                                    <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                                         className="icon"
                                         alt="stories" />
                                    <br/>
                                    <div className="icon-label">Stories</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default StoryView;