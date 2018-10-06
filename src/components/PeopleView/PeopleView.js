/**
 * Created by danielhuang on 2/6/18.
 */
import React, { Component } from 'react';
import RightBar from '../RightBar/RightBar'
import './PeopleView.css'
import {getPlacesByID} from "../TabViewer/model";
import {setPlaceIDList} from "../../utils";
import {arrayTransformation} from "../RightBar/model";
import {OccupationDictionary} from "./model";
import MapView from "../MapView/MapView";

class PeopleView extends Component {

    constructor(){
        super();
        this.state = {
            PeopleObject:{},
            PeoplePath:''
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);

    }

    getOccupation(){
        var items=[this.props.person];
        console.log('items',items);
        var person_job='';
        var multiple_jobs=[];
        var newItem = OccupationDictionary //json of occupations and occupation IDs


        items.forEach(function(item) {
            if(item.occupations !=null) {
                if (Array.isArray(item.occupations.occupation)){
                    item.occupations.occupation.forEach(function(occupation){
                        newItem.forEach(function(new_item){
                            if (new_item.ID === occupation.occupation_id){
                                occupation.occupation_name = new_item.occupation
                            }
                        });

                    });
                    for(var i=0; i<items[0].occupations.occupation.length;i++){
                        var job=items[0].occupations.occupation[i].occupation_name;
                        multiple_jobs.push(job);
                    }
                    multiple_jobs.toString();
                    person_job=multiple_jobs;
                    console.log("multiple jobs array",multiple_jobs)


                }

                else {
                    newItem.forEach(function (new_item) {
                        if (new_item.ID === item.occupations.occupation.occupation_id) {
                            item.occupations.occupation.occupation_name = new_item.occupation
                        }
                        person_job = items[0].occupations.occupation.occupation_name;
                    });

                    console.log('person_job_else', items[0].occupations.occupation.occupation_name);
                }
            }
            else {

                person_job = "No Occupation";
            }
        });
        return person_job;
    }

    render() {
        console.log(this.props.person);
        var cleanPlacesArray = setPlaceIDList(arrayTransformation(this.props.person['places'],'Places'));
        var PlacesArray = [];
        cleanPlacesArray.forEach((placeID) =>{
            PlacesArray.push(getPlacesByID(placeID));
        });
        var person_job = this.getOccupation();
        console.log(this.props.person['places']);
        return (
            <div className="PeopleView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{marginTop:'-1.7%', marginRight:'1%'}} src="https://png.icons8.com/windows/64/000000/contacts.png" alt="person icon"/>
                    <h2 style={{fontWeight:'bold',display:'inline-block'}}>{this.props.person['full_name']}</h2>
                </div>
                <div className="cell medium 11">
                    <div className="grid-x" >
                        <div className="medium-7 cell">
                            <div className="grid-y info-wrap">
                                <div className="cell medium-5">
                                    <div className="grid-x informant-bio-container">
                                        <img src={require(`../RightBar/informant_images/${[90,123,150,235,241].includes(this.props.person['person_id'])? String(this.props.person['person_id']) + '.jpg' : 'noprofile.png'}`)}
                                             className="cell medium-4"/>
                                        <div className="cell medium-8 details">
                                            <div className="detail-item"><b>Born</b> {this.props.person['birth_date']}</div>
                                            <div className="detail-item"><b>Died</b> {this.props.person['death_date']}</div>
                                            <div className="detail-item"><b>ID#</b> {String(this.props.person['person_id'])}</div>
                                            <div className="detail-item"><b>Occupation (Eng/Dansk):</b> {String(person_job)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cell medium-7 wrapper person">
                                    <div className="person-bio">
                                        {this.props.person['intro_bio']}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="medium-4 cell">
                            <MapView places={PlacesArray}/>
                        </div>
                        <RightBar view={'People'}
                                  stories={this.props.person['stories']}
                                  places={this.props.person['places']}
                                  passID={this.clickHandler}
                        > </RightBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default PeopleView;
