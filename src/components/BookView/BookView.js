// react functionality
import React, {Component} from "react";
// to display the e-book
import {ReactReader} from "react-reader";
// prop validation
import PropTypes from "prop-types";
// chapter data
import "./BookView.css";

class BookView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // start with normal text
            "largeText": false,
        };
        // to be set once the book is rendered
        this.rendition = null;
        // bind the functions so that they function properly in sub-elements
        this.onToggleFontSize = this.onToggleFontSize.bind(this);
        this.getRendition = this.getRendition.bind(this);
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
        // reference to the rendered book
        this.rendition = rendition;
        // enlarge the font if needed
        rendition.themes.fontSize(this.state.largeText ? "140%" : "100%");
    }

    render() {
        return (
            // div to contain book + button
            <div className="BookView" style={{"position": "relative", "height": "82vh"}}>
                <ReactReader
                    // path to the .epub file
                    url={"/Book/merge_from_ofoct.epub"}
                    // page to load
                    location={this.props.page}
                    // callback for when the page is changed
                    locationChanged={this.props.handleLocationChanged}
                    // callback for when the book is rendered
                    getRendition={this.getRendition}
                />
                {/* button to zoom the font in/out */}
                <button
                    // give it button CSS and its own special formatting
                    className="button toggleFontSize"
                    // callback for when the button is clicked
                    onClick={this.onToggleFontSize}>
                    {/* if we have zoomed in text, offer smaller font, otherwise (for non-zoomed font) offer larger font */}
                    {this.state.largeText ? "Smaller Font" : "Larger Font"}
                </button>
            </div>
        );
    }
}

BookView.propTypes = {
    // callback for when we switch pages
    "handleLocationChanged": PropTypes.func.isRequired,
    // the page we are currently displaying
    "page": PropTypes.number.isRequired,
};

export default BookView;
