import React, { Component } from 'react';
import TabViewer from './components/TabViewer/TabViewer';
import Heading from './components/Heading/Heading.js'
import './App.css';


class App extends Component {

    constructor(){
        super();
        this.state = {
            menuItem:{},
            loading:true,
        };
        this.menuHandler = this.menuHandler.bind(this);
    }

    componentDidMount(){
        //simulate async action and remove loader
        setTimeout(()=> this.setState({loading:false}),1500);
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
