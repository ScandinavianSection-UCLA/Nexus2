import React, {Component} from "react";
import RightBar from "../RightBar/RightBar";
import "./FieldtripView.css";
import PropTypes from "prop-types";
import MapView from "../MapView/MapView";
import {getPlacesByID} from "../../data-stores/DisplayArtifactModel";

class FieldtripView extends Component {
    render() {
        let PlacesVisited = [];
        this.props.fieldtrip.places_visited.forEach((place)=>{
           let Place = getPlacesByID(place.place_id);
           if(Place.longitude !== null && Place.latitude !== null){
               PlacesVisited.push({
                   ...place,
                   longitude: Place.longitude,
                   latitude: Place.latitude,
               });
           }
        });
        return (
            <div className="FieldtripView grid-x">
                <div className="medium-11 cell main">
                    {/* should add more later, currently only displays timing of the fieldtrip*/}
                    <h3>{this.props.fieldtrip.fieldtrip_name}</h3>
                    <h4>{this.props.fieldtrip.start_date} to {this.props.fieldtrip.end_date}</h4>
                    <MapView places={PlacesVisited} view={"Fieldtrip"}/>
                </div>
                {/* right bar with all the relevant PPS for the fieldtrip */}
                <RightBar view="Fieldtrips"
                    people={this.props.fieldtrip.people_visited}
                    stories={this.props.fieldtrip.stories_collected}
                    places={this.props.fieldtrip.places_visited}
                    className="medium-1 cell"
                />
            </div>
        );
    }
}

// ensure that we get our standard fieldtrip object passed
// https://github.com/ScandinavianSection-UCLA/Nexus2/wiki/3.-Data-Structure#fieldtrip-object
// note that people_visited, places_visited, and stories_collected seem to be array-ified before being passed here
FieldtripView.propTypes = {
    "fieldtrip": PropTypes.shape({
        "end_date": PropTypes.string.isRequired,
        "fieldtrip_id": PropTypes.number,
        "fieldtrip_name": PropTypes.string.isRequired,
        "people_visited": PropTypes.array.isRequired,
        "places_visited": PropTypes.array.isRequired,
        "shapefile": PropTypes.string,
        "start_date": PropTypes.string.isRequired,
        "stories_collected": PropTypes.array.isRequired,
    }).isRequired,
};

// define any necessary missing values
FieldtripView.defaultProps = {
    "fieldtrip": {
        "end_date": "",
        "fieldtrip_name": "",
        "people_visited": [],
        "places_visited": [],
        "start_date": "",
        "stories_collected": [],
    },
};

export default FieldtripView;
