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
} from "react-leaflet";

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
            "checked": true,
        }, {
            "name": "Low Boards",
            "type": "WMS",
            "layers": "dtk_lave_maalebordsblade",
            "url": "http://kortforsyningen.kms.dk/service?servicename=topo20_lave_maalebordsblade&client=arcGIS&request=GetCapabilities&service=WMS&version=1.1.1&login=tango1963&password=heimskr1;",
            "format": "image/png",
            "checked": false,
        }];
    }

    /**
     * Filters out invalid places from props
     * @returns {Array<Places>} Only the valid places from props
     */
    prunePlaces() {
        // for each of prop's places
        return this.props.places.filter((place) =>
            // make sure it is properly defined
            place &&
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
        // assuming there are places
        if (places.length > 0) {
            const
                centerLat = (
                    // get the least latitude
                    places.reduce((minLong, place) => Math.min(minLong, place.latitude), places[0].latitude) +
                    // get the greatest latitude
                    places.reduce((maxLong, place) => Math.max(maxLong, place.latitude), places[0].latitude)
                    // average them out to center the map between them
                ) / 2,
                centerLong = (
                    // get the least longitude
                    places.reduce((minLong, place) => Math.min(minLong, place.longitude), places[0].longitude) +
                    // get the greatest longitude
                    places.reduce((maxLong, place) => Math.max(maxLong, place.longitude), places[0].longitude)
                    // average them out to center the map between them
                ) / 2;
            return [centerLat, centerLong];
        } else if (places.length === 0) {
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
        let places = this.prunePlaces();
        // assuming there are valid places
        if (places.length > 0) {
            const
                // get the least latitude
                minLat = places.reduce((lowLat, place) => Math.min(lowLat, place.latitude), places[0].latitude),
                // get the greatest latitude
                maxLat = places.reduce((highLat, place) => Math.max(highLat, place.latitude), places[0].latitude),
                // get the least longitude
                minLong = places.reduce((lowLong, place) => Math.min(lowLong, place.longitude), places[0].longitude),
                // get the greatest longitude
                maxLong = places.reduce((highLong, place) => Math.max(highLong, place.longitude), places[0].longitude),
                // some random thing i came up with to get the zoom
                zoom = 10 + (Math.log2(Math.max(
                    (maxLat - minLat) / 4,
                    (maxLong - minLong) / 2,
                )) * 0.5);
            return zoom;
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
                        <BaseLayer
                            checked={tile.checked}
                            name={tile.name}
                            key={i}>
                            <TileLayer
                                attribution={tile.attribution}
                                url={tile.url}
                                checked={tile.checked} />
                        </BaseLayer>
                    );
                case "WMS":
                    return (
                        <BaseLayer
                            checked={tile.checked}
                            name={tile.name}
                            key={i}>
                            <WMSTileLayer
                                layers={tile.layers}
                                format={tile.format}
                                url={tile.url} />
                        </BaseLayer>
                    );
                default:
                    return (
                        <BaseLayer
                            checked={tile.checked}
                            name={tile.name}
                            key={i}>
                            <TileLayer
                                attribution={tile.attribution}
                                url={tile.url} />
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
                <Marker
                    position={[place.latitude, place.longitude]}
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
        // if it has a display_name property
        if (place.hasOwnProperty("display_name")) {
            // use that to show the popup
            return place.display_name;
            // or if it has a full_name property
        } else if (place.hasOwnProperty("full_name")) {
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
            <Map
                center={this.defineMapCenter.bind(this)()}
                zoom={this.defineMapZoom.bind(this)()}
                boundsOptions={{
                    "paddingBottomRight": [250, 0],
                    "paddingTopLeft": [250, 0],
                }}>
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
