// react functionality
import React from "react";
// CSS styling
import "./HelpView.css";

class HelpView extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div className="HelpView">
                <div className="grid-container">
                    <h1>Need Help on...</h1>
                </div>
                <div className="grid-container">
                    <div className="grid-x grid-padding-x small-up-2 medium-up-3">
                        <div className="cell">
                            <a className="card">
                                <img src="" />
                                <div className="card-section">
                                    <h4>Getting Started</h4>
                                    <p>This row of cards is embedded in an X-Y Block Grid.</p>
                                </div>
                            </a>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src="" />
                                <div className="card-section">
                                    <h4>Story View / Person View</h4>
                                    <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src="" />
                                <div className="card-section">
                                    <h4>Place View / Fieldtrip View</h4>
                                    <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-container">
                    <div className="grid-x grid-padding-x small-up-2 medium-up-3">
                        <div className="cell">
                            <div className="card">
                                <img src="" />
                                <div className="card-section">
                                    <h4>User Nexus Graph</h4>
                                    <p>This row of cards is embedded in an X-Y Block Grid.</p>
                                </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src="" />
                                <div className="card-section">
                                    <h4>Search Features</h4>
                                    <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src="" />
                                <div className="card-section">
                                    <h4>Book Chapters.</h4>
                                    <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="mainContent">
                    <h1 id="gettingStarted">Getting Started</h1>
                    <p>
                        Welcome to the ETK Danish Folklore Nexus application! As a user, you are able to navigate through some of ETK’s vast collection of Danish folklore from his various fieldtrips across Denmark. <br />
                        Let’s start with the home tab!
                    </p>
                    <h2>Navigator and Display Tools</h2>
                    <img src={require("./images/navigatorhome.png")} />
                    <p>
                        On the home tab, you can navigate to any story, person, or place in the collection via the search bar or the navigator tools below it. To learn more about the search bar, please reference the Search Features help page.
                    </p>
                    <img src={require("./images/navigator1.png")} />
                    <p>
                        The data navigator tools allow you to select specific stories, people, or places which will be displayed in the center of the page. By default, stories will already be selected and displayed to you. You can use the search bar to help you find a specific item within the category you’ve selected!
                    </p>
                    <img src={require("./images/navigator2.png")} />
                    <p>
                        The topic and indices navigator tool will allow you to filter the stories by various indices organized by ETK, Professor Tangherlini, and other scholars. You will also be able to access fieldtrips through this navigator tool. You’ll also notice the results section will display what’s being selected at the moment. In this case, the Topic &amp; Index Navigator is being selected, but no specific index is selected so the display area is blank.
                    </p>
                    <h2>Timeline</h2>
                    <img src={require("./images/timeline1.png")} />
                    <p>
                        Select the item of interest from the display in the center. You can also filter the results shown in the center by time using the timeline feature at the top. To use the timeline feature, turn it on by clicking the switch on the top left. Then select the dates you wish to filter by.
                    </p>
                    <img src={require("./images/timeline2.png")} />
                    <p>
                        You can click on the date fields and use the red dot to drag the dates around.
                    </p>
                    <h2>Mini User Nexus and Map Tools</h2>
                    <img src={require("./images/sidebar.png")} />
                    <p>
                        Once you’ve mastered these sections, you will notice you have access to the Nexus Graph tool and the Map on the right side.
                    </p>
                    <h2>Nexus Graph</h2>
                    <img src={require("./images/nexus1.png")} />
                    <p>
                        The Nexus Graph displays all of the items you have opened and all of the connections between them. For instance, if you opened up a person and a story, and the story was told by the person, two dots will appear to represent the person and the story as well as a line between the two dots to indicate a direct relationship. If you haven’t opened an item then a “blank” green dot will appear. <br />
                        You can also double click on each dot to take you back to the tab with the person/place/story. This tool can help you discover the relationships between everything you’ve opened!
                    </p>
                    <img src={require("./images/nexus2.png")} />
                    <p>
                        Explore the tool more in depth by opening the nexus graph in a new tab.
                    </p>
                    <img src={require("./images/nexus3.png")} />
                    <p>
                        The Map below shows the location of all of the items from the center display. Click on the pin to see the location name and double click to open up the tab.
                    </p>
                    <h2>Tabs</h2>
                    <img src={require("./images/tab1.png")} />
                    <p>
                        As you open more tabs, drag the tabs around to re-order them.
                    </p>
                    <img src={require("./images/tab2.png")} />
                    <p id="num2">
                        Pin the tab by pressing the left pin icon. This will save the tab since there is a maximum number of tabs you can have open at a time to prevent overcrowding.
                    </p>
                    <h1>Story View and Person View</h1>
                    <h2>Story View</h2>
                    <img src={require("./images/storyviewhome.png")} />
                    <h3>Left Bar</h3>
                    <p>
                        The Story View centralizes all indexical information on the left bar as well as a map with all the associated places pinned onto the map. This contains various story-specific information or indices associated with the story.
                    </p>
                    <img src={require("./images/storyview1.png")} />
                    <p>
                        Click on a grey box to see other stories are related to that keyword in the home tab.
                    </p>
                    <img src={require("./images/storyview2.png")} />
                    <p>
                        The clicking the keyword will take you directly to the home tab and we can see the other stories related to the keyword!
                    </p>
                    <h3>Selecting Story Versions</h3>
                    <img src={require("./images/storyview3.png")} />
                    <p>
                        View the story in different versions by clicking on the top labels.
                    </p>
                    <img src={require("./images/storyview4.png")} />
                    <p>
                        You can select up to 2 labels. When there are two labels active and you want to eliminate a label, just click the label again.
                    </p>
                    <h3>Bottom Annotations and Related Stories</h3>
                    <img src={require("./images/storyview5.png")} />
                    <p>
                        Below each story contains applicable annotations and related stories. Related stories are generated through network analysis similar to the Nexus Graph.
                    </p>
                    <h3>Right Bar</h3>
                    <img src={require("./images/storyview6.png")} />
                    <p>
                        The right grey bar contains all of the associated person, places, and stories.
                    </p>
                    <img src={require("./images/storyview7.png")} />
                    <p>
                        The associated person is the storyteller who was recorded sharing that story.
                    </p>
                    <img src={require("./images/storyview8.png")} />
                    <p>
                        Associated places are labeled with each place’s relationship to the story.
                    </p>
                    <img src={require("./images/storyview9.png")} />
                    <p>
                        Associated stories are other stories told by the same story teller.
                    </p>
                    <h2>Person View</h2>
                    <img src={require("./images/personviewhome.png")} />
                    <p>
                        The Person View contains basic information regarding the storyteller. There’s a short biography related to the person below, and the full biography can be found in the book if the informant was one of the primary informant. The map on the right displays all the places associated with the person.
                    </p>
                    <h1>Place View and Fieldtrip View</h1>
                    <img src={require("./images/placeviewhome.png")} />
                    <p>
                        Both views are map-focused to allow you to focus exploring the geographical relationships of the location presented. Blue pin represents a story was mentioned at this location. Red pin represents a story was told at this location. Purple pin typically represents a location unrelated to a story or an uncategorized location.
                    </p>
                    <h2>Place View</h2>
                    <h3>Zoom</h3>
                    <img src={require("./images/placeview1.png")} />
                    <p>
                        On the Place View, scroll up/down to zoom or use the plus/minus tool in the top left.
                    </p>
                    <h3>Switching Maps (Layers)</h3>
                    <img src={require("./images/placeview2.png")} />
                    <img src={require("./images/placeview3.png")} />
                    <p>Use the layers button on the top right to switch between the high board map, low board map, and the modern-day map.</p>
                    <img src={require("./images/placeview4.png")} />
                    <p>The right bar will have associated people, stories that mention the place, and stories that were collected at the place. </p>
                    <h2>Fieldtrip View</h2>
                    <img src={require("./images/fieldtripviewhome.png")} />
                    <p>
                        On the Fieldtrip View, all the places visited by ETK on this particular trip will be displayed.<br />
                        The right bar will have associated people, places, and stories that were encountered on the fieldtrip.
                    </p>
                    <h2>Nexus Graph</h2>
                    <p>
                        This is a tool to help you visualize the relationship between all of the people, places, stories, and fieldtrips you’ve opened.<br />
                        Each person, place, story, and fieldtrip is represented by a colored dot (node). There’s a legend for explaining the color codes for each node on the left bar. <br />
                        Drag the node to get a better view of the connects.<br />
                        Double click on each node to return to the tab that created it.<br />
                        There are two types of connections (edges) that can be formed between two nodes: primary and secondary.<br />
                        A primary edge is a direct relationship with the nodes. For instance, Jens (Bitte Jens) Kristensen told 150 - 1.23 - DS_1_533 or Jens (Bitte Jens) Kristensen was born in Ersted. These edges are color coded light blue.<br />
                        A secondary edge is an indirect relationship with the nodes. For instance, 150 - 1.23 - DS_1_533 and 150 - 0.02 - JAH_IV_348 are both told by Jens (Bitte Jens) Kristensen. These edges are color coded light green.<br />
                        Rule of thumb: Anytime when only one connection phrase is required to connect two nodes will be considered a primary edge. Anytime when an edge requires another node to explain the relationship will be considered a secondary edge.
                    </p>
                    <h2>Search Features</h2>
                    <p>
                        By default, the search bar on the home tab will search through whatever is in the results displayed on the right. Use the Data Navigator as well as the Topic &amp; Index Navigator to specify what you’d like to search through.<br />
                        If you’d like to search a particular keyword across all the stories, people, and places select the “Keyword Search Only” checkbox. This will clear what’s in the results section to allow you to search across the whole dataset. <br />
                        In the case there is no exact matches for your search, the most closely related results will be displayed.
                    </p>
                    <h2>Book Chapters</h2>
                    <p>
                        The companion book with this application is displayed through an e-reader. You can select a specific chapter in the book by click on the book icon on the top right. This will create a new tab opened to the specific chapter.<br />
                        Navigate through the book by using the left and right arrows.<br />
                        You can also navigate through the entire book through the table of contents on the top left. By clicking on a chapter/section from there you will be able to skip to the location within the same book tab.<br />
                        You can also search through the entire book by using the search bar at the top. Clicking on one of the results will take you to the location of the result, but the result will not be highlighted (a feature still in process!)
                    </p>
                </div>
            </div>
        );
    }
}

export default HelpView;
