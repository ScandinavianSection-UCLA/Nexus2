import React, {Component} from "react";
import { Switch, Route } from 'react-router-dom';
import TabViewer from "./components/TabViewer/TabViewer";
import Heading from "./components/Heading/Heading.js";
import * as navigatorActions from "./actions/navigatorActions";
import * as tabViewerActions from "./actions/tabViewerActions";
import * as searchActions from "./actions/searchActions"
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

    componentDidMount() {
        // simulate async action and remove loader
        setTimeout(() => this.setState({"loading": false}), 1500);
    }

    ComponentWithRegex({ match }) {
        console.log(match.params.tabs);
        this.props.actions.addTab(123, match.params.tabs, 'Stories');
        return (
            <TabViewer/>
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
                        <Route exact path='/' component={TabViewer}/>
                        <Route path='/:tabs' component={this.ComponentWithRegex.bind(this)}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

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