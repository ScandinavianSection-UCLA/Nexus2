/**
 * Created by danielhuang on 2/10/18.
 */
import React, { Component } from 'react';
import './FieldtripView.css'

class FieldtripView extends Component {

    constructor(){
        super();
        this.renderPeople = this.renderPeople.bind(this);
        this.renderPlaces = this.renderPlaces.bind(this);
        this.renderStories = this.renderStories.bind(this);
        this.renderResults = this.renderResults.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    renderStories(){
        return <div className="results">
            <h3>Stories Collected</h3>
            <ul>
                {this.props.fieldtrip['stories_collected'].map((story,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(story['story_id'],story['full_name'],'Stories')}
                    }>{story.full_name}</li>
                })}
            </ul>
        </div>;
    }
    renderPlaces(){
        return <div className="results">
            <h3>Places Visited</h3>
            <ul>
                {this.props.fieldtrip['places_visited'].map((place,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(place['place_id'],place['name'],'Places')}
                    }>{place.full_name}</li>
                })}
            </ul>
        </div>;
    }

    renderPeople(){
        return <div className="results">
            <h3>People Visited</h3>
            <ul>
                {this.props.fieldtrip['people_visited'].map((person,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(person['person_id'],person['full_name'],'People')}
                    } >{person.full_name}</li>
                })}
            </ul>
        </div>;
    }

    renderResults(){
        if(this.props.fieldtrip['people_visited']!==[] && this.props.fieldtrip['places_visited'] !== [] && this.props.fieldtrip['stories_collected'] !== []){
            return <div>
                {this.renderPeople()}
                {this.renderPlaces()}
                {this.renderStories()}
            </div>;
        } else if(this.props.fieldtrip['people_visited']!==[] && this.props.fieldtrip['places_visted'] !== []){
            return <div>
                {this.renderPeople()}
                {this.renderPlaces()}
            </div>;
        } else if(this.props.fieldtrip['people_visited']!==[] && this.props.fieldtrip['stories_collected'] !== []){
            return <div>
                {this.renderPeople()}
                {this.renderStories()}
            </div>;
        } else if(this.props.fieldtrip['places_visited'] !== [] && this.props.fieldtrip['stories_collected'] !== []){
            return <div>
                {this.renderPlaces()}
                {this.renderStories()}
            </div>;
        } else if(this.props.fieldtrip['places_visited'] !== []){
            return <div>
                {this.renderPlaces()}
            </div>;
        } else if(this.props.fieldtrip['stories_collected'] !== []){
            return <div>
                {this.renderStories()}
            </div>;
        } else if(this.props.fieldtrip['people_visited'] !== []){
            return <div>
                {this.renderPeople()}
            </div>;
        } else {
            return <h4>Nothing to show</h4>
        }
    }

    render() {
        return (
            <div className="FieldtripView grid-x">
                <div className="medium-8 cell">
                    <h3>{this.props.fieldtrip['fieldtrip_name']}</h3>
                    <h4>{this.props.fieldtrip['start_date']} to {this.props.fieldtrip['end_date']}</h4>
                </div>
                <div className="medium-4">
                    {this.renderResults()}
                </div>
            </div>
        );
    }
}

export default FieldtripView;