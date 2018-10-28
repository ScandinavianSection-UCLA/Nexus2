import React, {Component} from "react";
import RightBar from "../RightBar/RightBar";
import "./PeopleView.css";
import {getPlacesByID, OccupationDictionary} from "../../displayArtifactModel";
import {arrayTransformation, setPlaceIDList} from "../../utils";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";

class PeopleView extends Component {
    constructor () {
        super();
        this.state = {
            "PeopleObject": {},
            "PeoplePath": "",
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id, name, type) {
        this.props.addID(id, name, type);
    }

    getOccupation() {
        var {person} = this.props;
        var person_job = "";
        console.log({person});

        if (person.occupations != null) {
            if (Array.isArray(person.occupations.occupation)) {
                person.occupations.occupation.forEach(function (person_occupation) {
                    OccupationDictionary.forEach(function (occupation) {
                        if (occupation.ID === person_occupation.occupation_id) {
                            person_occupation.occupation_name = occupation.occupation;
                        }
                    });
                    // add the job to our string of jobs
                    person_job += `${person_occupation.occupation_name}, `;
                });
                // trim off the trailing ", "
                person_job = person_job.substr(0, person_job.length - 2);
                console.log({person_job})
            } else {
                OccupationDictionary.forEach(function (occupation) {
                    if (occupation.ID === person.occupations.occupation.occupation_id) {
                        person.occupations.occupation.occupation_name = occupation.occupation;
                    }
                    person_job = person.occupations.occupation.occupation_name;
                });

                console.log("person_job_else", person.occupations.occupation.occupation_name);
            }
        } else {
            person_job = "No Occupation";
        }
        return person_job;
    }

    render() {
        var {
            birth_date,
            death_date,
            full_name,
            intro_bio,
            person_id,
            places,
            stories,
        } = this.props.person;
        console.log({"person": this.props.person});
        var PlacesArray = setPlaceIDList(arrayTransformation(places, "Places"));
        PlacesArray = PlacesArray.map(placeID => getPlacesByID(placeID));
        const person_job = this.getOccupation();
        console.log({places});
        return (
            <div className="PeopleView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{marginTop: "-1.7%", marginRight: "1%"}} src="https://png.icons8.com/windows/64/000000/contacts.png" alt="person icon" />
                    <h2 style={{fontWeight: "bold", display: "inline-block"}}>{full_name}</h2>
                </div>
                <div className="cell medium 11">
                    <div className="grid-x" >
                        <div className="medium-7 cell">
                            <div className="grid-y info-wrap">
                                <div className="cell medium-5">
                                    <div className="grid-x informant-bio-container">
                                        <img src={require(`../RightBar/informant_images/${[90, 123, 150, 235, 241].includes(person_id) ? `${person_id}.jpg` : "noprofile.png"}`)}
                                            className="cell medium-4" alt="Person" />
                                        <div className="cell medium-8 details">
                                            <div className="detail-item"><b>Born</b> {birth_date}</div>
                                            <div className="detail-item"><b>Died</b> {death_date}</div>
                                            <div className="detail-item"><b>ID#</b> {person_id}</div>
                                            <div className="detail-item"><b>Occupation (Eng/Dansk):</b> {person_job}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cell medium-7 wrapper person">
                                    <div className="person-bio">
                                        {intro_bio}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="medium-4 cell">
                            <MapView places={PlacesArray} />
                        </div>
                        <RightBar view={"People"}
                            stories={stories}
                            places={places}
                            passID={this.clickHandler}
                        > </RightBar>
                    </div>
                </div>
            </div>
        );
    }
}

// ensure that we get our standard person object passed
// https://github.com/ScandinavianSection-UCLA/Nexus2/wiki/3.-Data-Structure#people-object
PeopleView.propTypes = {
    "person": PropTypes.shape({
        "birth_date": PropTypes.string.isRequired,
        "core_informant": PropTypes.number,
        "death_date": PropTypes.string.isRequired,
        "first_name": PropTypes.string,
        "fullbio": PropTypes.string,
        "full_name": PropTypes.string.isRequired,
        "gender": PropTypes.oneOf(["N/A", "m", "f"]),
        "image": PropTypes.string,
        "intro_bio": PropTypes.string.isRequired,
        "last_name": PropTypes.string,
        "occupations": PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]).isRequired,
        "person_id": PropTypes.number.isRequired,
        "places": PropTypes.array.isRequired,
        "stories": PropTypes.array.isRequired,
    }).isRequired,
};

// define any necessary missing values
PeopleView.defaultProps = {
    "person": {
        "birth_date": "",
        "death_date": "",
        "full_name": "",
        "intro_bio": "",
        "occupations": null,
        "person_id": null,
        "places": [],
        "stories": [],
    },
};

export default PeopleView;
