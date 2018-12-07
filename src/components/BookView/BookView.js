// react functionality
import React, {Component} from "react";
// prop validation
import PropTypes from "prop-types";
// styling for the view
import "./BookView.css";
// book viewer
import ePub from "epubjs";
// redux functionality
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// actions to manipulate the tabs
import * as tabViewerActions from "../../actions/tabViewerActions";
// data for the dropdown
import menuList from "../../data/book_menu.json";

class BookView extends Component {
    constructor(props) {
        super(props);
        // to be set once the book is rendered
        this.book = null;
        this.rendition = null;
        // ref to the book div so we can render the content there
        this.bookRef = React.createRef();
        // bind the event handler so it works properly inside the listener
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    // called after the DOM loads for the first time
    componentDidMount() {
        // add an event listener for left and right arrow controls
        document.addEventListener("keydown", this.handleKeyPress, false);
        // load the .epub book
        this.book = ePub("/Book/merge_from_ofoct.epub");
        // when it has successfully loaded
        this.book.loaded.navigation.then(({toc}) => {
            const node = this.bookRef.current;
            // render the book to the "book" div
            this.rendition = this.book.renderTo(node, {
                // make it occupy all that space
                "height": "100%",
                "width": "100%",
            });
            // variable to store the final location
            let location;
            // numerical ID means it's a chapter number
            if (typeof this.props.id === "number") {
                // get the corresponding spot in the book for the chapter
                location = toc[menuList[this.props.id].id - 1].href;
            } else if (typeof this.props.id === "string") {
                // id is a string location in the book, use that
                location = this.props.id;
            } else {
                // bad type, warn that
                console.warn("Invalid id: ", this.props.id);
            }
            // display the book
            this.rendition.display(location);
            // update the tab's ID whenever the page is changed (so it can be re-loaded later)
            this.rendition.on("locationChanged", (newPage) => {
                this.props.tabViewerActions.updateTab(this.props.viewIndex, {
                    "id": newPage.start,
                });
            });
        });
    }

    // called as the book is being switched away from/closed
    componentWillUnmount() {
        // "delete" the book and rendition
        this.book = null;
        this.rendition = null;
        // remove our event listener
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    // handler for key presses
    handleKeyPress({key}) {
        switch (key) {
            // when the right arrow is clicked
            case "ArrowRight":
                // go to the next page
                this.rendition.next();
                break;
            // when the left arrow is clicked
            case "ArrowLeft":
                // go to the previous page
                this.rendition.prev();
                break;
        }
    }

    render() {
        return (
            // div to contain book + button
            <div className="BookView grid-x">
                {/* button to go back a page */}
                <button
                    className="cell medium-1"
                    onClick={() => {
                        this.rendition.prev();
                    }}>&lt;</button>
                {/* actual book content */}
                <div className="book cell medium-10" ref={this.bookRef} />
                {/* button to go forward a page */}
                <button
                    className="cell medium-1"
                    onClick={() => {
                        this.rendition.next();
                    }}>&gt;</button>
            </div>
        );
    }
}

BookView.propTypes = {
    "id": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    "state": PropTypes.shape({
        "views": PropTypes.arrayOf(
            PropTypes.shape({
                "active": PropTypes.bool,
                "color": PropTypes.string,
                "id": PropTypes.number,
                "name": PropTypes.string,
                "type": PropTypes.string,
            })
        ).isRequired,
    }).isRequired,
    "tabViewerActions": PropTypes.shape({
        "addTab": PropTypes.func,
        "closeTab": PropTypes.func,
        "moveTab": PropTypes.func,
        "switchTabs": PropTypes.func,
        "updateTab": PropTypes.func.isRequired,
    }).isRequired,
    "viewIndex": PropTypes.number.isRequired,
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
 * Set the "tabViewerActions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "tabViewerActions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookView);
