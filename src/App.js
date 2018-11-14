import React, {Component} from "react";
import TabViewer from "./components/TabViewer/TabViewer";
import Heading from "./components/Heading/Heading.js";
import "./App.css";

class App extends Component {
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

    render() {
        return (
            <div className="App grid-y medium-grid-frame full">
                {/* without nested div, the Book View gets mega-compressed */}
                <div>
                    {/* Top banner with flag + title on left, book icon on right */}
                    <Heading />
                    {/* Everything else on the page */}
                    <TabViewer />
                </div>
            </div>
        );
    }
}

export default App;
