import React, {Component} from 'react';
import './MapView.css';
import L from 'leaflet';
export default class Mapview extends Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                thing
                <windowMap />
            </div>
        );
    }
}
export default class extends Component {
    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        this.map= L.map(this.refs.map).setView([56.2639,9.5018],8);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>"'
        }).addTo(this.map);
    }

    render(){
        return(
        <div className="MapView" id="MapView" ref="map"/>
    );
    }
}