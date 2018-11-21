import React, {Component} from "react";
import Modal from "react-modal";
import "react-sliding-pane/dist/react-sliding-pane.css";
import RightBar from "../RightBar/RightBar";
import {getPeopleByID, getPlacesByID} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation, getPlaceIDList} from "../../utils";
import {addNode} from "../NexusGraph/NexusGraphModel";
import "./StoryView.css";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

const indexToVersion = {
    "0": "english_manuscript",
    "1": "english_publication",
    "2": "danish_manuscript",
    "3": "danish_publication",
};

class StoryView extends Component {
    constructor(props) {
        super(props);
        // set initial state
        this.state = {
            // start with the first accordion tab open
            "openTab": 0,
            "storyVersionOpen": [true, false, false, false, false],
            // two versions wouldn't be open
            "twoVersions": false,
            "lastStoryVersionOpen": 0,
        };
        // out of all the story's places
        this.placeRecorded = arrayTransformation(props.story.places.place)
            // find the one that is where this story was recorded
            .find((place) => place.type === "place_recorded");
        // out of all the story's places
        this.placesMentioned = arrayTransformation(props.story.places.place)
            // find the ones that are mentioned in story
            .filter(place => place.type === "place_mentioned");
        // properly bind functions so that they work inside sub-elements
        this.renderStories = this.renderRelatedStories.bind(this);
        this.renderProperty = this.renderProperty.bind(this);
        this.accordionHandler = this.accordionHandler.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
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
                                this.props.tabViewerActions.addTab(story_id, full_name, "Stories");
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
        if (bibliography_references === null) {
            return <div className="callout alert">
                <h6>No references for this story.</h6>
            </div>;
        } else {
            return <table>
                <tbody>{
                    // display each reference on a row
                    arrayTransformation(bibliography_references.reference).map((reference) => {
                        let {display_string} = reference;
                        return <tr key={display_string}>
                            <td>{display_string}</td>
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
            let versionCount = storyVersionOpen.reduce((totalOpen, version) => version ? totalOpen + 1 : totalOpen);
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
                lastStoryVersionOpen = storyVersionOpen.findIndex((version) => version);
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
                storyVersionOpen,
                lastStoryVersionOpen,
                twoVersions,
            };
        });
    }

    renderProperty(property) {
        // if the property is defined, that should be displayed, otherwise not applicable
        return property !== null && typeof property !== "undefined" ? property : "N/A";
    }

    renderComponentView(component, name) {
        // if the component is defiend, it should be displayed, otherwise notify that it doesn't exist
        return component !== null && typeof component !== "undefined" ? component : (
            <div className="callout alert">
                <h6>{name} does not exist.</h6>
            </div>
        );
    }

    render() {
        const {story} = this.props;
        const {
            annotation,
            etk_index,
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
        } = story;
        const personData = getPeopleByID(informant_id);
        const {openTab, storyVersionOpen, twoVersions} = this.state;
        const PlaceObjectArray = places.place;
        const PlacesArray = getPlaceIDList(arrayTransformation(places.place)).map(placeID => getPlacesByID(placeID));
        return (
            <div className="StoryView grid-x">
                <div className="medium-3 cell">
                    <MapView height={"30vh"} places={PlacesArray} />
                    <ul className="accordion" data-accordian>
                        <li className={`accordion-item ${openTab === 0 ? "is-active" : ""}`}>
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
                                                    // start a search by this keyword
                                                    this.props.tabViewerActions.addTab(this.placeRecorded.place_id, this.placeRecorded.name, "Places");
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
                                            : "N/A"}
                                    <br />
                                    <b>Associated Keywords</b><br />{
                                        // for each of the keywords
                                        arrayTransformation(keywords.keyword).map((keyword, i) => {
                                            // return a well that triggers a serach by that keyword when clicked
                                            return <button
                                                // make it a button-well
                                                className="button keyword-well"
                                                key={i}
                                                // when it is clicked
                                                onClick={() => {
                                                    // start a search by this keyword
                                                    this.props.handleKeywordSearch(keyword.keyword);
                                                }}>{keyword.keyword}</button>;
                                        })
                                    }<br />
                                    <b>Places mentioned in story</b> {
                                        // are there any mentioned places
                                        this.placesMentioned.length > 0
                                            // if so, for each of the mentioned places
                                            ? this.placesMentioned.map((place, i) => {
                                                return <button
                                                    key={i}
                                                    // make it a button-well
                                                    className="button keyword-well"
                                                    // when it is clicked
                                                    onClick={() => {
                                                        // open up the tab related to this place
                                                        this.props.tabViewerActions.addTab(place.place_id, place.name, "Places");
                                                    }}>{place.name}</button>;
                                                // otherwise, this is not applicable
                                            }) : "N/A"}
                                </div>}
                        </li>
                        <li className={`accordion-item ${openTab === 1 ? "is-active" : ""}`}>
                            <a
                                className="accordion-title"
                                onClick={() => {
                                    // when clicked, toggle the middle tab
                                    this.accordionHandler(1);
                                }}>Story Indices</a>
                            {/* only show indices if that is the open accordion tab */}
                            {openTab === 1 &&
                                <div className="body">
                                    <b>Genre</b> <button className="button keyword-well">{genre.name}</button><br />
                                    <b>ETK Index</b> <button className="button keyword-well">{etk_index.heading_english}</button><br />
                                    <b>Tangherlini Indices</b><br />
                                    {arrayTransformation(tango_indices.tango_index).map((index, i) => {
                                        return <div className="button keyword-well" key={i}>{index.display_name}</div>;
                                    })}
                                </div>}
                        </li>

                        <li className={`accordion-item ${openTab === 2 ? "is-active" : ""}`}>
                            <a
                                className="accordion-title"
                                onClick={() => {
                                    // when clicked, toggle the bottom tab
                                    this.accordionHandler(2);
                                }}>Bibliographical References</a>
                            {/* only show references if that is the open tab */}
                            {openTab === 2 &&
                                <div className="body">
                                    {this.bibliographicReferences.bind(this)()}
                                </div>}
                        </li>
                    </ul>
                </div>
                <div className="medium-9 cell">
                    <h2 className="title">
                        <img src="https://png.icons8.com/ios/42/000000/chat-filled.png"
                            style={{"marginTop": "-1%", "marginRight": "1%"}} alt="story icon" />
                        {full_name}
                    </h2>
                    <h4 style={{"marginLeft": "1.5%"}}>{informant_full_name}</h4>
                    <div className="grid-x">
                        <div className="medium-11 cell">
                            <div className="grid-padding-x">
                                <div className="story-viewer cell">
                                    <ul className=" button-group story-viewer-options">
                                        <li className={`button ${storyVersionOpen[0] ? "" : "secondary"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.storyViewerClickHandler.bind(this)(0);
                                            }}>English ms Translation</li>
                                        <li className={`button ${storyVersionOpen[1] ? "" : "secondary"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.storyViewerClickHandler.bind(this)(1);
                                            }}>English Published Version</li>
                                        <li className={`button ${storyVersionOpen[2] ? "" : "secondary"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.storyViewerClickHandler.bind(this)(2);
                                            }}>Danish ms Transcription</li>
                                        <li className={`button ${storyVersionOpen[3] ? "" : "secondary"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.storyViewerClickHandler.bind(this)(3);
                                            }}>Danish Published Version</li>
                                    </ul>
                                    <div className="grid-x">
                                        {storyVersionOpen.map((version, i) => {
                                            if (version) {
                                                return <div className={`cell story ${twoVersions ? "medium-6" : ""}`} key={i}>
                                                    <div className="card">
                                                        <div className="card-section">
                                                            {this.renderComponentView.bind(this)(story[indexToVersion[i]], "Version")}
                                                        </div>
                                                    </div>
                                                </div>;
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </div>
                                <div className="cell">
                                    <div className="grid-x">
                                        <div className="medium-8 cell">
                                            <div className="card annotation">
                                                <h5 className="title">Annotation</h5>
                                                <div className="card-section">
                                                    {this.renderComponentView.bind(this)(annotation, "Annotation")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="medium-4 cell relatedStories">
                                            <h5 className="title">Related Stories</h5>
                                            {this.renderRelatedStories.bind(this)()}
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
                            stories={personData !== null ? personData.stories : []} />
                    </div>

                </div>

            </div >
        );
    }
}

StoryView.propTypes = {
    "handleKeywordSearch": PropTypes.func.isRequired,
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
)(StoryView);
