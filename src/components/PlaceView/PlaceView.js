import React, {Component} from "react";
import RightBar from "../RightBar/RightBar";
import "./PlaceView.css";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";

class PlaceView extends Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id, name, type) {
        this.props.addID(id, name, type);
    }

    render() {
        const {place} = this.props
        var {name, people, storiesCollected, storiesMentioned} = place;
        console.log(place);

        // ensure that the person is properly defined
        if (typeof people !== "undefined" && "person" in people[0]) {
            people = [people[0]["person"]];
        } else {
            // otherwise set it to be empty
            people = [];
        }
        // if storiesCollected is undefined, set it to an empty array
        if (typeof storiesCollected === "undefined") {
            storiesCollected = [];
        }
        // if storiesMentioned is undefined, set it to an empty array
        if (typeof storiesMentioned === "undefined") {
            storiesMentioned = [];
        }

        console.log(people);

        return (
            <div className="PlaceView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{marginTop: "-1.7%", marginRight: "1%"}} src="https://png.icons8.com/windows/48/000000/marker.png" alt="location icon" />
                    <h2 style={{fontWeight: "bold", display: "inline-block"}}>{name}</h2>
                </div>
                <div className="medium-11">
                    <div className="grid-x place-content-wrapper">
                        <div className="medium-11 cell">
                            {/*<div className="cell">*/}
                            {/*<h3 className="medium-3 cell">Visited During</h3>*/}
                            {/*</div>*/}
                            <MapView places={[place]} />
                        </div>
                        <RightBar view={"Places"} stories={storiesCollected} storiesMentioned={storiesMentioned} people={people}
                            passID={this.clickHandler} />
                    </div>
                </div>

            </div>
        );
    }
}

PlaceView.propTypes = {
    "place": PropTypes.shape({
        "fieldtrips": PropTypes.shape({
            "fieldtrip_id": PropTypes.array,
        }),
        "latitude": PropTypes.number,
        "longitude": PropTypes.number,
        "name": PropTypes.string.isRequired,
        "people": PropTypes.array.isRequired,
        "place_id": PropTypes.number,
        "storiesCollected": PropTypes.array.isRequired,
        "storiesMentioned": PropTypes.array.isRequired,
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
