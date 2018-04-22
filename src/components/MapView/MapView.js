/**
 * Created by danielhuang on 4/7/18.
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';
import './MapView.css';
import {Leaflet as L} from 'leaflet';
import ReactDOM from 'react-dom';

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
            <div className="MapView" >
                {/*<Map*/}
                    {/*center={mapCenter}*/}
                    {/*zoom={zoomLevel}*/}
                    {/*id="MapView"*/}
                {/*>*/}
                    {/*<TileLayer*/}
                        {/*attribution={stamenTonerAttr}*/}
                        {/*url={stamenTonerTiles}*/}
                    {/*/>*/}
                {/*</Map>*/}
            </div>
        );
    }
}

export default MapView;
