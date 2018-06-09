/**
 * Created by danielhuang on 2/28/18.
 */
import React, { Component } from 'react';
import {ReactReader} from 'react-reader'
import styles from './BookView.css'

const storage = global.localStorage || null;

class BookView extends Component {

    constructor(){
        super();
        this.state = {
            location: (storage && storage.getItem('epub-location')) ? storage.getItem('epub-location') : 2,
            largeText: false
        };
        this.rendition = null
    }

    //TODO: set location to clicked chapter (this.props.chapter)

    onLocationChanged = (location) => {
        console.log(location);
        this.setState({
            location
        }, () => {
            storage && storage.setItem('epub-location', location)
        })
    };

    onToggleFontSize = () => {
        const nextState = !this.state.largeText;
        this.setState({
            largeText: nextState
        }, () => {
            this.rendition.themes.fontSize(nextState ? '140%' : '100%')
        })
    };

    getRendition = (rendition) => {
        // Set inital font-size, and add a pointer to rendition for later updates
        const {largeText} = this.state;
        this.rendition = rendition;
        rendition.themes.fontSize(largeText ? '140%' : '100%');
    };

    render() {
        const {fullscreen, location} = this.state;
        return (
            <div className="BookView" style={{position: 'relative', height: '85vh'}}>
                <ReactReader
                    url={'/Book/merge_from_ofoct.epub'} //find url's from Heading.js in componentWillMount
                    title={this.props.name}
                    location={location}
                    locationChanged={this.onLocationChanged}
                    getRendition={this.getRendition}
                />
                <button className="button" style={{'float':'right', 'marginTop':'-10px'}} onClick={this.onToggleFontSize}>Toggle font-size</button>
            </div>
        );
    }
}

export default BookView;