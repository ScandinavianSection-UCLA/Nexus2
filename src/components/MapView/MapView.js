/**
 * Created by danielhuang on 4/7/18.
 */
import React, { Component } from 'react';

import './MapView.css';
import {Leaflet as L} from 'leaflet';
import ReactDOM from 'react-dom';
import {Map, TileLayer, Marker, Popup,GeoJsonCluster,GeoJson} from 'react-leaflet-universal';
import AJAX from 'leaflet-ajax';


class MapView extends Component {
    state = {
        lat: 56.2639,
        lng: 9.5018,
        zoom: 8,
    }
    //const xx=3;
     //var placesGeoData= new L.GeoJSON.AJAX("./places_geo.geojson")
    render(){
        const position = [this.state.lat, this.state.lng];
        return (<div className="MapView" >
            <Map center={position} zoom={this.state.zoom} id="MapView">

                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <Marker position={position}>
                    <Popup>
            <span>
              Popup here <br /> Can edit this pretty easily.
            </span>
                    </Popup>
                </Marker>
            </Map>
            </div>
        )
    }
}




export default MapView;