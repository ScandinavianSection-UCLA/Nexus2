import React from "react";
import geojsonstuffs from "../../data/FT_009_route.json";
import {Map, TileLayer, Marker, Popup, GeoJSON} from 'react-leaflet';
import "./FieldtripRouteViewer.css";

class FieldtripRouteViewer extends React.Component {
    state = {
        center: [0,0],
        zoom: 3,
    };

    render() {
        return (
            <div className="mapContainer">
                <Map center={this.state.center} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON data={geojsonstuffs} />
                </Map>
            </div>
        );
    }
}
export default FieldtripRouteViewer;
