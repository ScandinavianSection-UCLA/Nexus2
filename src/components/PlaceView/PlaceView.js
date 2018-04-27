/**
 * Created by danielhuang on 2/7/18.
 */
import React, { Component } from 'react';
import RightBar from '../RightBar/RightBar'
import './PlaceView.css'
import MapView from "../MapView/MapView";

class PlaceView extends Component {

    constructor(){
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    render() {

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

        return (
            <div className="PlaceView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{marginTop:'-1.7%', marginRight:'1%'}} src="https://png.icons8.com/windows/48/000000/marker.png" alt="location icon"/>
                    <h2 style={{fontWeight:'bold',display:'inline-block'}}>{this.props.place.name}</h2>
                </div>
                <div className="medium-11">
                    <div className="grid-x place-content-wrapper">
                        <div className="medium-11 cell">
                            {/*<div className="cell">*/}
                                {/*<h3 className="medium-3 cell">Visited During</h3>*/}
                            {/*</div>*/}
                            <MapView places={[this.props.place]}/>
                        </div>
                        <RightBar view={'Places'} stories={storyCollected} storiesMentioned={storyMentioned} people={peopleList}
                                  passID={this.clickHandler}/>
                    </div>
                </div>

            </div>
        );
    }
}

export default PlaceView;