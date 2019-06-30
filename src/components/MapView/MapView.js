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
    GeoJSON
} from "react-leaflet";
import Leaflet from "leaflet";
import {getPlacesByID, getPlaceByName} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation, getPlaceIDList} from "../../utils";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

// constants + defaults for our map
const {BaseLayer} = LayersControl,
    DEFAULT_MAP_CENTER = [56.2639, 9.5018],
    DEFAULT_ZOOM_LEVEL = 7;

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.geoPlaces = [];
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

    /**
     * Filters out invalid places from props
     * @returns {Array<Places>} Only the valid places from props
     */
    prunePlaces() {
        // for each of prop's places
        return getPlaceIDList(arrayTransformation(this.props.places)).map((placeID) => getPlacesByID(placeID)).filter((place) =>
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
        if (this.props.view === "Fieldtrip") {
            //find longitude average
            var AvgLongitude;
            var TotalLongitude = 0;
            places.forEach((place) => {
                TotalLongitude += place.longitude;
            });
            AvgLongitude = TotalLongitude / places.length;
            const MedianPlaceIndex = places.length / 2 | 0;
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
        if (this.props.view === "Fieldtrip") {
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
        const temp = arrayTransformation(this.props.places).map((place) => place.name);
        // get filtered places
        return arrayTransformation(this.props.places).filter((item, i) =>
            temp.indexOf(item.name) === i)
            // for each of the places, create a marker and popup
            .map((place) => this.renderMarker(place));
    }

    renderMarker(place) {
        const place2 = getPlacesByID(place.place_id);
        if (place2 !== null) {
            // color of the marker, default purple
            let myCustomColour = "#8800ff";
            // special non-mentioned places are red
            if (place.type === "story_place" || place.type === "birth_place" || place.type === "death_place") {
                myCustomColour = "#ff0000";
                // mentioned places are blue
            } else if (place.type === "place_mentioned") {
                myCustomColour = "#0000ff";
            }
            // get name to show on the popup
            const name = MapView.renderPopup(place2),
                // style the popups
                markerHtmlStyles =
                    `background-color: ${myCustomColour};
                    width: 1rem;
                    height: 1rem;
                    display: block;
                    left: -.5rem;
                    top: -.5rem;
                    position: relative;
                    border-radius: 100px;
                    transform: rotate(45deg);
                    border: 1px solid #FFFFFF`,
                // create the actual icon
                icon = Leaflet.divIcon({
                    "className": "my-custom-pin",
                    "iconAnchor": [0, 8],
                    "labelAnchor": [-2, 0],
                    "popupAnchor": [0, -12],
                    "html": `<span style="${markerHtmlStyles}" />`,
                });
            // return a marker at the place with the marker, opens up the place's tab on double click
            return (
                <Marker
                    position={[place2.latitude, place2.longitude]}
                    icon={icon}
                    key={place.place_id}
                    onDblClick={() => {
                        this.props.actions.addTab(place.place_id, name, "Places");
                    }}
                    // onClick={this.handleClick.bind(this, place, name)}
                >
                    <Popup>{name}</Popup>
                </Marker>
            );
        } else {
            return null;
        }
    }

    /**
     * Render text for a place's popup
     * @param {Object} place The place to render the pop up for
     * @returns {String} The text for the popup
     */
    static renderPopup(place) {
        if (place.hasOwnProperty("display_name")) {
            return place.display_name;
            // if it has a full_name property
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

    renderFieldtripLayer() {
        return this.props.geojsons && this.props.geojsons.map((geojson) => (
            <GeoJSON
                style={() => ({
                    "color": "#1d40de",
                    "weight": 5,
                    "opacity": 0.65,
                })}
                key={0}
                data={geojson}
                pointToLayer={({properties}, latlng) => {
                    let color = properties.Sequence === 1 ? "green" : properties.Sequence === geojson.features.length ? "red" : "#d38d23";
                    // border
                    const name = `${properties.Sequence}: ${properties.Name}`,
                        // style the popups
                        markerHtmlStyles =
                            `background-color: ${color};
                            width: ${properties.Sequence === 1 ? "1.5rem" : "1rem"};
                            height: ${properties.Sequence === 1 ? "1.5rem" : "1rem"};
                            display: block;
                            left: ${properties.Sequence === 1 ? "-.75rem" : "-.5rem"};
                            top: ${properties.Sequence === 1 ? "-.75rem" : "-.5rem"};
                            position: relative;
                            border-radius: ${properties.Sequence === 1 || properties.Sequence === geojson.features
                                .length ? "0px" : "100px"};
                            transform: ${properties.Sequence === 1 ? "rotate(45deg)" : "rotate(0deg)"};
                            border: 1px solid #FFFFFF`;
                    return new Leaflet.Marker(latlng, {
                        "icon": Leaflet.divIcon({
                            "className": "my-custom-pin",
                            "iconAnchor": [0, 8],
                            "labelAnchor": [-2, 0],
                            "popupAnchor": [0, -12],
                            "html": `<span style="${markerHtmlStyles}" />`,
                        }),
                    }).on("dblclick", () => {
                        const place = getPlaceByName(properties.Name);
                        if (place) {
                            this.props.actions.addTab(place.place_id, properties.Name, "Places");
                        }
                    });
                }}
                onEachFeature={(feature, layer) => {
                    let popUpName;
                    if (feature.geometry.type === "MultiLineString") {
                        popUpName = `Fieldtrip #${this.props.fieldtripID}`;
                    } else if (feature.geometry.type === "Point") {
                        popUpName = `${feature.properties.Sequence}: ${feature.properties.Name}`;
                    }
                    layer.bindPopup(popUpName);
                }}/>
        ));
    }

    render() {
        return (
            <Map ref="map"
                center={this.defineMapCenter.bind(this)()}
                zoom={this.defineMapZoom.bind(this)()}
                boundsOptions={{
                    paddingBottomRight: [250, 0],
                    paddingTopLeft: [250, 0],
                }}
            >
                <LayersControl position="topright">
                    {this.renderTiles.bind(this)()}
                    {this.renderMarkers.bind(this)()}
                    {this.renderFieldtripLayer.bind(this)()}
                </LayersControl>
            </Map>
        );
    }
}

// need places for the map to work
MapView.propTypes = {
    "places": PropTypes.array.isRequired,
};

/**
 * Set certain props to access Redux states
 * @param {Object} state All possible Redux states
 * @returns {Object} Certain states that are set on props
 */
function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
    };
}

/**
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": {
            ...bindActionCreators(tabViewerActions, dispatch),
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapView);
