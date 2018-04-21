/**
 * Created by danielhuang on 2/7/18.
 */
import React, { Component } from 'react';
import RightBar from '../RightBar/RightBar'
import './PlaceView.css'

class PlaceView extends Component {

    constructor(){
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    render() {
        console.log(this.props.place);
        var storyCollected = [];
        var storyMentioned = [];
        var peopleList =[];
        if('people' in this.props.place){
            peopleList = this.props.place.people;
        }
        if('storiesCollected' in this.props.place){
            storyCollected = this.props.place['storiesCollected']
        }
        if('storiesMentioned' in this.props.place){
            storyMentioned = this.props.place['storiesMentioned']
        }
        console.log(storyCollected,storyMentioned,peopleList);
        return (
            <div className="PlaceView grid-x">
                <div className="tab-header cell">
                    <img style={{marginTop:'-1.7%'}} src="https://png.icons8.com/windows/32/000000/marker.png" alt="location icon"/>
                    <h1 style={{fontWeight:'bold',display:'inline-block'}}>{this.props.place.name}</h1>
                </div>
                <div className="medium-11 cell">
                    <div className="cell">
                        <h3 className="medium-3 cell">Visited During</h3>
                    </div>
                </div>
                <RightBar view={'Places'} stories={storyCollected} storiesMentioned={storyMentioned} people={peopleList}
                passID={this.clickHandler}/>
            </div>
        );
    }
}

export default PlaceView;