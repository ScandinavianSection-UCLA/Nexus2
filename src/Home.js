import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import TabViewer from "./components/TabViewer/TabViewer";
import Heading from "./components/Heading/Heading.js";
import * as navigatorActions from "./actions/navigatorActions";
import * as tabViewerActions from "./actions/tabViewerActions";
import * as searchActions from "./actions/searchActions";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";

class Home extends Component {
    constructor() {
        super();
        // start in a state of loading
        this.state = {
            "loading": true,
        };
    }

    ComponentWithRegex({match}) {
        this.props.actions.addTab(123, match.params.tabs, "Stories");
        return (
            <TabViewer />
        );
    }

    render() {
        return (
            <div className="Home grid-y medium-grid-frame full">
                {/* without nested div, the Book View gets mega-compressed */}
                <div>
                    {/* Top banner with flag + title on left, book icon on right */}
                    <Heading />
                    <Switch>
                        {/* Everything else on the page */}
                        <Route exact path="/" component={TabViewer} />
                        <Route path="/:tabs" component={this.ComponentWithRegex.bind(this)} />
                    </Switch>
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    "actions": PropTypes.object.isRequired,
};

/**
 * Set certain props to access Redux states
 * @param {Object} state All possible Redux states
 * @returns {Object} Certain states that are set on props
 */
function mapStateToProps(state) {
    return {
        "navigatorState": state.navigator,
        "searchState": state.search,
    };
}

/**
 * Set the "actions" prop to access Redux actions
 * @param {*} dispatch Redux actions
 * @returns {Object} The actions that are mapped to props.actions
 */
function mapDispatchToProps(dispatch) {
    return {
        "actions": bindActionCreators({
            ...navigatorActions,
            ...tabViewerActions,
            ...searchActions,
        }, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
