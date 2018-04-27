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

let config = {};
config.params = {
    center: [56.2639,9.5018]
};
config.tileLayer = {
    uri: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    params: {

        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>"',
        id: '',
        accessToken: ''
    }
};

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            tileLayer: null,
            geojsonLayer: null,
            geojson: null,

        };
        //this.onEachFeature = this.onEachFeature.bind(this);
        //this.pointToLayer = this.pointToLayer.bind(this);
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

    init(id) {
        if (this.state.map) return;
        let map = L.map(id, config.params);
        L.control.zoom({position: "bottomleft"}).addTo(map);
        L.control.scale({position: "bottomleft"}).addTo(map);
        const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
    }


    render() {

        return (
<Map>
            <div id="MapView">
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <div ref={(node) => this._mapNode = node} id="MapView" />

            </div>
</Map>
        );
    }
}

/*
                render(){

                    const position = [this.state.lat, this.state.lng]
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
*/
export default MapView;