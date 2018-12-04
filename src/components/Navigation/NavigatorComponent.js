import React, {Component} from "react";
import "./navigatorComponent.css";
import NavigationDropdownMenu from "./NavigationDropdownMenu";
import {arrayTransformation} from "../../utils";
import {getList, ontologyToDisplayKey, tangoTypes} from "../../data-stores/DisplayArtifactModel";
import PropTypes from "prop-types";
import {getSessionStorage, setSessionStorage} from "../../data-stores/SessionStorageModel";
import * as navigatorActions from "../../actions/navigatorActions";
import * as searchActions from "../../actions/searchActions";
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "path": ["Data Navigator"],
            "displayItemsList": [],
            "dataNavView": true,
            "dropdownLists": [],
            "activeList": null,
            "navigators": [
                {"name": "Data Navigator", "tabClass": "tab cell medium-6 dataNavView active"},
                {"name": "Topic & Index Navigator", "tabClass": "tab cell medium-6 TINavView"},
            ],
            "dataNav": ["People", "Places", "Stories"],
            "TINav": ["ETK Index", "Tangherlini Index", "Fieldtrips", "Genres"],
        };
        const prevSelection = getSessionStorage("SelectedNavOntology");
        if (prevSelection !== null) {
            const {data} = prevSelection;
            let isPPS = (data === "People" || data === "Places" || data === "Stories");
            // check if the topics and indices navigation tab should be active
            if (!isPPS) {
                this.state = {
                    ...this.state,
                    "navigators": [
                        {"name": "Data Navigator", "tabClass": "tab cell medium-6 dataNavView"},
                        {"name": "Topic & Index Navigator", "tabClass": "tab cell medium-6 TINavView active"},
                    ],
                    "dataNavView": false,
                    "dataNav": ["People", "Places", "Stories"],
                    "TINav": ["ETK Index", "Tangherlini Index", "Fieldtrips", "Genres"],
                };
            }
            if (!this.state.dataNav.includes(prevSelection.data)) {
                this.state.path = ["Topic & Index Navigator"];
            }
        }
        this.handleLevelTwoClick = this.handleLevelTwoClick.bind(this);
    }

    // componentDidMount() {
    //     // no keyword loaded
    //     if (this.props.searchState.inputValue === "") {
    //         // get state from session storage
    //         const prevSelection = getSessionStorage("SelectedNavOntology");
    //         if (prevSelection === null) {
    //             // if we got nothing, go to stories
    //             this.handleLevelTwoClick("Stories");
    //         } else {
    //             // otherwise go to what was loaded
    //             this.handleLevelTwoClick(prevSelection.data);
    //         }
    //     } else {
    //         // keyword loaded, we'll be looking at the stories
    //         this.props.setDisplayLabel("Data Navigator > Stories");
    //         // show the results associated with it
    //         this.props.actions.displayItems(this.props.searchState.results);
    //     }
    // }

    handleTabClick(nav) {
        // reset search
        this.props.actions.setSearch(false);
        // resets displayed results
        this.props.actions.displayItems([]);
        if (nav.name === "Data Navigator") {
            this.setState((oldState) => {
                oldState.dataNavView = true;
                // erase any existing dropdown lists
                oldState.dropdownLists = [];
                oldState.navigators = [
                    {"name": "Data Navigator", "tabClass": "tab cell medium-6 dataNavView active"},
                    {"name": "Topic & Index Navigator", "tabClass": "tab cell medium-6 TINavView"},
                ];
                oldState.path = ["Data Navigator"];
                return oldState;
            }, () => {
                this.props.setDisplayLabel(this.state.path.join());
            });
        } else {
            this.setState((oldState) => {
                oldState.dataNavView = false;
                oldState.dropdownLists = [];
                oldState.navigators = [
                    {"name": "Data Navigator", "tabClass": "tab cell medium-6 dataNavView "},
                    {"name": "Topic & Index Navigator", "tabClass": "tab cell medium-6 TINavView active"},
                ];
                oldState.path = ["Topic & Index Navigator"];
                return oldState;
            }, () => {
                this.props.setDisplayLabel(this.state.path.join());
            });
        }
    }

    // level 2 = indices, people, places, stories
    handleLevelTwoClick(ontology) {
        // reset search
        this.props.actions.setSearch(false);
        // save selected ontology to session storage so the selection will remain if the user switches tabs
        setSessionStorage("SelectedNavOntology", {
            "data": ontology,
        });
        let list = getList(ontology);
        // if it is person, place, story, or fieldtrip
        if (["Fieldtrips", "People", "Places", "Stories"].includes(ontology)) {
            // send to navigation to display results
            this.props.actions.displayItems(list);
            // highlight clicked ontology and set dropdownLists to nothing
            this.setState((oldState) => ({
                "activeList": ontology,
                "dropdownLists": [],
                "path": [oldState.path[0], ontology],
            }), () => {
                // set display label (above search results)
                this.props.setDisplayLabel(this.state.path.join(" > "));
            });
        } else {
            // reset results display
            this.props.actions.displayItems([]);
            // create additional options for people to be in the dropdown menu so people can select everything in the menu
            const displayKey = ontologyToDisplayKey[ontology];
            let listObject, selectValue;
            if (ontology === "ETK Index") {
                selectValue = `[Select ${ontology}]`;
            } else {
                selectValue = `[Select ${ontology.slice(0, -1)}]`;
            }
            // if selected item isn't in the dropdown list
            if (!list.some((item) => item[displayKey] === selectValue)) {
                // add it in at the front
                list.unshift({
                    [displayKey]: selectValue,
                });
            }
            // for tango indices
            if (ontology === "Tangherlini Index") {
                listObject = {
                    displayKey,
                    "list": [
                        "[Select a Class]",
                        ...Object.keys(tangoTypes),
                    ],
                    ontology,
                    selectValue,
                    "tango": true,
                };
            } else {
                // if it is an indice that isn't a tango index
                listObject = {
                    displayKey,
                    list,
                    ontology,
                    selectValue,
                    "tango": false,
                };
            }
            // highlight clicked ontology
            this.setState((oldState) => ({
                "activeList": ontology,
                "dropdownLists": [listObject],
                "path": [oldState.path[0], ontology],
            }), () => {
                // set display label (above search results)
                this.props.setDisplayLabel(this.state.path.join(" > "));
            });
        }
    }

    selectMenu(selectedItem, isTango) {
        // reset search
        this.props.actions.setSearch(false);
        // for non-Tango Index dropdowns
        if (!isTango) {
            // make sure that we didn't re-select the [Select a ___] option from the dropdown
            if (typeof selectedItem.id !== "undefined") {
                let storiesList = arrayTransformation(selectedItem.stories.story);
                this.setState((oldState) => {
                    let newDropdownList = oldState.dropdownLists;
                    newDropdownList[newDropdownList.length - 1].selectValue = selectedItem.name;
                    let NameKey = "";
                    if ("name" in selectedItem) {
                        NameKey = "name";
                    } else if ("heading_english" in selectedItem) {
                        NameKey = "heading_english";
                    }
                    if (oldState.path.length >= 3 && oldState.path.indexOf("Tangherlini Index") === -1) {
                        oldState.path = oldState.path.slice(0, 2);
                    } else if (oldState.path.length >= 4 && newDropdownList.indexOf("[Select Class]") === -1) {
                        oldState.path = oldState.path.slice(0, 3);
                    }
                    oldState.path.push(selectedItem[NameKey]);
                    return {
                        "dropdownLists": newDropdownList,
                        "path": oldState.path,
                    };
                }, () => {
                    this.props.setDisplayLabel(this.state.path.join(" > "));
                    this.props.actions.displayItems(storiesList);
                    localStorage.setItem("navCompState", this.state);
                });
            } else {
                // reset the dropdown state to the unselected tango index state, since that's what was clicked
                this.setState(function(prevState) {
                    return {
                        // set the dropdown to be
                        "dropdownLists": [{
                            // the first dropdown
                            ...prevState.dropdownLists[0],
                            // but make sure that the selected value is the [Select a ___] option
                            "selectValue": selectedItem.heading_english,
                        }],
                    };
                });
            }
        } else if (selectedItem !== "[Select a Class]") {
            // selected Tango index, but not the null option
            // need to make second dropdown list with those types
            this.setState((oldState) => {
                let newList = tangoTypes[selectedItem].children;
                let selectString = "[Select an Ontology]";
                let selectObj = {"name": selectString};
                newList.unshift(selectObj);
                let listObject = {
                    "selectValue": selectString,
                    "displayKey": "name",
                    "ontology": "",
                    "tango": false,
                    "list": newList,
                };
                let newDropdownList = oldState.dropdownLists;
                newDropdownList.splice(1, 1, listObject);
                newDropdownList[0].selectValue = selectedItem;
                if (oldState.path.length >= 3 &&
                    (oldState.path.indexOf("Tangherlini Index") === -1 || newDropdownList[0].list.indexOf("[Select a Class]") >= 0)) {
                    oldState.path = oldState.path.slice(0, 2);
                } else if (oldState.path.length >= 4 && newDropdownList.indexOf("[Select Class]") === -1) {
                    oldState.path = oldState.path.slice(0, 3);
                }
                oldState.path.push(selectedItem);
                return {
                    "dropdownLists": newDropdownList,
                    "path": oldState.path,
                };
            }, () => {
                this.props.setDisplayLabel(this.state.path.join(" > "));
                localStorage.setItem("navCompState", this.state);
            });
        } else {
            // reset the dropdown state to the unselected tango index state, since that's what was clikced
            this.setState(function(prevState) {
                return {
                    // set the dropdown to be
                    "dropdownLists": [{
                        // the first dropdown
                        ...prevState.dropdownLists[0],
                        // but make sure that the selected value is the [Select a Class] option
                        "selectValue": "[Select a Class]",
                    }],
                };
            });
        }
    }

    render() {
        const ontologyType = this.state.dataNavView ? "dataNav" : "TINav";
        return (
            <div className="NavigatorComponent">
                <div className="grid-y">
                    <div className="navigator-tabs cell medium-1">
                        <div className="grid-x">
                            {this.state.navigators.map((nav, i) => {
                                return <div className={`${nav.tabClass} cell medium-6`} key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.handleTabClick(nav);
                                    }}>
                                    {nav.name}
                                </div>;
                            })}
                        </div>
                    </div>
                    <div className="navigator-options-wrapper cell medium-11">
                        <div className={`cell ${this.state.dataNavView ? "active dataNavView" : "TINavView active"}`}>
                            <ul className="ontologyList">
                                {this.state[ontologyType].map((ontology, i) => {
                                    return <li className={`ontology ${ontology}${this.state.activeList === ontology ? " active" : ""}`} key={i}
                                        onClick={() => {
                                            this.handleLevelTwoClick(ontology);
                                        }}>
                                        {ontology}
                                    </li>;
                                })}
                            </ul>
                        </div>
                        {
                            this.state.dropdownLists.map((list, i) => {
                                return <NavigationDropdownMenu className="cell"
                                    list={list}
                                    handleMenuSelect={this.selectMenu.bind(this)}
                                    key={i} />;
                            })
                        }
                    </div>
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
        "searchState": state.search,
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
            ...bindActionCreators(navigatorActions, dispatch),
        },
    };
}

Navigation.propTypes = {
    "actions": PropTypes.object.isRequired,
    "searchState": PropTypes.shape({
        "inputValue": PropTypes.string.isRequired,
        "results": PropTypes.array.isRequired,
    }).isRequired,
    "searchWord": PropTypes.string.isRequired,
    "setDisplayLabel": PropTypes.func.isRequired,
    "state": PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
