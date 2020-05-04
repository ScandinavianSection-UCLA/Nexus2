import React, {Component} from "react";
import Modal from "react-modal";
import "react-sliding-pane/dist/react-sliding-pane.css";
import RightBar from "../RightBar/RightBar";
import {getPeopleByID, getGenreByID, getETKByID, getTangoByID} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation} from "../../utils";
import {addNode} from "../NexusGraph/NexusGraphModel";
import "./StoryView.css";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as searchActions from "../../actions/searchActions";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";
import {setSessionStorage} from "../../data-stores/SessionStorageModel";

const indexToVersion = {
    "0": "english_publication",
    "1": "english_manuscript",
    "2": "danish_publication",
    "3": "danish_manuscript",
};

class StoryView extends Component {
    constructor(props) {
        super(props);
        // set initial state
        this.state = {
            // which version of the storyview to show
            "isMapExpanded": false,
            "lastStoryVersionOpen": 1,
            // start with the first accordion tab open
            "openTab": 0,
            "storyVersionOpen": [true, false, false, false],
            // two versions wouldn't be open
            "twoVersions": false,
            "fontSize": 16,
            // update with any previous state stored in redux
            ...props.state.views[props.viewIndex].state,
        };
        // out of all the story's places
        this.placeRecorded = arrayTransformation(props.story.places.place)
            // find the one that is where this story was recorded
            .find((place) => place.type === "place_recorded");
        // out of all the story's places
        this.placesMentioned = arrayTransformation(props.story.places.place)
            // find the ones that are mentioned in story
            .filter((place) => place.type === "place_mentioned");
        // properly bind functions so that they work inside sub-elements
        this.renderStories = this.renderRelatedStories.bind(this);
        this.renderProperty = this.renderProperty.bind(this);
        this.accordionHandler = this.accordionHandler.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    componentWillUnmount() {
        // save state to redux for later
        const thisView = this.props.state.views[this.props.viewIndex];
        if (thisView && thisView.id === this.props.id && thisView.type === "Stories") {
            this.props.actions.updateTab(this.props.viewIndex, {
                "state": this.state,
            });
        }
    }

    renderRelatedStories() {
        // get related stories
        const {stories_mentioned} = this.props.story;
        // if we actually have any related stories
        if (stories_mentioned !== null) {
            return (
                <ul>
                    {/* for each mentioned story */}
                    {arrayTransformation(stories_mentioned.story).map((story, i) => {
                        // get its id, display name
                        const {story_id, full_name} = story;
                        return <li
                            key={i}
                            className="associated-items"
                            onClick={() => {
                                // add the story as a node on the graph
                                addNode(story_id, full_name, "Stories", story);
                                // open up the story in a new tab
                                this.props.actions.addTab(story_id, full_name, "Stories");
                            }}>
                            {full_name}
                        </li>;
                    })}
                </ul>
            );
        } else {
            // no related stories, notify the viewer
            return (
                <div className="callout alert">
                    <h6>No related stories.</h6>
                </div>
            );
        }
    }

    /**
     * Handle a click on the left accordion tri-tabs
     * @param {*} tab Tab that was clicked
     */
    accordionHandler(tab) {
        this.setState({
            // if we clicked on a new tab, make that active
            // otherwise we are trying to hide the current tab, so no active tab
            "openTab": tab,
        });
    }

    bibliographicReferences() {
        const {bibliography_references} = this.props.story;
        // no references, alert the viewer
        if (bibliography_references === null || bibliography_references.reference.length === 0) {
            return <div className="callout alert">
                <h6>No references for this story.</h6>
            </div>;
        } else {
            return <table>
                <tbody>{
                    // display each reference on a row
                    arrayTransformation(bibliography_references.reference).map((reference) => {
                        const {display_string} = reference;
                        return <tr key={display_string}>
                            {/* parse the html and display it (to show the formatting/italics, etc.) */}
                            <td dangerouslySetInnerHTML={{"__html": display_string}} />
                        </tr>;
                    })}
                </tbody>
            </table>;
        }
    }

    storyViewerClickHandler(version) {
        this.setState((prevState) => {
            // get relevant previous conditions
            let {lastStoryVersionOpen, storyVersionOpen, twoVersions} = prevState;
            // total number of open manuscripts
            const versionCount = storyVersionOpen.filter(Boolean).length;
            // if clicked version is already open
            if (storyVersionOpen[version] === true) {
                // if we alreay have two tabs open
                if (versionCount >= 2) {
                    // close the clicked tab
                    storyVersionOpen[version] = false;
                }
                // we have ensured that only one view is open by closing if necessary
                twoVersions = false;
                // set last open view to be the one remaining open view
                lastStoryVersionOpen = storyVersionOpen.findIndex(Boolean);
            } else {
                // we are going to have 2 views open
                twoVersions = true;
                // if we already have at least two versions open
                if (versionCount >= 2) {
                    // close the last open version
                    storyVersionOpen[prevState.lastStoryVersionOpen] = false;
                }
                // open clicked version
                storyVersionOpen[version] = true;
                // clicked version is now the last version that was opened
                lastStoryVersionOpen = version;
            }
            return {
                lastStoryVersionOpen,
                storyVersionOpen,
                twoVersions,
            };
        });
    }

    renderProperty(property) {
        // if the property is defined, that should be displayed, otherwise not applicable
        return property || "N/A";
    }

    renderComponentView(component, name) {
        // if the component is defined, it should be displayed, otherwise notify that it doesn't exist
        return component || (
            <div className="callout alert">
                <h6>{name} does not exist.</h6>
            </div>
        );
    }

    expandMap() {
        this.setState(({isMapExpanded}) => ({
            "isMapExpanded": !isMapExpanded,
        }));
    }

    increaseFontSize() {
        if (this.state.fontSize < 24) {
            this.setState({fontSize: this.state.fontSize + 2});
        }
    }

    decreaseFontSize() {
        if (this.state.fontSize > 10)
        this.setState({fontSize: this.state.fontSize - 2});
    }

    render() {
        const {story} = this.props,
            {
                annotation,
                etk_index,
                "etk_index": {
                    heading_english,
                },
                fielddiary_page_end,
                fielddiary_page_start,
                fieldtrip,
                fieldtrip_end_date,
                fieldtrip_start_date,
                full_name,
                genre,
                informant_id,
                informant_full_name,
                keywords,
                order_told,
                places,
                tango_indices,
            } = story,
            personData = getPeopleByID(informant_id),
            PlaceObjectArray = places.place,
            {
                isMapExpanded,
                openTab,
                storyVersionOpen,
                twoVersions,
            } = this.state;
        // standard story view
        if (isMapExpanded === false) {
            return (
                <div className="StoryView grid-x">
                    <div className="medium-3 cell grid-y story-meta-data-wrapper">
                        <div className="small-4 cell">
                            <MapView key={0} places={places.place} />
                        </div>
                        <button
                            className="primary button"
                            style={{
                                "height": "3vh",
                                "lineHeight": "0vh",
                                "textAlign": "center",
                            }}
                            onClick={this.expandMap.bind(this)}>
                            Expand Map
                        </button>
                        <ul className="accordion" data-accordian>
                            <li className={`accordion-item ${openTab === 0 && "is-active"}`}>
                                <a
                                    className="accordion-title"
                                    onClick={() => {
                                        // when clicked, toggle the top tab
                                        this.accordionHandler(0);
                                    }}>Story Data</a>
                                {/* only show story data if that is the open accordion tab */}
                                {openTab === 0 &&
                                    <div className="body">
                                        <b>Order Told</b> {this.renderProperty(order_told)}<br />
                                        <b>Recorded during fieldtrip</b> {this.renderProperty(fieldtrip.id)}<br />
                                        <b>Fieldtrip dates</b> {this.renderProperty(fieldtrip_start_date)} to {this.renderProperty.bind(this)(fieldtrip_end_date)}<br />
                                        <b>Place recorded</b> {
                                            // is there a properly set place recorded?
                                            typeof this.placeRecorded !== "undefined"
                                                // if so, return it
                                                ? <button
                                                    // make it a button-well
                                                    className="button keyword-well"
                                                    // when it is clicked
                                                    onClick={() => {
                                                        // open up this place's tab
                                                        this.props.actions.addTab(this.placeRecorded.place_id, this.placeRecorded.name, "Places");
                                                        // display the place name
                                                    }}>{this.placeRecorded.name}</button>
                                                // otherwise, it isn't applicable
                                                : "N/A"}
                                        <br />
                                        <b>Field diary pages</b> {
                                            // are there field diary pages?
                                            fielddiary_page_start !== "No field diary recording"
                                                // if so, list them out
                                                ? `${fielddiary_page_start} to ${fielddiary_page_end}`
                                                // otherwise, it's not applicable
                                                : "N/A"
                                        }
                                        <br />
                                        <b>Associated Keywords</b><br />{
                                            // for each of the keywords
                                            arrayTransformation(keywords.keyword).map((keyword) => (
                                                // return a well that triggers a serach by that keyword when clicked
                                                <button
                                                    // make it a button-well
                                                    className="button keyword-well"
                                                    key={keyword.keyword}
                                                    // when it is clicked
                                                    onClick={() => {
                                                        // start a search by this keyword
                                                        this.props.actions.searchArtifact(keyword.keyword);
                                                        // go home to show the results
                                                        this.props.actions.switchTabs(0);
                                                    }}>{keyword.keyword}</button>
                                            ))}
                                        <br />
                                        <b>Places mentioned in story</b> {
                                            // are there any mentioned places
                                            this.placesMentioned.length > 0
                                                // if so, for each of the mentioned places
                                                ? this.placesMentioned.map((place, i) => (
                                                    <button
                                                        key={i}
                                                        // make it a button-well
                                                        className="button keyword-well"
                                                        // when it is clicked
                                                        onClick={() => {
                                                            // open up the tab related to this place
                                                            this.props.actions.addTab(place.place_id, place.name, "Places");
                                                        }}>{place.name}</button>
                                                    // otherwise, this is not applicable
                                                )) : "N/A"}
                                    </div>}
                            </li>
                            <li className={`accordion-item ${openTab === 1 && "is-active"}`}>
                                <a
                                    className="accordion-title"
                                    // when clicked, toggle the middle tab
                                    onClick={this.accordionHandler.bind(this, 1)}>
                                    Story Indices
                                </a>
                                {/* only show indices if that is the open accordion tab */}
                                {openTab === 1 &&
                                    <div className="body">
                                        <b>Genre</b>
                                        <button
                                            className="button keyword-well"
                                            onClick={() => {
                                                setSessionStorage("SelectedNavOntology", {
                                                    "data": "Genres",
                                                });
                                                setSessionStorage("dropdownLists", [getGenreByID(genre.id)]);
                                                this.props.actions.switchTabs(0);
                                            }}>
                                            {genre.name}
                                        </button>
                                        <br />
                                        <b>ETK Index</b>
                                        <button
                                            className="button keyword-well"
                                            onClick={() => {
                                                setSessionStorage("SelectedNavOntology", {
                                                    "data": "ETK Index",
                                                });
                                                setSessionStorage("dropdownLists", [getETKByID(etk_index.id)]);
                                                this.props.actions.switchTabs(0);
                                            }}>
                                            {heading_english}
                                        </button>
                                        <br />
                                        <b>Tangherlini Indices</b><br />
                                        {/* render the indices by their display names */}
                                        {arrayTransformation(tango_indices.tango_index).map((tango, i) => {
                                            return (
                                                <button className="button keyword-well" key={i}
                                                    onClick={() => {
                                                        setSessionStorage("SelectedNavOntology", {
                                                            "data": "Tangherlini Index",
                                                        });
                                                        setSessionStorage("dropdownLists", [getTangoByID(tango.id).type, getTangoByID(tango.id)]);
                                                        this.props.actions.switchTabs(0);
                                                    }}>
                                                    {tango.display_name}
                                                </button>
                                            );
                                        })}
                                    </div>}
                            </li>
                            <li className={`accordion-item ${openTab === 2 && "is-active"}`}>
                                <a
                                    className="accordion-title"
                                    // when clicked, toggle the bottom tab
                                    onClick={this.accordionHandler.bind(this, 2)}>
                                    Bibliographical References
                                </a>
                                {/* only show references if that is the open tab */}
                                {openTab === 2 &&
                                    <div className="body">
                                        {this.bibliographicReferences()}
                                    </div>}
                            </li>
                        </ul>
                    </div>
                    <div className="medium-9 cell" style={{position: "relative"}}>
                        <h2 className="title">
                            <img src={require("../Navigation/icons8-chat-filled-32.png")}
                                style={{
                                    "marginRight": "1%",
                                    "marginTop": "-1%",
                                }} alt="story icon" />
                            {full_name}
                        </h2>
                        <h4 className="name-header" style={{"marginLeft": "1.5%"}}>{informant_full_name}</h4>
                        <div className="font-control">
                            <div className="button secondary" style={{"marginLeft": "1.5%"}} onClick={(e) => {e.preventDefault(); this.increaseFontSize.bind(this)()}}>A</div>
                            <div className="button secondary" onClick={(e) => { e.preventDefault(); this.decreaseFontSize.bind(this)() }}>a</div>
                        </div>
                        <div className="grid-x" style={{float: "left"}}>
                            <div className="medium-11 cell">
                                <div className="grid-padding-x">
                                    <div className="story-viewer cell grid-y">
                                        <ul className="button-group story-viewer-options">
                                            {/* make the button secondary if that story version is not open */}
                                            <li className={`button ${!storyVersionOpen[0] && "secondary"}`}
                                                onClick={this.storyViewerClickHandler.bind(this, 0)}>
                                                English Published Version
                                            </li>
                                            <li className={`button ${!storyVersionOpen[1] && "secondary"}`}
                                                onClick={this.storyViewerClickHandler.bind(this, 1)}>
                                                English ms Translation
                                            </li>
                                            <li className={`button ${!storyVersionOpen[2] && "secondary"}`}
                                                onClick={this.storyViewerClickHandler.bind(this, 2)}>
                                                Danish Published Version
                                            </li>
                                            <li className={`button ${!storyVersionOpen[3] && "secondary"}`}
                                                onClick={this.storyViewerClickHandler.bind(this, 3)}>
                                                Danish ms Transcription
                                            </li>
                                        </ul>
                                        <div className="grid-x medium-2">
                                            {/* only render the active story versions */}
                                            {storyVersionOpen.map((version, i) => version && (
                                                <div className={`cell story ${twoVersions && "medium-6"}`} key={i}>
                                                    <div className="card">
                                                        <div className="card-section" style={{fontSize: this.state.fontSize+"px"}}>
                                                            {this.renderComponentView(story[indexToVersion[i]], "Version")}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="cell">
                                        <div className="grid-x">
                                            <div className="medium-8 cell">
                                                <div className="card annotation">
                                                    <h5 className="title">Annotation</h5>
                                                    <div className="card-section" style={{fontSize: this.state.fontSize+"px"}}>
                                                        {this.renderComponentView(annotation, "Annotation")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="medium-4 cell relatedStories">
                                                <h5 className="title">Related Stories</h5>
                                                {this.renderRelatedStories()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <RightBar
                                view="Stories"
                                object={story}
                                bio={personData}
                                places={PlaceObjectArray}
                                // if the author is valid, show its stories under the stories tab
                                stories={(personData && personData.stories) || []} />
                        </div>
                    </div>
                </div>
            );
        } else {
            // enlarged map + story text view
            return (
                <div className="StoryView grid-x">
                    <div className="medium-6 cell">
                        <div style={{
                            "height": "85vh",
                        }}>
                            <MapView key={1} places={places.place} />
                        </div>
                    </div>
                    <div className="cell medium-6 grid-y">
                        <button
                            className="primary button cell"
                            onClick={this.expandMap.bind(this)}>
                            Shrink Map
                        </button>
                        <div className="grid-y cell">
                            {/* only render the active story versions */}
                            <ul className="button-group story-viewer-options">
                                {/* make the button secondary if that story version is not open */}
                                <li className={`button ${!storyVersionOpen[0] && "secondary"}`}
                                    onClick={this.storyViewerClickHandler.bind(this, 0)} style={{
                                        "marginLeft": "5px",
                                    }}>
                                    English Published
                                </li>
                                <li className={`button ${!storyVersionOpen[1] && "secondary"}`}
                                    onClick={this.storyViewerClickHandler.bind(this, 1)}>
                                    English Translation
                                </li>
                                {/* make the button secondary if that story version is not open */}
                                <li className={`button ${!storyVersionOpen[2] && "secondary"}`}
                                    onClick={this.storyViewerClickHandler.bind(this, 2)}>
                                    Danish Published
                                </li>
                                <li className={`button ${!storyVersionOpen[3] && "secondary"}`}
                                    onClick={this.storyViewerClickHandler.bind(this, 3)}>
                                    Danish Transcription
                                </li>
                            </ul>
                            <div className="grid-x">
                                {/* only render the active story versions */}
                                {storyVersionOpen.map((version, i) => version && (
                                    <div className="cell story" key={i} style={{
                                        "height": twoVersions ? "35vh" : "70vh",
                                        "margin": "5px",
                                        "wide": "10%",
                                    }}>
                                        <div className="card">
                                            <div className="card-section" style={{fontSize: this.state.fontSize+"px"}}>
                                                {this.renderComponentView(story[indexToVersion[i]], "Version")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
    }
}

StoryView.propTypes = {
    "actions": PropTypes.object.isRequired,
    "story": PropTypes.shape({
        "annotation": PropTypes.string.isRequired,
        "bibliographic_info": PropTypes.string,
        "bibliography_references": PropTypes.shape({
            "reference": PropTypes.array,
        }).isRequired,
        "danish_manuscript": PropTypes.string,
        "danish_publication": PropTypes.string,
        "english_manuscript": PropTypes.string,
        "english_publication": PropTypes.string,
        "etk_index": PropTypes.shape({
            "heading_danish": PropTypes.string,
            "heading_english": PropTypes.string,
            "id": PropTypes.number,
        }),
        "fielddiary_page_end": PropTypes.string,
        "fielddiary_page_start": PropTypes.string,
        "fieldtrip": PropTypes.shape({
            "id": PropTypes.number,
        }),
        "full_name": PropTypes.string,
        "genre": PropTypes.shape({
            "id": PropTypes.number,
            "name": PropTypes.string,
        }),
        "informant_first_name": PropTypes.string,
        "informant_full_name": PropTypes.string,
        "informant_id": PropTypes.number,
        "informant_last_name": PropTypes.string,
        "keywords": PropTypes.shape({
            "keyword": PropTypes.array,
        }),
        "order_told": PropTypes.number,
        "places": PropTypes.any,
        "publication_info": PropTypes.string,
        "stories_mentioned": PropTypes.any,
        "story_id": PropTypes.number,
        "tango_indices": PropTypes.shape({
            "tango_index": PropTypes.array,
        }),
    }),
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
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": {
            ...bindActionCreators(searchActions, dispatch),
            ...bindActionCreators(tabViewerActions, dispatch),
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoryView);
