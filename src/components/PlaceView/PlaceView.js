import React, {Component} from "react";
import RightBar from "../RightBar/RightBar";
import "./PlaceView.css";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";
import {arrayTransformation} from "../../utils";

class PlaceView extends Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id, name, type) {
        this.props.addID(id, name, type);
    }

    render() {
        const {place} = this.props;
        let {name, people, storiesCollected, storiesMentioned} = place;
        // ensure that the person is properly defined
        if (typeof people !== "undefined") {
            // if so, extract the person
            people = arrayTransformation(people[0].person);
        } else {
            // otherwise set it to be empty
            people = [];
        }
        storiesCollected = arrayTransformation(storiesCollected);
        storiesMentioned = arrayTransformation(storiesMentioned);
        // // if storiesCollected is undefined, set it to an empty array
        // if (typeof storiesCollected === "undefined") {
        //     storiesCollected = [];
        // }
        // if storiesMentioned is undefined, set it to an empty array
        // if (typeof storiesMentioned === "undefined") {
        //     storiesMentioned = [];
        // }
        return (
            <div className="PlaceView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{"marginTop": "-1.7%", "marginRight": "1%"}} src="https://png.icons8.com/windows/48/000000/marker.png" alt="location icon" />
                    <h2 style={{"fontWeight": "bold", "display": "inline-block"}}>{name}</h2>
                </div>
                <div className="medium-11">
                    <div className="grid-x place-content-wrapper">
                        <div className="medium-11 cell">
                            <MapView places={[place]} />
                        </div>
                        <RightBar view="Places" stories={storiesCollected} storiesMentioned={storiesMentioned} people={people}
                            passID={this.clickHandler} />
                    </div>
                </div>

            </div>
        );
    }
}

PlaceView.propTypes = {
    "addID": PropTypes.func.isRequired,
    "place": PropTypes.shape({
        "fieldtrips": PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        "latitude": PropTypes.number,
        "longitude": PropTypes.number,
        "name": PropTypes.string.isRequired,
        "people": PropTypes.array,
        "place_id": PropTypes.number,
        "storiesCollected": PropTypes.array,
        "storiesMentioned": PropTypes.array,
    }).isRequired,
};

// define any necessary missing values
PlaceView.defaultProps = {
    "place": {
        "name": "",
        "people": [],
        "storiesCollected": [],
        "storiesMentioned": [],
    },
};

export default PlaceView;
