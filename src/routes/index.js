// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router'
import { Link, BrowserRouter } from 'react-router-dom'

import TabViewer from '../components/TabViewer/TabViewer';

export default () => (
    <BrowserRouter basename="/folklorenexus">
        <Switch>
            <Route path="/" exact component={TabViewer}/>
            <Route path="f/test" exact component={TabViewer}/>
        </Switch>
    </BrowserRouter>
)