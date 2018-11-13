// react functionality
import React, {Component} from "react";
// to display the e-book
import {ReactReader} from "react-reader";
// prop validation
import PropTypes from "prop-types";
// chapter data
import menuList from "../../data/book_menu.json";

class BookView extends Component {
    constructor() {
        super();

        // initial state
        this.state = {
            // start on the first page
            "location": 0,
            // don't zoom in
            "largeText": false,
        };

        // to be set once the book is rendered
        this.rendition = null;

        // bind the functions so that they function properly in sub-elements
        this.onLocationChanged = this.onLocationChanged.bind(this);
        this.onToggleFontSize = this.onToggleFontSize.bind(this);
        this.getRendition = this.getRendition.bind(this);
    }

    // called right before the first render
    componentWillMount() {
        this.setState({
            // go to the chapter that was selected
            "location": menuList[this.props.id].location,
        });
    }

    // called when the page changes
    onLocationChanged(prevLocation) {
        this.setState({
            // update the page
            "location": prevLocation,
        });
    }

    // toggle between zoomed/unzoomed font
    onToggleFontSize() {
        this.setState((prevState) => {
            return {
                // switch between large and normal font
                "largeText": !prevState.largeText,
            };
        }, function() {
            // update the book to show large font if needed
            this.rendition.themes.fontSize(this.state.largeText ? "140%" : "100%");
        });
    }

    // get a reference to the rendered book
    getRendition(rendition) {
        // set inital font-size, and add a pointer to rendition for later updates
        const {largeText} = this.state;
        // reference to the rendered book
        this.rendition = rendition;
        // enlarge the font if needed
        rendition.themes.fontSize(largeText ? "140%" : "100%");
    }

    render() {
        return (
            // div to contain book + button
            <div className="BookView" style={{"position": "relative", "height": "82vh"}}>
                <ReactReader
                    // path to the .epub file
                    url={"/Book/merge_from_ofoct.epub"}
                    // page to load
                    location={this.state.location}
                    // callback for when the page is changed
                    locationChanged={this.onLocationChanged}
                    // callback for when the book finishes rendering
                    getRendition={this.getRendition}
                />
                {/* button to zoom the font in/out */}
                <button className="button" style={{"float": "right", "marginTop": "-10px"}} onClick={this.onToggleFontSize}>Toggle font-size</button>
            </div>
        );
    }
}

BookView.propTypes = {
    // must have id to load a chapter
    "id": PropTypes.number.isRequired,
};

BookView.defaultProps = {
    "id": 0,
};

export default BookView;
