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
                {/* help button */}
                <button className="medium-offset-6 medium-1 cell help-btn"
                    // when clicked, open up the help tab
                    onClick={() => {
                        this.props.tabViewerActions.addTab(0, "Help", "Help");
                    }}>
                    {/* creates the ? in a circle */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" width="25" height="25" style={{"fill": "#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode": "normal"}}><path d="M0,224v-224h224v224z" fill="none"></path><g fill="#ffffff"><path d="M112,8.96c-56.85436,0 -103.04,46.18564 -103.04,103.04c0,56.85436 46.18564,103.04 103.04,103.04c56.85436,0 103.04,-46.18564 103.04,-103.04c0,-56.85436 -46.18564,-103.04 -103.04,-103.04zM112,17.92c52.01201,0 94.08,42.06799 94.08,94.08c0,52.01201 -42.06799,94.08 -94.08,94.08c-52.01201,0 -94.08,-42.06799 -94.08,-94.08c0,-52.01201 42.06799,-94.08 94.08,-94.08zM113.295,56.035c-16.7104,0 -27.79028,10.12536 -30.205,25.55c-0.1568,0.96768 0.31857,1.60622 1.28625,1.7675l10.12375,1.77625c0.96768,0.16128 1.60622,-0.32305 1.7675,-1.28625c1.9264,-9.80224 7.70791,-15.26875 16.70375,-15.26875c9.1616,0 15.58375,5.78788 15.58375,14.945c0,5.4656 -1.92458,9.15992 -7.5425,16.87l-10.77125,14.77875c-3.37344,4.66368 -4.8125,8.03922 -4.8125,14.4725v6.58c0,0.9632 0.63805,1.61042 1.60125,1.5925h10.605c0.9632,0 1.60125,-0.63805 1.60125,-1.60125v-5.13625c0,-5.46112 0.97034,-7.71211 4.1825,-12.04875l10.7625,-14.7875c5.4656,-7.55328 8.19,-13.17169 8.19,-20.88625c0,-15.90848 -11.72969,-27.3175 -29.07625,-27.3175zM106.23375,150.045c-0.96768,0 -1.61,0.6468 -1.61,1.61v13.81625c0,0.9632 0.63784,1.60125 1.61,1.60125h12.215c0.95872,0 1.60125,-0.63357 1.60125,-1.60125v-13.81625c0,-0.95872 -0.63805,-1.61 -1.60125,-1.61z"></path></g></g></svg>
                </button>
                {/* Book icon to open the chapter selection dropdown */}
                <div
                    // CSS classes
                    className="Hamburger-Menu medium-1 cell"
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
