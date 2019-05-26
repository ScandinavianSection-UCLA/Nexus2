import React, {Component} from "react";
import {addNode} from "../NexusGraph/NexusGraphModel";
import Modal from "react-modal";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "./RightBar.css";
import PropTypes from "prop-types";
import {arrayTransformation} from "../../utils.js";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

class RightBar extends Component {
    constructor() {
        super();
        // initial state
        this.state = {
            // starts out closed
            "isPaneOpen": false,
            // nothing should be initially active
            "active": null,
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    clickHandler(id, name, type, item) {
        addNode(id, name, type, item);
        this.props.tabViewerActions.addTab(id, name, type);
    }

    /**
     * Go to a specified tab of the right bar
     * @param {String} section Tab to open to
     */
    PPSClickHandler(section) {
        this.setState({
            // make sure the panel is open
            "isPaneOpen": true,
            // update the selected tab
            "active": section,
        });
    }

    /**
     * Renders the left buttons that control which part of the bar to see
     * @returns {JSX} The rendered controls
     */
    renderControls() {
        // what is currently being viewed
        const {view} = this.props;
        // tells whether or not a certain tab type is active
        const {active} = this.state;
        // depending on what the type of view this is
        switch (view) {
            // if the current view is a place, then create tabs for people, stories that mentioned it, and stories collected
            case "Places":
                // first <div> is the people tab
                // second <div> is the stories that mention it tab
                // third <div> is the stories collected tab
                return (<div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                    <div className={`medium-2 cell ${active === "people" ? "active" : ""} bio`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("people");
                        }}>
                        <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                            className="icon"
                            alt="person" />
                        <br />
                        <div className="icon-label">People</div>
                    </div>
                    <div className={`medium-2 cell ${active === "stories_mentioned" ? "active" : ""} stories-mentioned`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("stories_mentioned");
                        }}>
                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                            className="icon"
                            alt="stories" />
                        <br />
                        <div className="icon-label">Stories That Mention</div>
                    </div>
                    <div className={`medium-2 cell ${active === "stories" ? "active" : ""} stories`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("stories");
                        }}>
                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                            className="icon"
                            alt="stories" />
                        <br />
                        <div className="icon-label">Stories Collected</div>
                    </div>
                </div>);
            case "Stories": {
                // if the current view is a story, then create tabs for author, places, and stories
                const {informant_first_name, informant_last_name} = this.props.object;
                // first <div> is the author tab
                // second <div> is the places tab
                // third <div> is the stories tab
                return (<div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                    <div className={`medium-2 cell ${active === "people" ? "active" : ""} bio`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("bio");
                        }}>
                        <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                            className="icon"
                            alt="person" />
                        <br />
                        <div className="icon-label">{informant_first_name} {informant_last_name}</div>
                    </div>
                    <div className={`medium-2 cell ${active === "places" ? "active" : ""} places`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("places");
                        }}>
                        <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                            className="icon"
                            alt="location" />
                        <br />
                        <div className="icon-label">Places</div>
                    </div>
                    <div className={`medium-2 cell ${active === "stories" ? "active" : ""} stories`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("stories");
                        }}>
                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                            className="icon"
                            alt="stories" />
                        <br />
                        <div className="icon-label">Stories</div>
                    </div>
                </div>);
            }
            case "People":
                // if the current view is a person, then create tabs for places and stories
                // first <div> is the places tab
                // second <div> is the stories tab
                return (<div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                    <div className={`medium-2 cell ${active === "places" ? "active" : ""} places`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("places");
                        }}>
                        <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                            className="icon"
                            alt="location" />
                        <br />
                        <div className="icon-label">Places</div>
                    </div>
                    <div className={`medium-2 cell ${active === "stories" ? "active" : ""} stories`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("stories");
                        }}>
                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                            className="icon"
                            alt="stories" />
                        <br />
                        <div className="icon-label">Stories</div>
                    </div>
                </div>);
            case "Fieldtrips":
                // if the current view is a fieldtrip, then create tabs for people visited, places visited, and stories collected
                // first <div> is the people visited tab
                // second <div> is the places visited tab
                // third <div> is the stories collected tab
                return (<div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                    <div className={`medium-2 cell ${active === "people" ? "active" : ""} bio`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("people");
                        }}>
                        <img src="https://png.icons8.com/windows/32/ffffff/contacts.png"
                            className="icon"
                            alt="person" />
                        <br />
                        <div className="icon-label">People</div>
                    </div>
                    <div className={`medium-2 cell ${active === "places" ? "active" : ""} places`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("places");
                        }}>
                        <img src="https://png.icons8.com/windows/32/ffffff/marker.png"
                            className="icon"
                            alt="location" />
                        <br />
                        <div className="icon-label">Places</div>
                    </div>
                    <div className={`medium-2 cell ${active === "stories" ? "active" : ""} stories`}
                        onClick={(e) => {
                            e.preventDefault();
                            this.PPSClickHandler.bind(this)("stories");
                        }}>
                        <img src="https://png.icons8.com/metro/32/ffffff/chat.png"
                            className="icon"
                            alt="stories" />
                        <br />
                        <div className="icon-label">Stories</div>
                    </div>
                </div>);
            case 0:
                return null;
            default:
                console.warn(`Unhandled view type: ${view}`);
        }
    }

    renderContent() {
        switch (this.state.active) {
            case "bio":
                return this.renderBiography();
            case "places":
                return this.renderPlaces();
            case "stories":
                return this.renderStories(false);
            case "people":
                return this.renderPeople();
            case "stories_mentioned":
                return this.renderStories(true);
            case null:
                return null;
            default:
                console.warn(`Unhandled active tab: ${this.state.active}`);
        }
    }

    renderPeople() {
        let {people} = this.props;
        if (people.length === 0) {
            return <div className="cell medium-10 large-9 list-content">
                <div className="callout alert">
                    <h6>There are no associated people.</h6>
                </div>
            </div>;
        } else {
            return <div className="cell medium-10 large-9 list-content">
                <ul>
                    {people.map((person, i) => {
                        const {full_name, person_id} = person;
                        return <li key={i} onClick={(event) => {
                            event.preventDefault();
                            this.clickHandler(person_id, full_name, "People", person);
                        }}>
                            <img className="icon-item" src={require("../Navigation/icons8-contacts-32.png")} alt="person" />
                            {full_name}
                        </li>;
                    })}
                </ul>
            </div>;
        }
    }

    renderPlaces() {
        let {places, view} = this.props;
        // array-ify the places
        places = arrayTransformation(places)
            // and filter out any improper places
            .filter((place) => place.place_id !== "N/A");
        // if there are no associated places, leave a special message
        if (places.length === 0 || typeof places[0] !== "object") {
            return (
                <div className="cell medium-10 large-9 list-content">
                    <div className="callout alert">
                        <h6>There are no associated places.</h6>
                    </div>
                </div>
            );
        } else {
            // spit out a list of the places
            return (
                <div className="cell medium-10 large-9 list-content">
                    <ul>
                        {/* for each of the places */}
                        {places.map((place, i) => {
                            // get its name + ID
                            const {name, place_id} = place;
                            return <li
                                // key for React re-rendering
                                key={i}
                                // when clicked
                                onClick={() => {
                                    // open the relevant place and add it to the nexus graph
                                    this.clickHandler(place_id, name, "Places", place);
                                }}>
                                <img
                                    className="icon-item"
                                    src={require("../Navigation/icons8-marker-32.png")}
                                    alt="location" />
                                {/* fieldtrip places use full_name on their places, all others use display_name */}
                                {view === "Fieldtrips" ? place.full_name : place.display_name}
                            </li>;
                        })}
                    </ul>
                </div>
            );
        }
    }

    /**
     * Render any associated stories into a list
     * @param {boolean} mentioned Whether or not these stories are mentioned stories
     * @returns {JSX} The rendered stories list
     */
    renderStories(mentioned) {
        // determine whether to get direct or mentioned stories
        const stories = mentioned ? this.props.storiesMentioned : this.props.stories;
        // if there are no associated stories, leave a message indicating this
        if (stories.length === 0) {
            return (
                <div className="cell medium-10 large-9 list-content stories">
                    <div className="callout alert">
                        <h6>There are no {mentioned} stories.</h6>
                    </div>
                </div>
            );
        } else {
            // create a list of the stories to display
            return (
                <div className="cell medium-10 large-9 list-content stories">
                    <ul>
                        {/* for each of the stories */}
                        {stories.map((story, i) => {
                            // get its full name and ID
                            const {full_name, story_id} = story;
                            return <li
                                // key for react rerendering
                                key={i}
                                // when this is clicked
                                onClick={() => {
                                    // open up the story and add it to the graph
                                    this.clickHandler.bind(this)(story_id, full_name, "Stories", story);
                                }}>
                                <img className={"icon-item"} src={require("../Navigation/icons8-chat-filled-32.png")} alt="story" />
                                {/* text should be the name of the story */}
                                {full_name}
                            </li>;
                        })}
                    </ul>
                </div>
            );
        }

    }

    renderBiography() {
        let {bio, object} = this.props;
        // assuming there is actually an author
        if (bio !== null) {
            // get various attributes of the author
            let {birth_date, death_date, full_name, intro_bio, person_id} = bio;
            return (
                <div className="cell medium-10 large-9 content">
                    <div className="grid-y">
                        <div className="scrolling">
                            <div className="cell medium-3">
                                <div className="grid-x informant-bio-container">
                                    <div className="cell medium-6">
                                        <img src={require(`./informant_images/${[90, 123, 150, 235, 241].includes(object.informant_id) ? `${object.informant_id}.jpg` : "noprofile.png"}`)}
                                             alt={object.full_name} />
                                    </div>
                                    <div className="cell medium-6 details">
                                        <div><b>Born</b> {birth_date}</div>
                                        <div><b>Died</b> {death_date}</div>
                                        <div><b>ID#</b> {object.informant_id}</div>
                                        <a onClick={() => {
                                            // if (per)
                                            this.clickHandler(person_id, full_name, "People", bio);
                                        }} className="button">Informant Page</a>
                                    </div>
                                </div>
                            </div>
                            <div className="cell medium-9 biography">
                                {intro_bio}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            // no author, notify the viewer
            return (
                <div className="cell medium-10 large-9 list-content">
                    <div className="callout alert">
                        <h6>There is no associated informant.</h6>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="medium-1 RightBar cell">
                <div className="grid-y">
                    <SlidingPane
                        className="right-bar full"
                        overlayClassName="some-custom-overlay-class"
                        isOpen={this.state.isPaneOpen}
                        width="35vw"
                        onRequestClose={() => {
                            // triggered on "<" on left top click or on outside click
                            this.setState({
                                "isPaneOpen": false,
                                "people": false,
                                "bio": false,
                                "places": false,
                                "stories": false,
                                "storiesMentioned": false,
                            });
                        }}>
                        <div className="grid-x control-container">
                            {/* side bar controls*/}
                            <div className="cell medium-2 large-3 controls">
                                <div className="grid-y">
                                    {this.renderControls()}
                                </div>
                            </div>
                            {/* side bar contents*/}
                            {this.renderContent()}
                        </div>
                    </SlidingPane>
                    {this.renderControls()}
                </div>
            </div>

        );
    }
}

RightBar.propTypes = {
    "bio": PropTypes.shape({
        "birth_date": PropTypes.string.isRequired,
        "death_date": PropTypes.string.isRequired,
        "full_name": PropTypes.string.isRequired,
        "intro_bio": PropTypes.string.isRequired,
        "person_id": PropTypes.number.isRequired,
    }).isRequired,
    "object": PropTypes.shape({
        "full_name": PropTypes.string.isRequired,
        "informant_first_name": PropTypes.string.isRequired,
        "informant_last_name": PropTypes.string.isRequired,
        "informant_id": PropTypes.number.isRequired,
    }),
    "people": PropTypes.array.isRequired,
    "stories": PropTypes.array,
    "storiesMentioned": PropTypes.array,
    "tabViewerActions": PropTypes.object.isRequired,
    "places": PropTypes.any.isRequired,
    "view": PropTypes.oneOf(["Fieldtrips", "People", "Places", "Stories"]),
};

// define any necessary missing values
RightBar.defaultProps = {
    "bio": {
        "birth_date": "",
        "death_date": "",
        "full_name": "",
        "intro_bio": "",
        "person_id": null,
    },
    "object": {
        "full_name": "",
        "informant_first_name": "",
        "informant_last_name": "",
        "informant_id": null,
    },
    "people": [],
    "stories": [],
    "storiesMentioned": [],
    "places": "Stories",
    "view": "",
};

RightBar.propTypes = {
    "tabActions": PropTypes.object,
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
)(RightBar);
