import React, {Component} from "react";
import RightBar from "../RightBar/RightBar";
import "./FieldtripView.css";
import PropTypes from "prop-types";
import MapView from "../MapView/MapView";
import {getPlacesByID} from "../../data-stores/DisplayArtifactModel";
// redux imports
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";
import geojsons from "../../data/ft_geojsons/combined_geojson.js";

class FieldtripView extends Component {
    render() {
        const PlacesVisited = this.props.fieldtrip.places_visited.map((place) => getPlacesByID(place.place_id));
        return (
            <div className="FieldtripView grid-x">
                <div className="medium-11 cell main">
                    <div className="grid-x">
                        <div className="heading cell medium-10">
                            <img className="h-item" src={require("./../Navigation/icons8-waypoint-map-32.png")} />
                            <h2 className="h-item">{this.props.fieldtrip.fieldtrip_name}</h2>
                            <h6 className="h-item">{this.props.fieldtrip.start_date} to {this.props.fieldtrip.end_date}</h6>
                        </div>
                        <button
                            className="fieldtripTool button primary cell medium-2"
                            onClick={() => {
                                this.props.actions.addTab(this.props.fieldtrip.fieldtrip_id, "Fieldtrip Tool", "FieldtripTool");
                            }}>Open in Fieldtrip Tool</button>
                    </div>
                    <MapView
                        className="heading"
                        places={PlacesVisited}
                        view="Fieldtrip"
                        geojsons={[geojsons[this.props.fieldtrip.fieldtrip_id].route, geojsons[this.props.fieldtrip.fieldtrip_id].stops]}
                        fieldtripID={this.props.fieldtrip.fieldtrip_id + 1}/>
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

/**
 * Set certain props to access Redux states
 * @param {Object} state All possible Redux states
 * @returns {Object} Certain states that are set on props
 */
function mapStateToProps() {
    return {};
}

/**
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldtripView);
