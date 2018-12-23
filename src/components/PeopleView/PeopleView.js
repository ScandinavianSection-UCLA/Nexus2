/**
 * Created by danielhuang on 2/6/18.
 */
import React, {Component} from "react";
import RightBar from "../RightBar/RightBar";
import "./PeopleView.css";
import {getPlacesByID, OccupationDictionary} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation, getPlaceIDList} from "../../utils";
import MapView from "../MapView/MapView";
// prop validation
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

const CIToChapterID = {
    1 : 6,
    2 : 7,
    3 : 8,
    4 : 9,
    5 : 10,
};

class PeopleView extends Component {
    getOccupation() {
        // get the person we are using
        let {person} = this.props;
        // assuming we have occupations
        if (person.occupations !== null) {
            // get the occupations
            let jobList = person.occupations.occupation;
            // if it's a single job, turn it into a single element array
            jobList = arrayTransformation(jobList);
            // for each of the jobs
            jobList.forEach(function(occupation) {
                // set its name to be that of the matching job in the occupation dictionary
                occupation.occupation_name = OccupationDictionary.find((testOccupation) => testOccupation.ID === occupation.occupation_id).occupation;
            });
            // for the list of jobs
            return jobList
                // combine them into a comma and space separate string
                .reduce((res, job) => `${res}, ${job.occupation_name}`, "")
                // and remove the initial comma and space
                .substring(2);
        } else {
            // no job, alert this
            return "No Occupation";
        }
    }

    openCoreInformantTab(){
        console.log('hi');
        if(this.props.person.hasOwnProperty("core_informant")){
            let CoreInformantID = this.props.person['core_informant'];
            if(CoreInformantID > 0 && CoreInformantID <= 5){
                let QueryID = CIToChapterID[CoreInformantID];
                this.props.tabViewerActions.addTab(QueryID, this.props.person['full_name'], "Book");
            }
        }
    }

    render() {
        console.log(this.props.person);
        let Places = [];
        this.props.person.places.forEach((place)=>{
            var Place = {
                ...getPlacesByID(place.place_id),
                display_name:place.display_name,
            };
            Places.push(Place);
        });
        return (
            <div className="PeopleView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{"marginTop": "-1.7%", "marginRight": "1%"}} src="https://png.icons8.com/windows/64/000000/contacts.png" alt="person icon" />
                    <h2 style={{"fontWeight": "bold", "display": "inline-block"}}>{this.props.person.full_name}</h2>
                </div>
                <div className="cell medium 11">
                    <div className="grid-x" >
                        <div className="medium-7 cell">
                            <div className="grid-y info-wrap">
                                <div className="cell medium-5">
                                    <div className="grid-x informant-bio-container">
                                        <img src={require(`../RightBar/informant_images/${[90, 123, 150, 235, 241].includes(this.props.person.person_id) ? `${this.props.person.person_id}.jpg` : "noprofile.png"}`)}
                                            className="cell medium-4" alt="Person" />
                                        <div className="cell medium-8 details">
                                            <div className="detail-item"><b>Born</b> {this.props.person.birth_date}</div>
                                            <div className="detail-item"><b>Died</b> {this.props.person.death_date}</div>
                                            <div className="detail-item"><b>ID#</b> {this.props.person.person_id}</div>
                                            <div className="detail-item"><b>Occupation (Eng/Dansk):</b> {this.getOccupation()}</div>
                                            <buttom className="button primary"
                                                onClick={(e)=>{e.preventDefault(); this.openCoreInformantTab.bind(this)()}}
                                            >Full Biography</buttom>
                                        </div>
                                    </div>
                                </div>
                                <div className="cell medium-7 wrapper person-bio">
                                    {this.props.person.intro_bio}
                                </div>
                            </div>
                        </div>
                        <div className="medium-4 cell map-wrapper">
                            <MapView places={
                                Places
                            } view="People"/>
                        </div>
                        <RightBar
                            view="People"
                            stories={this.props.person.stories}
                            places={this.props.person.places}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

PeopleView.propTypes = {
    "person": PropTypes.shape({
        "birth_date": PropTypes.string.isRequired,
        "core_informant": PropTypes.number,
        "death_date": PropTypes.string.isRequired,
        "first_name": PropTypes.string,
        "fullbio": PropTypes.string,
        "full_name": PropTypes.string.isRequired,
        "gender": PropTypes.string,
        "last_name": PropTypes.string,
        "image": PropTypes.string,
        "intro_bio": PropTypes.string.isRequired,
        "occupations": PropTypes.object,
        "person_id": PropTypes.number.isRequired,
        "places": PropTypes.array.isRequired,
        "stories": PropTypes.array.isRequired,
        // must have tabViewerActions to open up a new book tab
        "tabViewerActions": PropTypes.object.isRequired,
    }),
};

function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "tabViewerActions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PeopleView);
