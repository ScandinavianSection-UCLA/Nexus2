/**
 * Created by danielhuang on 4/7/18.
 */
import React, { Component } from 'react';

import './MapView.css';


//import windowMap from './map';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import {Map, TileLayer, Marker,circleMarker, Popup,GeoJsonCluster,geoJSON,MarkerClusterGroup,onEachFeature} from 'react-leaflet-universal';





var openStreet = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }),
    oldLayer = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png',{
        attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
var baseMaps = {
    "Open Street": openStreet,
    "Old Layer": oldLayer
};
class MapView extends React.Component {


    componentDidMount() {
        // create map
        this.map = L.map(this.container, {
            center: [56.2639, 9.5018],
            zoom: 7,
            layers: [
                oldLayer, openStreet
            ]
        });

        this.updateMarkers(this.props.places);
        this.controlLayers= L.control.layers(baseMaps).addTo(this.map);
        console.log('messge test');

    }
//new L.GeoJSON.AJAX("foo.geojson")
    updateMarkers() {
        console.log(this.props);
        this.geoJson= L.geoJSON(places_geo,{
            pointToLayer: function (feature,latlng){

                if(feature.properties.place_people_person_full_name ) {
                    return L.circleMarker(latlng,{color:"#0000ff"}).bindPopup(feature.properties.place_people_person_full_name);   //using if statement here only renders points which satisfy constraint
                    // potentially useful for having it filter based off of click, tak eclikc as conditional input
                }
            }
        }).addTo(this.map);

    }
    render() {

        return (
            <div className="MapView"
                 ref={ ref => this.container = ref } />
        )
    }
}

export default MapView;