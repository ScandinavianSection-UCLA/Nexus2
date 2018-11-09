import React, {Component} from "react";
import {addNode} from "../NexusGraph/NexusGraphModel";
import Modal from "react-modal";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "./RightBar.css";
import PropTypes from "prop-types";
import {arrayTransformation} from "../../utils.js";

class RightBar extends Component {
    constructor() {
        super();
        this.state = {
            "isPaneOpen": false,
            "isActive": {
                "people": false,
                "bio": false,
                "places": false,
                "stories": false,
                "storiesMentioned": false,
            },
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    clickHandler(id, name, type, item) {
        // console.log("THIS.PROPS", this.props);
        addNode(id, name, type, item);
        this.props.passID(id, name, type);
    }

    PPSClickHandler(section) {
        this.setState((oldState) => {
            oldState.isActive = {
                "people": false,
                "bio": false,
                "places": false,
                "stories": false,
                "storiesMentioned": false,
            };

            oldState.isActive[section] = true;

            return {
                "isPaneOpen": true,
                "isActive": oldState.isActive,
            };
        }); // make side bar appear
    }

    renderControls() {
        const {view} = this.props;
        const {isActive} = this.state;
        // if place is selected, then create tabs for people, stories that mentioned it, and stories collected
        if (view === "Places") {
            // first <div> is the people tab
            // second <div> is the stories that mention it tab
            // third <div> is the stories collected tab
            return <div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                <div className={`medium-2 cell ${isActive["people"] ? "active" : ""} bio`}
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
                <div className={`medium-2 cell ${isActive["stories_mentioned"] ? "active" : ""} stories-mentioned`}
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
                <div className={`medium-2 cell ${isActive["stories"] ? "active" : ""} stories`}
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
            </div>;
        } else if (view === "Stories") { // if story is selected, then create tabs for author, places, and stories
            // first <div> is the author tab
            // second <div> is the places tab
            // third <div> is the stories tab
            const {informant_first_name, informant_last_name} = this.props.object;
            return <div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                <div className={`medium-2 cell ${isActive["people"] ? "active" : ""} bio`}
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
                <div className={`medium-2 cell ${isActive["places"] ? "active" : ""} places`}
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
                <div className={`medium-2 cell ${isActive["stories"] ? "active" : ""} stories`}
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
            </div>;
        } else if (view === "People") { // if person selected, then create tabs for places and stories
            // first <div> is the plaes tab
            // second <div> is the stories tab
            return <div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                <div className={`medium-2 cell ${isActive["places"] ? "active" : ""} places`}
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
                <div className={`medium-2 cell ${isActive["stories"] ? "active" : ""} stories`}
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
            </div>;
        } else if (view === "Fieldtrips") { // if feildtrips is selected, then create tabs for people visited, places visited, and stories collected
            // first <div> is the people visited tab
            // second <div> is the places visited tab
            // third <div> is the stories collected tab
            return <div style={{"marginTop": "150%", "marginBottom": "20%"}}>
                <div className={`medium-2 cell ${isActive["people"] ? "active" : ""} bio`}
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
                <div className={`medium-2 cell ${isActive["places"] ? "active" : ""} places`}
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
                <div className={`medium-2 cell ${isActive["stories"] ? "active" : ""} stories`}
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
            </div>;
        }
    }

    renderContent() {
        const {isActive} = this.state;
        if (isActive["bio"]) {
            return this.renderBiography();
        } else if (isActive["places"]) {
            return this.renderPlaces();
        } else if (isActive["stories"]) {
            return this.renderStories();
        } else if (isActive["people"]) {
            return this.renderPeople();
        } else if (isActive["stories_mentioned"]) {
            return this.renderStories("mentioned");
        }
    }

    renderPeople() {
        var {people} = this.props;
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
                        return <li key={i} onClick={
                            (e) => {
                                e.preventDefault();
                                this.clickHandler.bind(this)(person_id, full_name, "People", person);
                            }
                        }>
                            <img className="icon-item" src={require("../Navigation/icons8-contacts-32.png")} alt="person" />
                            {full_name}
                        </li>;
                    })}
                </ul>
            </div>;
        }
    }

    renderPlaces() {
        var {places} = this.props;
        console.log(this.props.places);
        // problem with the data where it sometimes ends up as an object instead of an array
        places = arrayTransformation(places);
        // if there are no associated places, leave a special message
        if (places.length === 0) {
            return <div className="cell medium-10 large-9 list-content">
                <div className="callout alert">
                    <h6>There are no associated places.</h6>
                </div>
            </div>;
        } else {
            // creates a list of the places to display
            places.forEach(function(place, index) {
                if (typeof place === "undefined" || place["place_id"] === "N/A") {
                    delete places[index];
                }
            });
            return <div className="cell medium-10 large-9 list-content">
                <ul>
                    {places.map((place, i) => {
                        // fieldtrip places use full_name instead of display_name
                        var {name, place_id} = place;
                        var show_name = place["display_name"];
                        if (typeof place["display_name"] === "undefined") {
                            show_name = place["full_name"];
                        }
                        return <li key={i}
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    this.clickHandler.bind(this)(place_id, name, "Places", place);
                                }
                            }>
                            <img className="icon-item" src={require("../Navigation/icons8-marker-32.png")} alt="location" />
                            {show_name}
                        </li>;
                    })}
                </ul>
            </div>;
        }
    }

    renderStories(mentioned) {
        var storiesByPerson = [];
        if (mentioned === "mentioned") {
            storiesByPerson = this.props.storiesMentioned;
        } else {
            storiesByPerson = this.props.stories;
        }
        if (storiesByPerson.length === 0) { // if there are no associated stories
            return <div className="cell medium-10 large-9 list-content stories">
                <div className="callout alert">
                    <h6>There are no {mentioned} stories.</h6>
                </div>
            </div>;
        } else {
            return <div className="cell medium-10 large-9 list-content stories">
                <ul>
                    {storiesByPerson.map((story, i) => {
                        var {full_name, story_id} = story;
                        return <li key={i}
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    this.clickHandler.bind(this)(story_id, full_name, "Stories", story);
                                }
                            }>
                            <img className={"icon-item"} src={require("../Navigation/icons8-chat-filled-32.png")} alt="story" />
                            {full_name}
                        </li>;
                    })}
                </ul>
            </div>;
        }

    }

    renderBiography() {
        var {bio, object} = this.props;
        var {birth_date, death_date, full_name, intro_bio, person_id} = bio;
        if (person_id !== -1) {
            return (
                <div className="cell medium-10 large-9 content">
                    <div className="grid-y">
                        <div className="cell medium-3">
                            <div className="grid-x informant-bio-container">
                                <img src={require(`./informant_images/${[90, 123, 150, 235, 241].includes(object["informant_id"]) ? `${object["informant_id"]}.jpg` : "noprofile.png"}`)}
                                    className="cell medium-6" alt={object["full_name"]} />
                                <div className="cell medium-6 details">
                                    <div><b>Born</b> {birth_date}</div>
                                    <div><b>Died</b> {death_date}</div>
                                    <div><b>ID#</b> {object["informant_id"]}</div>
                                    <a onClick={(e) => {
                                        e.preventDefault();
                                        this.clickHandler.bind(this)(person_id, full_name, "People", bio);
                                    }} className="button">Informant Page</a>
                                </div>
                            </div>
                        </div>
                        <div className="cell medium-9 biography">
                            {intro_bio}
                        </div>
                    </div>
                </div>
            );
        } else {
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
        console.log("right bar", this.props);
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
        "birth_date": PropTypes.string,
        "death_date": PropTypes.string,
        "full_name": PropTypes.string,
        "intro_bio": PropTypes.string,
        "person_id": PropTypes.number,
    }),
    "object": PropTypes.shape({
        "full_name": PropTypes.string,
        "informant_first_name": PropTypes.string,
        "informant_last_name": PropTypes.string,
        "informant_id": PropTypes.number,
    }),
    "people": PropTypes.array,
    "stories": PropTypes.array,
    "storiesMentioned": PropTypes.array,
    "places": PropTypes.any,
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

export default RightBar;
