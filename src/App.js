import React, { Component } from 'react';
import TabViewer from './components/TabViewer/TabViewer';
import Heading from './components/Heading/Heading.js'
import './App.css';
import Routes from './routes'
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router'
import { Link, BrowserRouter } from 'react-router-dom'

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
        this.refs.tabViewer.renderPDF(dataObject.chap, dataObject.name);
    }

    render() {

        return (
            <div className="App grid-container full">
                <BrowserRouter basename="/folklorenexus">
                    <Switch>
                        <Route path="/" exact render={()=>{
                            return(<div>
                                <Heading sendData={this.menuHandler}/>
                                <TabViewer ref="tabViewer" menuItem={this.state.menuItem}/>
                            </div>)
                        }}/>
                        <Route path="/hi" exact render={()=>{
                            return(<div>
                                <Heading sendData={this.menuHandler}/>
                            </div>)
                        }}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
