import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./components/Home"
import Game from "./components/Game"

const Routes = () => {

    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route component={Home} exact path="/" />
                    <Route component={Game} exact path="/game" />
                </Switch>
            </BrowserRouter>
        </div>
    )
}


export default Routes;