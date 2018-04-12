/**
 * Created by danielhuang on 4/7/18.
 */
import React, { Component } from 'react';
import './MapView.css';
import {Leaflet as L} from 'leaflet';
import ReactDOM from 'react-dom';

class MapView extends Component {

    constructor(props) {
        super(props);


        //*****
        /*Insert Functions Here*/
renderMap(){

    }

enabled() {
document.write("<img border=\"0\" src=\"http://4.bp.blogspot.com/-C4vvMEB9MyI/TfW0lduV2NI/AAAAAAAAAZc/N7HL1pUusGw/s1600/some%20image.png\" />");
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
            <div className="MapView">
                {/*Insert mapping tag (i.e. <div id="map"/>) here*/}
            </div>
        );
    }
}

export default MapView;
