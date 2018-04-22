/**
 * Created by danielhuang on 4/7/18.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';
import './MapView.css';
import {Leaflet as L} from 'leaflet';
import ReactDOM from 'react-dom';

const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [39.9528, -75.1638];
const zoomLevel = 12;

class MapView extends Component {

    constructor(props) {
        super(props);
    }

    /*
    * An array of places will be dynamically given to the mapping component depending on which view is visible
    * (e.g. home tab will provide a list of places of whatever ontology a user clicks on, story view will provide
     * a list of places related to the story).
    * To access the list of places use "this.props.places" (console.log example below)
    * In the case that the user clicks on a fieldtrip or a list of fieldtrip...
    *  ...=> you can access it through "this.props.fieldtrips" (console.log example below)
    * */

    render() {
        /*Insert initialization functions here*/
        console.log(this.props.places);
        console.log(this.props.fieldtrips);

        return (
            <div className="MapView" id="MapView">
                {<Map
                    center={mapCenter}
                    zoom={zoomLevel}
                >
                    <TileLayer
                        attribution={stamenTonerAttr}
                        url={stamenTonerTiles}
                    />
                </Map>}
            </div>
        );
    }
}

export default MapView;
