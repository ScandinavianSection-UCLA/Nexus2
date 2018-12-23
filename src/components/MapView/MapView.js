// react functionality
import React from "react";
// prop validation
import PropTypes from "prop-types";
// styling for the map
import "./MapView.css";
// map functionality
import {
    LayersControl,
    Map,
    Marker,
    Popup,
    TileLayer,
    WMSTileLayer,
} from "react-leaflet"
import {latLngBounds} from 'leaflet'

// constants + defaults for our map
const {BaseLayer} = LayersControl,
    DEFAULT_MAP_CENTER = [56.2639, 9.5018],
    DEFAULT_ZOOM_LEVEL = 7;

class MapView extends React.Component {
    constructor(props) {
        super(props);
        // start off with defaults
        this.tiles = [{
            "name": "Default OpenStreet Map",
            "type": "TILE",
            "url": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "attribution": "&amp;copy <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
            "checked": false,
        }, {
            "name": "High Boards",
            "type": "WMS",
            "layers": "dtk_hoeje_maalebordsblade",
            "url": "http://kortforsyningen.kms.dk/service?servicename=topo20_hoeje_maalebordsblade&client=arcGIS&request=GetCapabilities&service=WMS&version=1.1.1&login=tango1963&password=heimskr1;",
            "format": "image/png",
            "checked": false,
        }, {
            "name": "Low Boards",
            "type": "WMS",
            "layers": "dtk_lave_maalebordsblade",
            "url": "http://kortforsyningen.kms.dk/service?servicename=topo20_lave_maalebordsblade&client=arcGIS&request=GetCapabilities&service=WMS&version=1.1.1&login=tango1963&password=heimskr1;",
            "format": "image/png",
            "checked": true,
        }];
    }

    componentDidMount(){
        // console.log(this.refs.map.leafletElement.getBounds);
    }

    /**
     * Filters out invalid places from props
     * @returns {Array<Places>} Only the valid places from props
     */
    prunePlaces() {
        // for each of prop's places
        return this.props.places.filter((place) =>
            // make sure it isn't undefined
            typeof place !== "undefined" &&
            // or null
            place !== null &&
            // and it should have a latitude
            place.hasOwnProperty("latitude") &&
            // and longitude
            place.hasOwnProperty("longitude"));
    }

    /**
     * Defines the center coordinates of the map
     * @returns {Array<Number>} 2 element array for the coordinates of the center
     */
    defineMapCenter() {
        // get filtered places
        const places = this.prunePlaces();
        if(this.props.view === "Fieldtrip"){
            //find longitude average
            var AvgLongitude;
            var TotalLongitude = 0;
            places.forEach((place)=>{
                TotalLongitude += place.longitude;
            });
            AvgLongitude = TotalLongitude/places.length;
            const MedianPlaceIndex = places.length/2 | 0;
            const MedianPlace = places[MedianPlaceIndex];
            return [MedianPlace.latitude, AvgLongitude];
        }
        // if places is of an adequate size
        else if (places.length > 0 && places.length < 20) {
            // get the first place
            const initialPlace = places[0];
            // use that as the map center
            return [initialPlace.latitude, initialPlace.longitude];
        } else {
            // bad places, use the default
            return DEFAULT_MAP_CENTER;
        }
    }

    /**
     * Defines the zoom of the map
     * @returns {Number} THe zoom of the map
     */
    defineMapZoom() {
        // get filtered places
        const places = this.prunePlaces();
        if(this.props.view === "Fieldtrip"){
            return 9;
        }
        // if places is of an adequate size
        else if (places.length > 0 && places.length < 20) {
            // use 14 at the zoom (any reason why 14?)
            return 14;
        } else {
            // bad places, use the default
            return DEFAULT_ZOOM_LEVEL;
        }
    }

    renderTiles() {
        return this.tiles.map((tile, i) => {
            switch (tile.type) {
                case "TILE":
                    return (
                        <BaseLayer checked={tile.checked} name={tile.name} key={i}>
                            <TileLayer
                                attribution={tile.attribution}
                                url={tile.url}
                                checked={tile.checked}
                            />
                        </BaseLayer>
                    );
                case "WMS":
                    return (
                        <BaseLayer checked={tile.checked} name={tile.name} key={i}>
                            <WMSTileLayer
                                layers={tile.layers}
                                format={tile.format}
                                url={tile.url}
                            />
                        </BaseLayer>
                    );
                default:
                    return (
                        <BaseLayer checked={tile.checked} name={tile.name}>
                            <TileLayer
                                attribution={tile.attribution}
                                url={tile.url}
                            />
                        </BaseLayer>
                    );
            }
        });
    }

    /**
     * Generate the popups for the map
     * @returns {Array<Marker>} Markers + popups
     */
    renderMarkers() {
        // get filtered places
        return this.prunePlaces()
            // for each of the places
            .map((place, i) => (
                // create a marker and popup
                <Marker position={[place.latitude, place.longitude]}
                    key={i}>
                    <Popup>
                        {MapView.renderPopup(place)}
                    </Popup>
                </Marker>
            ));
    }

    /**
     * Render text for a place's popup
     * @param {Object} place The place to render the pop up for
     * @returns {String} The text for the popup
     */
    static renderPopup(place) {
        if(place.hasOwnProperty("display_name")){
            return place.display_name;
        }
        // if it has a full_name property
        else if (place.hasOwnProperty("full_name")) {
            // use that for the text
            return place.full_name;
            // or if it has a name property
        } else if (place.hasOwnProperty("name")) {
            // use that instead
            return place.name;
        } else {
            // bad place, warn this
            console.warn("Place does not have full_name or name", place);
            // don't return anything
            return null;
        }
    }

    render() {
        return (
            <Map ref="map"
                 center={this.defineMapCenter.bind(this)()}
                zoom={this.defineMapZoom.bind(this)()}
                 boundsOptions={{
                     paddingBottomRight: [250, 0],
                     paddingTopLeft:[250,0],
                 }}
            >
                <LayersControl position="topright">
                    {this.renderTiles.bind(this)()}
                    {this.renderMarkers.bind(this)()}
                </LayersControl>
            </Map>
        );
    }
}

// need places for the map to work
MapView.propTypes = {
    "places": PropTypes.array.isRequired,
};

export default MapView;
