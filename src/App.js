import React, { Component } from 'react';
import TabViewer from './components/TabViewer/TabViewer';
import Heading from './components/Heading/Heading.js'
import './App.css';
import { Router, Route, Switch } from 'react-router'
import { Link, BrowserRouter } from 'react-router-dom'
import Navigation from "./components/Navigation/Navigation";

class App extends Component {

    constructor(){
        super();
        this.state = {
            menuItem:{},
            loading:true,
        };
        this.menuHandler = this.menuHandler.bind(this);
        this.tabViewer = this.refs.tabViewer;
    }

    componentDidMount(){
        //simulate async action and remove loader
        setTimeout(()=> this.setState({loading:false}),1500);
    }

    menuHandler(dataObject){
        console.log(this.tabViewer, this.refs.tabViewer);
        this.refs.tabViewer.renderPDF(dataObject['chap'],dataObject['name']);
    }

    homeHandler(){
        console.log(this.tabViewer, this.refs.tabViewer);
        this.refs.tabViewer.switchTab({
            jsx: <Navigation addID={this.handleID}/>,
            active: true,
            id:0,
            name:'Home',
            type:'Home'
        });
    }

    render() {

        return (
            <div className="App grid-y medium-grid-frame full">
                {/*<Heading sendData={this.menuHandler.bind(this)}/>*/}
                {/*<TabViewer ref="tabViewer" menuItem={this.state.menuItem}/>*/}
                <BrowserRouter>
                    <Switch>
                        <Route path="" exact render={()=>{
                            return(
                                <div>
                                    <Heading sendData={this.menuHandler.bind(this)}/>
                                    <TabViewer ref="tabViewer" menuItem={this.state.menuItem}/>
                                </div>
                            )
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
