import React from 'react'
import {
    Router,
    Switch,
    Route
} from "react-router-dom";
import LoginPage from "./LoginPage.js";
import Presentations from "./Presentations.js";
import history from './history';

export const Routing = () => {
    return (
        <Router history= {history}>
            <Switch>
                <Route exact path="/">
                    <LoginPage/>
                </Route>
                <Route path="/monday">
                    <Presentations/>
                </Route>
                <Route path="/tuesday">
                    <Presentations/>
                </Route>
                <Route path="/wednesday">
                    <Presentations/>
                </Route>
                <Route path="/thursday">
                    <Presentations/>
                </Route>
                <Route path="/friday">
                    <Presentations/>
                </Route>
            </Switch>
        </Router>
    )
};