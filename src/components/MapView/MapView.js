/**
 * Created by danielhuang on 4/7/18.
 */
import React, { Component } from 'react';
import './MapView.css'
/*Import leaflet here*/

class MapView extends Component {

    constructor(){
        super();

    }

    /*Insert Functions Here*/

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