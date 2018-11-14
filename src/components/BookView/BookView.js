// react functionality
import React, {Component} from "react";
// to display the e-book
import {ReactReader} from "react-reader";
// prop validation
import PropTypes from "prop-types";
// chapter data
import menuList from "../../data/book_menu.json";
import "./BookView.css";

class BookView extends Component {
    constructor() {
        super();
        // initial state
        this.state = {
            // prop chapter
            "id": 0,
            // start on the first page
            "location": 0,
            // start with normal text
            "largeText": false,
        };
        // to be set once the book is rendered
        this.rendition = null;
        // bind the functions so that they function properly in sub-elements
        this.onLocationChanged = this.onLocationChanged.bind(this);
        this.onToggleFontSize = this.onToggleFontSize.bind(this);
        this.getRendition = this.getRendition.bind(this);
    }

    // called at the first loading of the component
    componentDidMount() {
        this.setState({
            // set the chapter that we got loaded to
            "propChapter": this.props.id,
        });
    }

    // called whenever we get a chapter to go to (includes initial render)
    static getDerivedStateFromProps(props, state) {
        // if we actually got a prop update and not a state update (chapter changed)
        if (props.id !== state.id) {
            // update the state
            return {
                // update the chapter we go to
                "id": props.id,
                // go to the chapter that was selected
                "location": menuList[props.id].location,
            };
        }
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
    // must have id to load a chapter
    "id": PropTypes.number.isRequired,
};

BookView.defaultProps = {
    "id": 0,
};

export default BookView;
