/**
 * Created by danielhuang on 4/7/18.
 */
import React, { Component } from 'react';

import './MapView.css';


//import windowMap from './map';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import {Map, TileLayer, Marker,circleMarker, Popup,GeoJsonCluster,geoJSON,MarkerClusterGroup,onEachFeature} from 'react-leaflet-universal';
//import AJAX from 'leaflet-ajax';
//import geojson from 'json-loader/places_geo.geojson';
const geojson = require('./places_geo.geojson');

/*
const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
        html: `<span>${cluster.getChildCount()}</span>`,
        className: 'MapView',
        iconSize: L.point(40, 40, true),
    });
}
*/
class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 56.2639,
            lng: 9.5018,
            zoom: 8,
        };
        // this.onEachFeature = this.onEachFeature.bind(this);
        this.pointToLayer = this.pointToLayer.bind(this);
    }

    addGeoJSONLayer(geojson) {

        const geojsonLayer = L.geoJson(geojson, {
            onEachFeature: this.onEachFeature,
            pointToLayer: this.pointToLayer,
            filter: this.filterFeatures
        });

        geojsonLayer.addTo(this.state.map);
    }

    pointToLayer(feature, latlng) {
        // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
        // parameters to style the GeoJSON markers
        var markerParams = {
            radius: 4,
            fillColor: 'orange',
            color: '#fff',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
        };

        return L.circleMarker(latlng, markerParams);
    }

    render(){

            const position = [this.state.lat, this.state.lng];
            return (<div className="MapView" id="MapView">
                <Map center={position} zoom={this.state.zoom}>

                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    <circleMarker position={position}
                        closeOnClick={true} >

                        <Popup>

                <span>
                  this.properties.name <br /> Can edit this pretty easily.
                </span>
                        </Popup>
                    </circleMarker>

                </Map>
                </div>
            )
        }
}

export default MapView;