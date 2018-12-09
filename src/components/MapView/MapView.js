/**
 * Created by danielhuang/benrosen on 4/7/18.
 */
import React from "react";
import PropTypes from "prop-types";
import "./MapView.css";
import {
    LayersControl,
    Map,
    Marker,
    Popup,
    WMSTileLayer,
    TileLayer,
} from 'react-leaflet';
const { BaseLayer } = LayersControl;

const DEFAULT_ZOOM_LEVEL = 7;
const DEFAULT_MAP_CENTER = [56.2639, 9.5018];

class MapView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tiles:[],
            DEFAULT_MAP_CENTER: [],
            DEFAULT_ZOOM_LEVEL: 0,
        }
    }

    componentWillMount(){
        this.setState({
            DEFAULT_MAP_CENTER: DEFAULT_MAP_CENTER,
            DEFAULT_ZOOM_LEVEL: DEFAULT_ZOOM_LEVEL,
            tiles:[
                {
                    type:'TILE',
                    name:'Default OpenStreet Map',
                    url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    attribution:'&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    checked:false,
                },
                {
                    type:'WMS',
                    name:'High Boards',
                    layers:'dtk_hoeje_maalebordsblade',
                    url:'http://kortforsyningen.kms.dk/service?servicename=topo20_hoeje_maalebordsblade&client=arcGIS&request=GetCapabilities&service=WMS&version=1.1.1&login=tango1963&password=heimskr1;',
                    format:'image/png',
                    checked:true,
                },
                {
                    type:'WMS',
                    name:'Low Boards',
                    layers:'dtk_lave_maalebordsblade',
                    url:'http://kortforsyningen.kms.dk/service?servicename=topo20_lave_maalebordsblade&client=arcGIS&request=GetCapabilities&service=WMS&version=1.1.1&login=tango1963&password=heimskr1;',
                    format:'image/png',
                    checked:false,
                }
            ]
        });
        console.log('map is mounting!');
    }

    defineMapCenter(){
        var InitialPlace = this.props.places[0];
        if(InitialPlace !== undefined) {
            console.log('initial place is defined!', InitialPlace);
            if ('latitude' in InitialPlace && this.props.places.length < 20) {
                return [InitialPlace.latitude,InitialPlace.longitude]
            }
        } else {
            console.log('initial place is NOT defined!');
            return DEFAULT_MAP_CENTER;
        }
    }

    defineMapZoom(){
        var InitialPlace = this.props.places[0];
        if(InitialPlace !== undefined) {
            if ('latitude' in InitialPlace && this.props.places.length < 20) {
                return 14;
            }
        } else {
            return DEFAULT_ZOOM_LEVEL;
        }
    }

    renderTiles(){
        if(this.state.tiles){
            return this.state.tiles.map((tile,i)=>{
                switch (tile.type){
                    case 'TILE':
                        return <BaseLayer name={tile.name} key={i}>
                            <TileLayer
                                attribution={tile.attribution}
                                url={tile.url}
                                checked={tile.checked}
                            />
                        </BaseLayer>;
                    case 'WMS':
                        return <BaseLayer checked name={tile.name} key={i}>
                            <WMSTileLayer
                                layers={tile.layers}
                                format={tile.format}
                                url={tile.url}
                                checked={tile.checked}
                            />
                        </BaseLayer>;
                    default:
                        return <BaseLayer name={tile.name}>
                            <TileLayer
                                attribution={tile.attribution}
                                url={tile.url}
                                checked={tile.checked}
                            />
                        </BaseLayer>;
                }

            })
        }
    }

    renderMarkers(places){
        console.log(places);
        var InitialPlace = places[0];
        if(InitialPlace !== undefined){
            if('latitude' in InitialPlace){
                return places.map((place, i)=>{
                    if(place !== null){
                        let POSITION = [place.latitude, place.longitude];
                        return <Marker position={POSITION} key={this.renderPopup(place)+i}>
                            <Popup>
                                {this.renderPopup(place)}
                            </Popup>
                        </Marker>
                    }
                })
            }
        }
    }

    renderPopup(place){
        if('full_name' in place){
            return place['full_name'];
        } else {
            return place['name']
        }
    }

    render() {
        return (
            <Map
                center={this.defineMapCenter.bind(this)()}
                zoom={this.defineMapZoom.bind(this)()}
            >
                <LayersControl position="topright">
                    {this.renderTiles.bind(this)()}
                    {this.renderMarkers.bind(this)(this.props.places)}
                </LayersControl>
            </Map>
        )
    }
}

// general properties needed for this component
MapView.propTypes = {
    "person": PropTypes.array.isRequired,
    "places": PropTypes.array.isRequired,
    "stories": PropTypes.array.isRequired,
    "height": PropTypes.string,
};

// assign defaults if not already defined
MapView.defaultProps = {
    "person": [],
    "places": [],
    "stories": [],
};

export default MapView;
