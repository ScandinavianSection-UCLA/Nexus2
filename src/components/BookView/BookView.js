/**
 * Created by danielhuang on 2/28/18.
 */
import React, { Component } from 'react';
import {ReactReader} from 'react-reader'
// import styles from './BookView.css'

const storage = global.localStorage || null;

var MenuList = {
    1: {"name": "Preface", "url": "", "submenu": [], "id": "1"},
    2: {"name": "Acknowledgements", "url": "", "submenu": [], "id": "2"},
    3: {"name": "1. Introduction", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "3"},
    4: {"name": "2. The Rise of Folklore Scholarship", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "4"},
    5: {"name": "3. Evald Tang Kristensen's Life and Work", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "5"},
    6: {"name": "4. Folklore Genres", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "6"},
    7: {"name": "5. Mapping Folklore", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "7"},
    8: {"name": "6. Repertoire and the Individual", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "8"},
    9: {"name": "7. 'Bitte Jens' Kristensen: Cobbled Together", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "9"},
    10: {"name": "8. Kristen Marie Pedersdatter: Between Farms and Smallholding", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "10"},
    11: {"name": "9. Jens Peter Peterson: Day Laborer and Turner", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "11"},
    12: {"name": "10. Ane Margrete Jensdatter: Old Age and Rural Poverty", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "12"},
    13: {"name": "11. Peder Johansen: Miller, Fiddler, Bachelor Storyteller", "url": "/Book/merge_from_ofoct.epub", "submenu": [], "id": "13"},
    14: {"name": "Additional Information", "url": "", "submenu": [], "id":"14"},
    15: {"name": "About", "url": "", "submenu": "", "id":"15"},
};

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
        const {location} = this.state;
        return (
            <div className="BookView" style={{position: 'relative', height: '82vh'}}>
                <ReactReader
                    url={'/Book/merge_from_ofoct.epub'} //find url's from Heading.js in componentWillMount
                    title={MenuList[this.props.id].name}
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