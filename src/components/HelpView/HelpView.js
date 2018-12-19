// react functionality
import React from "react";
// CSS styling
import "./HelpView.css";

class HelpView extends React.Component {
    render() {
        return (
            <div className="HelpView">
                <div className="grid-container">
                    <h1>Need Help on...</h1>
                </div>
                <div className="grid-container">
                    <div className="grid-x grid-padding-x small-up-2 medium-up-3">
                        <div className="cell">
                            <div className="card">
                                <img src=""/>
                                    <div className="card-section">
                                        <h4>Getting Started</h4>
                                        <p>This row of cards is embedded in an X-Y Block Grid.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src=""/>
                                    <div className="card-section">
                                        <h4>Story View / Person View</h4>
                                        <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src=""/>
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
                                <img src=""/>
                                <div className="card-section">
                                    <h4>User Nexus Graph</h4>
                                    <p>This row of cards is embedded in an X-Y Block Grid.</p>
                                </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src=""/>
                                <div className="card-section">
                                    <h4>Search Features</h4>
                                    <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                </div>
                            </div>
                        </div>
                        <div className="cell">
                            <div className="card">
                                <img src=""/>
                                <div className="card-section">
                                    <h4>Book Chapters.</h4>
                                    <p>It has an easy to override visual style, and is appropriately subdued.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HelpView;
