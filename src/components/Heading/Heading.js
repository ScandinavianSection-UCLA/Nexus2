// react functionality
import React, {Component} from "react";
// CSS styling
import "./Heading.css";
// prop validation
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
// tab management
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";
// data for the dropdown
import menuList from "../../data/book_menu.json";

class Heading extends Component {
    constructor() {
        super();
        // set the initial state
        this.state = {
            // the story menu is by default not selected
            "menuActive": false,
        };
        // bind the menu toggle so that sub-elements can properly toggle the menu
        this.menuToggle = this.menuToggle.bind(this);
    }

    /**
     * Toggle the book chapter selection dropdown between open and closed
     */
    menuToggle() {
        this.setState((prevState) => {
            // set the state of the dropdown to be the opposite of what it was
            return {
                "menuActive": !prevState.menuActive,
            };
        });
    }

    render() {
        return (
            <div className="Heading grid-x grid-padding-x">
                {/* Flag + title on the left of the header */}
                <div className="large-4 cell">
                    <div className="grid-x grid-margin-x">
                        {/* Flag that links back to the home page */}
                        <a className="flag medium-3 medium-offset-1 cell">
                            <img
                                // load image from the correct file
                                src={require("./assets/DENM0001.png")}
                                // text if the file can't load
                                alt="Danish Flag"
                                // callback for when the function is clicked
                                onClick={() => {
                                    // go to the home tab
                                    this.props.tabViewerActions.switchTabs(0);
                                }} />
                        </a>
                        {/* Text to the right of the flag */}
                        <h5 className="danish-folklore medium-2 cell">Danish Folklore</h5>
                        <h6 className="etk medium-6 cell">The Evald Tang <br /> Kristensen Collection</h6>
                    </div>
                </div>
                {/* Book icon to open the chapter selection dropdown */}
                <div
                    // CSS classes
                    className="medium-offset-7 large-offset-7 Hamburger-Menu medium-1 cell"
                    // toggle the menu when this is clicked
                    onClick={this.menuToggle}>
                    <img
                        // from where to load the image
                        src="https://png.icons8.com/wired/64/ffffff/book.png"
                        style={{"height": "2.9em", "paddingTop": "7px", "paddingLeft": "10px"}}
                        alt="book" />
                </div>
                {/* dropdown menu that links to the various chapters */}
                {this.state.menuActive &&
                    <div className="Menu" onClick={this.menuToggle}>
                        <div className="solid">
                            {/* little open book at the top right */}
                            <div className="Hamburger-Menu" onClick={this.menuToggle}>
                                <img src="https://png.icons8.com/wired/50/ffffff/literature.png" style={{"height": "2.9em", "paddingTop": "5px"}} alt="open book" onClick={this.menuToggle} />
                            </div>
                            {/* list of all the chapters */}
                            <ul className="list">
                                {/* for each of the chapter links */}
                                {menuList.map((menuItem, i) => (
                                    // return a single element of the list
                                    <li
                                        // unique key for react re-rendering
                                        key={i}
                                        // style it as a dropdown element
                                        className="menu-item"
                                        // callback when this option is clicked
                                        onClick={(event) => {
                                            // prevent default click behavior
                                            event.preventDefault();
                                            // add a tab to the desired chapter
                                            this.props.tabViewerActions.addTab(menuItem.id - 3, menuItem.name, "Book");
                                        }}
                                    >{menuItem.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                }
            </div>

        );
    }
}

Heading.propTypes = {
    // must have tabViewerActions to open up a new book tab
    "tabViewerActions": PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "tabViewerActions": bindActionCreators(tabViewerActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Heading);
