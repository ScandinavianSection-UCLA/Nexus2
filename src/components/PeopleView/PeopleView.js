/**
 * Created by danielhuang on 2/6/18.
 */
import React, { Component } from 'react';
import RightBar from '../RightBar/RightBar'
import './PeopleView.css'
import {getPlacesByID} from "../TabViewer/model";
import {setPlaceIDList} from "../../utils";
import {arrayTransformation} from "../RightBar/model";
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
        var newItem = [
            {
                "ID": 1,
                "occupation": "aftægtskone",
                "": ""
            },
            {
                "ID": 2,
                "occupation": "aftægtsmand",
                "": ""
            },
            {
                "ID": 3,
                "occupation": "almisselem",
                "": ""
            },
            {
                "ID": 4,
                "occupation": "amtsrådsmedlem",
                "": ""
            },
            {
                "ID": 5,
                "occupation": "Anders Højbjærgs kone",
                "": ""
            },
            {
                "ID": 6,
                "occupation": "bane formand",
                "": ""
            },
            {
                "ID": 7,
                "occupation": "bissekræmmer",
                "": ""
            },
            {
                "ID": 8,
                "occupation": "C. A. Kondrups kone",
                "": ""
            },
            {
                "ID": 9,
                "occupation": "Cand. Theol.",
                "": ""
            },
            {
                "ID": 10,
                "occupation": "Clog maker",
                "": ""
            },
            {
                "ID": 11,
                "occupation": "dyrlæge",
                "": ""
            },
            {
                "ID": 12,
                "occupation": "enke",
                "": ""
            },
            {
                "ID": 13,
                "occupation": "fader var lærer",
                "": ""
            },
            {
                "ID": 14,
                "occupation": "fattighuslem",
                "": ""
            },
            {
                "ID": 15,
                "occupation": "fattiglem",
                "": ""
            },
            {
                "ID": 16,
                "occupation": "felbereder",
                "": ""
            },
            {
                "ID": 17,
                "occupation": "field worker",
                "": ""
            },
            {
                "ID": 18,
                "occupation": "fisker",
                "": ""
            },
            {
                "ID": 19,
                "occupation": "forhen. Ridedreng",
                "": ""
            },
            {
                "ID": 20,
                "occupation": "forstander",
                "": ""
            },
            {
                "ID": 21,
                "occupation": "Fru",
                "": ""
            },
            {
                "ID": 22,
                "occupation": "gaardmand",
                "": ""
            },
            {
                "ID": 23,
                "occupation": "gårdejer",
                "": ""
            },
            {
                "ID": 24,
                "occupation": "Gårdmand",
                "": ""
            },
            {
                "ID": 25,
                "occupation": "gårdmand (forhenværende gårdejer)",
                "": ""
            },
            {
                "ID": 26,
                "occupation": "gårdmandsdatter",
                "": ""
            },
            {
                "ID": 27,
                "occupation": "gårdmandskone",
                "": ""
            },
            {
                "ID": 28,
                "occupation": "gårdmandssøn",
                "": ""
            },
            {
                "ID": 29,
                "occupation": "Guddum fattiggård",
                "": ""
            },
            {
                "ID": 30,
                "occupation": "Housewife",
                "": ""
            },
            {
                "ID": 31,
                "occupation": "Husejer",
                "": ""
            },
            {
                "ID": 32,
                "occupation": "huskone",
                "": ""
            },
            {
                "ID": 33,
                "occupation": "husmand",
                "": ""
            },
            {
                "ID": 34,
                "occupation": "Husmand og signetstikker",
                "": ""
            },
            {
                "ID": 35,
                "occupation": "husmandsdatter",
                "": ""
            },
            {
                "ID": 36,
                "occupation": "husmoder",
                "": ""
            },
            {
                "ID": 37,
                "occupation": "Hustru",
                "": ""
            },
            {
                "ID": 38,
                "occupation": "indsidder",
                "": ""
            },
            {
                "ID": 39,
                "occupation": "Iver Bundgård Skades hustru",
                "": ""
            },
            {
                "ID": 40,
                "occupation": "J.P. Larsens hustru",
                "": ""
            },
            {
                "ID": 41,
                "occupation": "jomfru",
                "": ""
            },
            {
                "ID": 42,
                "occupation": "jordemoder",
                "": ""
            },
            {
                "ID": 43,
                "occupation": "Journeyman miller",
                "": ""
            },
            {
                "ID": 44,
                "occupation": "Kirkestilling ved Slagelse",
                "": ""
            },
            {
                "ID": 45,
                "occupation": "Kjæltringsfolket",
                "": ""
            },
            {
                "ID": 46,
                "occupation": "klog mand",
                "": ""
            },
            {
                "ID": 47,
                "occupation": "klogmand",
                "": ""
            },
            {
                "ID": 48,
                "occupation": "Købmand",
                "": ""
            },
            {
                "ID": 49,
                "occupation": "Købmands kone",
                "": ""
            },
            {
                "ID": 50,
                "occupation": "Kone",
                "": ""
            },
            {
                "ID": 51,
                "occupation": "kostebinder",
                "": ""
            },
            {
                "ID": 52,
                "occupation": "Lærer",
                "": ""
            },
            {
                "ID": 53,
                "occupation": "Lærer (pens)",
                "": ""
            },
            {
                "ID": 54,
                "occupation": "Lærer",
                "": "mange år biskolelærer ved Sunds 4 biskoler"
            },
            {
                "ID": 55,
                "occupation": "Lærers kone",
                "": ""
            },
            {
                "ID": 56,
                "occupation": "Lars Jensens kone",
                "": ""
            },
            {
                "ID": 57,
                "occupation": "madam",
                "": ""
            },
            {
                "ID": 58,
                "occupation": "mejerist",
                "": ""
            },
            {
                "ID": 59,
                "occupation": "Møller",
                "": ""
            },
            {
                "ID": 60,
                "occupation": "Niels Pedersens kone",
                "": ""
            },
            {
                "ID": 61,
                "occupation": "par gamle mænd",
                "": ""
            },
            {
                "ID": 62,
                "occupation": "pastor",
                "": ""
            },
            {
                "ID": 63,
                "occupation": "Pensioner",
                "": ""
            },
            {
                "ID": 64,
                "occupation": "Pjaltekræmmer",
                "": ""
            },
            {
                "ID": 65,
                "occupation": "Præst",
                "": ""
            },
            {
                "ID": 66,
                "occupation": "Ridedreng",
                "": ""
            },
            {
                "ID": 67,
                "occupation": "røgter",
                "": ""
            },
            {
                "ID": 68,
                "occupation": "skovfoged",
                "": ""
            },
            {
                "ID": 69,
                "occupation": "skrædder",
                "": ""
            },
            {
                "ID": 70,
                "occupation": "small holder",
                "": ""
            },
            {
                "ID": 71,
                "occupation": "Smed",
                "": ""
            },
            {
                "ID": 72,
                "occupation": "Smed og et par andre mænd",
                "": ""
            },
            {
                "ID": 73,
                "occupation": "Snedker",
                "": ""
            },
            {
                "ID": 74,
                "occupation": "sognefoged",
                "": ""
            },
            {
                "ID": 75,
                "occupation": "søn ejede Rask Mølle",
                "": ""
            },
            {
                "ID": 76,
                "occupation": "spillemand (omvandrende)",
                "": ""
            },
            {
                "ID": 77,
                "occupation": "stationsforstander",
                "": ""
            },
            {
                "ID": 78,
                "occupation": "Sygpige",
                "": ""
            },
            {
                "ID": 79,
                "occupation": "Tømrer",
                "": ""
            },
            {
                "ID": 80,
                "occupation": "træskomand",
                "": ""
            },
            {
                "ID": 81,
                "occupation": "Turner",
                "": ""
            },
            {
                "ID": 82,
                "occupation": "Uddeler",
                "": ""
            },
            {
                "ID": 83,
                "occupation": "wheatbread woman",
                "": ""
            },
            {
                "ID": 84,
                "occupation": "ungkarl",
                "": ""
            },
            {
                "ID": 85,
                "occupation": "Gartner",
                "": ""
            },
            {
                "ID": 86,
                "occupation": "skomager",
                "": ""
            }
        ]; //json of occupations and occupation IDs


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
                                            <div className="detail-item"><b>Occupation</b> {String(person_job)}</div>
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