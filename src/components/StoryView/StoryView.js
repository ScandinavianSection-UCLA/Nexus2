import React, {Component} from "react";
import Modal from "react-modal";
import "react-sliding-pane/dist/react-sliding-pane.css";
import RightBar from "../RightBar/RightBar";
import {getPeopleByID, getPlacesByID} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation, setPlaceIDList} from "../../utils";
import "./StoryView.css";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";

class StoryView extends Component {
    constructor() {
        super();
        this.state = {
            "StoryObject": {},
            "StoryPath": "",
            "isTabOpen": [true, false, false, false],
            "storyVersionOpen": [true, false, false, false, false],
            "twoVersions": false,
            "lastStoryVersionOpen": 0,
            "indexToVersion": {
                "0": "english_manuscript",
                "1": "english_publication",
                "2": "danish_manuscript",
                "3": "danish_publication",
            },
            "isPaneOpen": false,
        };
        this.renderStories = this.renderStories.bind(this);
        this.renderPlaces = this.renderPlaces.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.searchKeyword = this.searchKeyword.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    clickHandler(id, name, type) {
        // this.props.addID(id, name, type);
        this.props.tabViewerActions.addTab(id,name,type);
    }

    renderStories() {
        // console.log(this.props.story["stories_mentioned"])
        const {stories_mentioned} = this.props.story;
        if (stories_mentioned !== null) {
            var storyArray = arrayTransformation(stories_mentioned.story);
            return <ul>
                {storyArray.map((story, i) => {
                    const {story_id, full_name} = story;
                    return <li key={i} className="associated-items" onClick={
                        (e) => {
                            e.preventDefault();
                            this.clickHandler(story_id, full_name, "Stories");
                        }
                    }>{full_name}</li>;
                })}
            </ul>;
        } else {
            return <div className="callout alert">
                <h6>No related stories.</h6>
            </div>;
        }
    }

    renderPlaces() {
        const {place} = this.props.story.places;
        var placeArray = arrayTransformation(place);
        return <div>
            <h4>Associated Places</h4>
            <ul>
                {placeArray.map((place, i) => {
                    const {display_name, name, place_id} = place;
                    return <li key={i} className="associated-items" onClick={
                        (e) => {
                            e.preventDefault();
                            this.clickHandler(place_id, name, "Places");
                        }
                    }>{display_name}</li>;
                })}
            </ul>
        </div>;
    }

    accordionHandler(tab) {
        this.setState((prevState) => {
            prevState.isTabOpen = [false, false, false, false];
            prevState.isTabOpen[tab] = true;
            return {"isTabOpen": prevState.isTabOpen};
        });
    }

    placeRecorded() {
        var cleanArray = arrayTransformation(this.props.story["places"]["place"]);
        var placeObject = {};
        cleanArray.forEach((place) => {
            if (place["type"] === "place_recorded") {
                placeObject = place;
            }
        });
        return placeObject;
    }

    placesMentioned() {
        const cleanArray = arrayTransformation(this.props.story["places"]["place"]);
        var placeObjects = cleanArray.filter(place => place["type"] === "place_mentioned");
        console.log({cleanArray, placeObjects});
        return placeObjects;
    }

    bibliographicReferences() {
        const {bibliography_references} = this.props.story;
        if (bibliography_references === null) {
            return <div className="callout alert">
                <h6>No references for this story.</h6>
            </div>;
        } else {
            return <table>
                <tbody>
                    {
                        arrayTransformation(bibliography_references["reference"]).map((reference, i) => {
                            return <tr key={i}>
                                <td>{reference["display_string"]}</td>
                            </tr>;
                        })
                    }
                </tbody>
            </table>;
        }
    }

    storyViewerClickHandler(version) {
        // tODO: new line breaks /n + html tags (transform character into escape characters)
        this.setState((prevState) => {
            var {lastStoryVersionOpen, storyVersionOpen, twoVersions} = prevState;
            // check if more than 2 versions open
            var versionCount = storyVersionOpen.reduce((total, current) => current ? total + 1 : total);
            // check if clicked version is already open, if so then close it
            if (storyVersionOpen[version] === true) {
                if (versionCount >= 2) {
                    storyVersionOpen[version] = false;
                }
                twoVersions = false;

                storyVersionOpen.forEach((version, i) => {
                    if (version) {
                        lastStoryVersionOpen = i;
                    }
                });
            } else {
                twoVersions = true;
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
                "storyVersionOpen": storyVersionOpen,
                "lastStoryVersionOpen": lastStoryVersionOpen,
                "twoVersions": twoVersions,
            };
        });
    }

    renderProperty(property) {
        if (property !== null && typeof property !== "undefined") {
            return property;
        } else {
            return "N/A";
        }
    }

    renderComponentView(component, name) {
        if (component !== null && typeof component !== "undefined") {
            return component;
        } else {
            return <div className="callout alert">
                <h6>{name} does not exist.</h6>
            </div>;
        }
    }

    searchKeyword(keyword) {
        this.props.handleKeywordSearch(keyword);
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
        const {indexToVersion, isTabOpen, storyVersionOpen, twoVersions} = this.state;
        const cleanPlacesArray = setPlaceIDList(arrayTransformation(places["place"]), "Places");
        const PlaceObjectArray = places["place"];
        const PlacesArray = cleanPlacesArray.map(placeID => getPlacesByID(placeID));
        const storiesByPerson = getPeopleByID(informant_id)["stories"];
        // console.log(getPeopleByID(this.props.story["informant_id"]));
        const personData = getPeopleByID(informant_id);
        const searchKeyword = this.searchKeyword;
        return (
            <div className="StoryView grid-x">
                <div className="medium-3 cell">
                    <MapView height={"30vh"} places={PlacesArray} />
                    <ul className="accordion" data-accordian>
                        <li className={`accordion-item ${isTabOpen[0] ? "is-active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                this.accordionHandler.bind(this)(0);
                            }}>
                            <a href="" className="accordion-title">Story Data</a>
                            <div className="body">
                                <b>Order Told</b> {this.renderProperty.bind(this)(order_told)}<br />
                                <b>Recorded during fieldtrip</b> {this.renderProperty.bind(this)(fieldtrip["id"])}<br />
                                <b>Fieldtrip dates</b> {this.renderProperty.bind(this)(fieldtrip_start_date)} to {this.renderProperty.bind(this)(fieldtrip_end_date)}<br />
                                <b>Place recorded</b> {this.renderProperty.bind(this)(this.placeRecorded.bind(this)()["display_name"])} <br />
                                <b>Field diary pages</b> {this.renderProperty.bind(this)(fielddiary_page_start)} to {fielddiary_page_end}<br />
                                <b>Associated Keywords</b><br />{
                                    arrayTransformation(keywords["keyword"]).map((keyword, i) => {
                                        return <button
                                            className="button keyword-well"
                                            key={i}
                                            onClick={function() {
                                                searchKeyword(keyword["keyword"]);
                                            }}>{keyword["keyword"]}</button>;
                                    })
                                }<br />
                                <b>Places mentioned in story</b> {this.placesMentioned.bind(this)().map((place, i) => {
                                    return <span key={i} className="keyword-well">{place["name"]}</span>;
                                })}
                                <br />
                            </div>
                        </li>
                        <li className={`accordion-item ${isTabOpen[1] ? "is-active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                this.accordionHandler.bind(this)(1);
                            }}>
                            <a href="" className="accordion-title">Story Indices</a>
                            <div className="body">
                                <b>Genre</b> {genre["name"]}<br />
                                <b>ETK Index</b> {etk_index["heading_english"]}<br />
                                <b>Tangherlini Indices</b><br />
                                {arrayTransformation(tango_indices["tango_index"]).map((index, i) => {
                                    return <div className="keyword-well" key={i}>{index["display_name"]}</div>;
                                })}
                            </div>
                        </li>
                        <li className={`accordion-item ${isTabOpen[2] ? "is-active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                this.accordionHandler.bind(this)(2);
                            }}>
                            <a href="" className="accordion-title">Bibliographical References</a>
                            <div className="body">
                                {this.bibliographicReferences.bind(this)()}
                            </div>
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
                                        {/* <li className="secondary button">Manuscript</li>*/}
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
                                            {this.renderStories.bind(this)()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <RightBar view={"Stories"} object={story} bio={personData} places={PlaceObjectArray} stories={storiesByPerson} passID={this.clickHandler} />
                    </div>

                </div>

            </div>
        );
    }
}

StoryView.propTypes = {
    "annotation": PropTypes.string.isRequired,
    "bibliographic_info": PropTypes.string,
    "bibliographic_references": PropTypes.shape({
        "reference": PropTypes.array,
    }),
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
};

StoryView.defaultProps = {
    "annotation": "",
    "etk_index": {
        "heading_english": "",
    },
    "fielddiary_page_end": "",
    "fielddiary_page_start": "",
    "fieldtrip": {
        "id": null,
    },
    "fieldtrip_end_date": "",
    "fieldtrip_start_date": "",
    "full_name": "",
    "genre": {
        "name": "",
    },
    "informant_id": null,
    "informant_full_name": "",
    "keywords": {
        "keyword": [],
    },
    "order_told": null,
    "tango_indices": {
        "tango_index": [],
    },
};

StoryView.propTypes = {
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
)(StoryView);
