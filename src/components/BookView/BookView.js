// react functionality
import React, {Component} from "react";
// prop validation
import PropTypes from "prop-types";
// styling for the view
import "./BookView.css";
import ePub from "epubjs";
// redux functionality
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// actions to manipulate the tabs
import * as tabViewerActions from "../../actions/tabViewerActions";

class BookView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // start with normal text
            "largeText": false,
        };
        // to be set once the book is rendered
        this.book = null;
        this.rendition = null;
        this.display = null;
        this.bookRef = React.createRef();
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        // load the .epub book
        this.book = ePub("/Book/merge_from_ofoct.epub");
        // when it has successfully loaded
        this.book.loaded.navigation.then(({toc}) => {
            const location = this.props.state.views[this.props.viewIndex].id,
                node = this.bookRef.current;
            // render the book to the "book" div
            this.rendition = this.book.renderTo(node, {
                // make it occupy all that space
                "height": "100%",
                "width": "100%",
            });

            // display the book
            this.display = this.rendition.display(
                typeof location === "string" || typeof location === "number"
                    ? location
                    : toc[0].href
            );
            document.addEventListener("keydown", this.handleKeyPress, false);
        });
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
        console.log("unmounted! woo!");
    }

    handleKeyPress({key}) {
        switch (key) {
            // when the right arrow is clicked
            case "ArrowRight":
                // go to the next page
                this.rendition.next();
                break;
            case "ArrowLeft":
                this.rendition.prev();
                break;
        }
    }

    render() {
        return (
            // div to contain book + button
            <div className="BookView">
                <div className="book" ref={this.bookRef} />
            </div>
        );
    }
}

BookView.propTypes = {
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
