import React, { Component } from 'react';
import TabViewer from './components/TabViewer/TabViewer';
import Heading from './components/Heading/Heading.js'
import './App.css';


class App extends Component {

    constructor(){
        super();
        this.state = {
            menuItem:{}
        };
        this.menuHandler = this.menuHandler.bind(this);
    }

    menuHandler(dataObject){
        this.refs.tabViewer.renderPDF(dataObject.url, dataObject.name);
    }

    render() {
        return (
            <div className="App grid-container full">
                <Heading sendData={this.menuHandler}/>
                <TabViewer ref="tabViewer" menuItem={this.state.menuItem}/>
            </div>
        );
    }
}

export default App;
