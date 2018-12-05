/**
 * Created by danielhuang/benrosen on 4/7/18.
 */
import React from "react";
import "./MapView.css";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import PropTypes from "prop-types";

const DEFAULT_ZOOM_LEVEL = 7;
const DEFAULT_MAP_CENTER = [56.2639, 9.5018];

class MapView extends React.Component {

    renderPopup(place){
        if('full_name' in place){
            return place['full_name'];
        } else {
            return place['name']
        }
    }

    renderMarkers(places){
        var InitialPlace = places[0];
        if(InitialPlace !== undefined){
            if('latitude' in InitialPlace){
                return places.map((place, i)=>{
                    if(place !== null){
                        let POSITION = [place.latitude, place.longitude];
                        return <Marker position={POSITION}>
                            <Popup>
                                {this.renderPopup(place)}
                            </Popup>
                        </Marker>
                    }
                })
            }
        }
    }

    defineMapCenter(){
        var InitialPlace = this.props.places[0];
        if(InitialPlace !== undefined) {
            if ('latitude' in InitialPlace && this.props.places.length < 20) {
                console.log('recentering the map!');
                return [InitialPlace.latitude,InitialPlace.longitude]
            }
        } else {
            return DEFAULT_MAP_CENTER;
        }
    }

    defineMapZoom(){
        var InitialPlace = this.props.places[0];
        if(InitialPlace !== undefined) {
            if ('latitude' in InitialPlace && this.props.places.length < 20) {
                console.log('zooming the map!');
                return 12;
            }
        } else {
            return DEFAULT_ZOOM_LEVEL;
        }
    }

    render() {
        console.log(this.props.places);

        return (
            <Map center={this.defineMapCenter.bind(this)()} zoom={this.defineMapZoom.bind(this)()}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.renderMarkers.bind(this)(this.props.places)}
            </Map>
        )
    }
}

// general properties needed for this component
MapView.propTypes = {
    "person": PropTypes.array.isRequired,
    "places": PropTypes.array.isRequired,
    "stories": PropTypes.array.isRequired,
    "height": PropTypes.string,
};

// assign defaults if not already defined
MapView.defaultProps = {
    "person": [],
    "places": [],
    "stories": [],
};

export default MapView;
