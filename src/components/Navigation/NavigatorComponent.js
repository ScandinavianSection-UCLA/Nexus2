import React, {Component} from "react";
import "./navigatorComponent.css";
import NavigationDropdownMenu from "./NavigationDropdownMenu";
import {arrayTransformation} from "../../utils";
import {getList, ontologyToDisplayKey, tangoTypes} from "../../data-stores/DisplayArtifactModel";
import PropTypes from "prop-types";
import {getSessionStorage, setSessionStorage} from "../../data-stores/SessionStorageModel";
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
            "keywordClicked": props.searchWord !== "",
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

    componentDidMount() {
        const prevSelection = getSessionStorage("SelectedNavOntology");
        if (prevSelection !== null) {
            this.handleLevelTwoClick(prevSelection.data);
        } else {
            this.handleLevelTwoClick("Stories");
        }
    }

    handleTabClick(nav) {
        // reset search
        this.props.searchActions.setSearch(true);
        // this.props.searchOn(false);
        // resets displayed results
        this.props.handleDisplayItems([], "");
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
        // this.props.searchOn(false);
        this.props.searchActions.setSearch(false)
        // save selected ontology to session storage so the selection will remain if the user switches tabs
        setSessionStorage("SelectedNavOntology", {
            "data": ontology,
        });
        // if this wasn't loaded after a keyword was clicked
        if (!this.state.keywordClicked) {
            // reset results display
            this.props.handleDisplayItems([], "");
            let itemsList = getList(ontology);
            let listObject = {};
            let isPPSF = (ontology === "People" || ontology === "Places" || ontology === "Stories" || ontology === "Fieldtrips");
            let selectString, displayKey;
            // if it is part of Data navigator or it's a fieldtrip
            if (isPPSF) {
                // send to navigation to display results
                this.props.handleDisplayItems(itemsList, ontology);
                // highlight clicked ontology and set dropdownLists to nothing
                this.setState((oldState) => {
                    if (oldState.path.length >= 2) {
                        oldState.path = oldState.path.slice(0, 1);
                    }
                    oldState.path.push(ontology);
                    return {
                        "activeList": ontology,
                        "path": oldState.path,
                        "dropdownLists": [],
                    };
                }, function() {
                    // set display label (above search results)
                    this.props.setDisplayLabel(this.state.path.join(" > "));
                });
            } else {
                // create additional options for people to be in the dropdown menu so people can select everything in the menu
                selectString = "";
                if (ontology !== "ETK Index") {
                    selectString = `[Select ${ontology.slice(0, -1)}]`;
                } else {
                    selectString = `[Select ${ontology}]`;
                }
                displayKey = ontologyToDisplayKey[ontology];
                let selectObject = {};
                selectObject[displayKey] = selectString;
                let inList = false;
                itemsList.forEach((item) => {
                    if (item[displayKey] === selectObject[displayKey]) {
                        inList = true;
                    }
                });

                if (!inList) {
                    itemsList.unshift(selectObject);
                }
                // highlight clicked ontology
                this.setState((oldState) => {
                    if (oldState.path.length >= 2) {
                        oldState.path = oldState.path.slice(0, 1);
                    }
                    oldState.path.push(ontology);
                    return {
                        "activeList": ontology,
                        "path": oldState.path,
                    };
                }, () => {
                    // set display label (above search results)
                    this.props.setDisplayLabel(this.state.path.join(" > "));
                });
            }
            if (ontology !== "Tangherlini Index" && !isPPSF) {
                // if it is an indice that isn't a tango index
                listObject = {
                    "selectValue": selectString,
                    "displayKey": displayKey,
                    "ontology": ontology,
                    "tango": false,
                    "list": itemsList,
                };
                // highlight clicked ontology
                this.setState({
                    "activeList": ontology,
                    "dropdownLists": [listObject],
                });
            } else if (!isPPSF) {
                // ontology === tangherlini indices
                let tangoTypesList = Object.keys(tangoTypes);
                tangoTypesList.unshift("[Select a Class]");
                listObject = {
                    "selectValue": selectString,
                    "displayKey": displayKey,
                    "ontology": ontology,
                    "tango": true,
                    "list": tangoTypesList,
                };

                // highlight clicked ontology
                this.setState({
                    "activeList": ontology,
                    "dropdownLists": [listObject],
                });
            }
        } else {
            // if a keyword was clicked, just set the default little bookmark thing
            this.props.setDisplayLabel("Data Navigator > Stories");
            this.setState({
                // update it so that we can actually select other things
                "keywordClicked": false,
            });
        }
    }

    selectMenu(selectedItem, isTango) {
        // reset search
        // this.props.searchOn(false);
        this.props.searchActions.setSearch(false)
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
                    this.props.handleDisplayItems(storiesList, "Stories");
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

function mapStateToProps(state) {
    return {
        "state": state.tabViewer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "searchActions": bindActionCreators(searchActions, dispatch),
    };
}

Navigation.propTypes = {
    "handleDisplayItems": PropTypes.func.isRequired,
    "searchWord": PropTypes.string.isRequired,
    "setDisplayLabel": PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
