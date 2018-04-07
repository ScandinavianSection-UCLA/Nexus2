/**
 * Created by danielhuang on 2/6/18.
 */
import React, { Component } from 'react';
import './PeopleView.css'

class PeopleView extends Component {

    constructor(){
        super();
        this.state = {
            PeopleObject:{},
            PeoplePath:''
        };
        this.renderPlace = this.renderPlace.bind(this);
        this.renderStory = this.renderStory.bind(this);
        this.renderAssociatedItems = this.renderAssociatedItems.bind(this);
    }

    componentWillMount(){
        console.log('person view');
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    renderPlace(){
        return <div className="item places">
            <h3>Relevant Places</h3>
            <ul>
                {this.props.person['places'].map((place,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(place['place_id'],place['name'],'Places')}
                    }>{place.display_name}</li>
                })}
            </ul>
        </div>
    }

    renderStory(){
        return <div className="item stories">
            <h3>Relevant Stories</h3>
            <ul>
                {this.props.person['stories'].map((story,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(story['story_id'],story['full_name'],'Stories')}
                    }>{story.full_name}</li>
                })}
            </ul>
        </div>;
    }

    renderAssociatedItems(){
        console.log(this.props.person);
        var placesList = this.props.person['places'];
        var storiesList = this.props.person['stories'];
        if(placesList !== [] && storiesList !== []){
            return <div>
                {this.renderStory()}
                {this.renderPlace()}
            </div>
        } else if(placesList !== []){
            return <div>
                {this.renderPlace()}
            </div>
        } else if(storiesList !== []){
            return <div>
                {this.renderStory()}
            </div>
        }
    }

    render() {
        return (
            <div className="PeopleView grid-x">
                <div className="medium-8 cell">
                    <h3>{this.props.person['full_name']}</h3>
                    <h4>{this.props.person['birth_date']} to {this.props.person['death_date']}</h4>
                    <div>{this.props.person['intro_bio']}</div>
                </div>
                <div className="medium-4 cell associatedItems">
                    {this.renderAssociatedItems()}
                </div>
            </div>
        );
    }
}

export default PeopleView;