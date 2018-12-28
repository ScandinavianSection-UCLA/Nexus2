import "./FieldtripTool.css";
import React from "react";
import MapView from "../MapView/MapView";
import {getFieldtripsByID, getPlacesByID} from "../../data-stores/DisplayArtifactModel";
// import data for fieldtrips
import FieldtripsData from "../../data/cfieldtrips.json";

class FieldtripTool extends React.Component {
    constructor(props) {
        super(props);
        if (props.fieldtrip) {
            this.state = {
                "activeFieldtrips": [props.fieldtrip],
            };
        } else {
            this.state = {
                "activeFieldtrips": [],
            };
        }
    }

    handleSelect(fieldtrip_id) {
        if (fieldtrip_id === -1) {
            this.setState({
                "activeFieldtrips": FieldtripsData.fieldtrip
                    .map((fieldtrip) => fieldtrip.fieldtrip_id)
                    .filter((id) => id !== -1),
            });
        } else {
            this.setState(({activeFieldtrips}) => {
                const index = activeFieldtrips.indexOf(fieldtrip_id);
                if (index === -1) {
                    return {
                        "activeFieldtrips": [...activeFieldtrips, fieldtrip_id],
                    };
                } else if (index >= 0) {
                    activeFieldtrips.splice(index, 1);
                    return {
                        activeFieldtrips,
                    };
                } else {
                    console.warn("FieldtripTool's activeFieldtrips is corrupt", activeFieldtrips);
                    return {
                        activeFieldtrips,
                    };
                }
            });
        }
    }

    render() {
        const {activeFieldtrips} = this.state;
        console.log(activeFieldtrips);
        // get places to show as a 1-D array
        const PlacesVisited = [].concat(
            // use the fieldtrips to show
            ...activeFieldtrips.map((fieldtrip) =>
                // and extract the places from those fieldtrips
                getFieldtripsByID(fieldtrip).places_visited.map((place) => getPlacesByID(place.place_id)))
        );
        return (
            <div className="FieldtripTool grid-x">
                <div className="cell medium-3">
                    <h3>Fieldtrip Viewer</h3>
                    <ul>
                        {FieldtripsData.fieldtrip.map(({fieldtrip_id, fieldtrip_name}) => (
                            <li
                                key={fieldtrip_id}
                                className={`cell ${activeFieldtrips.includes(fieldtrip_id) ? "activeTrip" : ""}`}
                                onClick={this.handleSelect.bind(this, fieldtrip_id)}>
                                {fieldtrip_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="cell medium-9">
                    <MapView places={PlacesVisited} />
                </div>
            </div >
        );
    }
}

export default FieldtripTool;
