import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./components/Home"

const Routes = () => {

    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route component={Home} exact path="/" />
                </Switch>
            </BrowserRouter>
        </div>
    )
}


export default Routes;