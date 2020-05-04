import React, {Component} from "react";
import Modal from "react-modal";
import "react-sliding-pane/dist/react-sliding-pane.css";
import RightBar from "../RightBar/RightBar";
import {getManuscriptURI, getPeopleByID} from "../../data-stores/DisplayArtifactModel";
import {arrayTransformation} from "../../utils";
import {addNode} from "../NexusGraph/NexusGraphModel";
import "./ManuscriptReader.css";
import MapView from "../MapView/MapView";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as searchActions from "../../actions/searchActions";
import * as tabViewerActions from "../../actions/tabViewerActions";
import connect from "react-redux/es/connect/connect";
import ReactImageMagnify from 'react-image-magnify';

class ManuscriptReader extends Component {
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

    }


    render() {
        getManuscriptURI(4);
        return (
            <div className="ManuscriptReader grid-x">
                {/*<img style={{"marginTop": "-1.7%", "marginRight": "1%"}} src={} alt="person icon" />*/}
                <ReactImageMagnify {...{
                    smallImage: {
                        alt: 'Wristwatch by Ted Baker London',
                        isFluidWidth: true,
                        src: "https://cdn.shopify.com/s/files/1/0150/0232/products/Pearl_Valley_Swiss_Slices_36762caf-0757-45d2-91f0-424bcacc9892_1024x1024.jpg?v=1534871055"
                    },
                    largeImage: {
                        src: "https://cdn.shopify.com/s/files/1/0150/0232/products/Pearl_Valley_Swiss_Slices_36762caf-0757-45d2-91f0-424bcacc9892_1024x1024.jpg?v=1534871055",
                        width: 1200,
                        height: 1800
                    }}
                }/>
            </div >
        );
    }
}

ManuscriptReader.propTypes = {
    "actions": PropTypes.object.isRequired,
    "storyID": PropTypes.number.isRequired, //expecting a storyID as a number
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
)(ManuscriptReader);
