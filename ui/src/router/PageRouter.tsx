import React, { ReactNode } from "react";
import { Router, Switch, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import Base from "../pages/office/Base";
import { history } from "../helpers/history";
import PrivateRoute from "../components/PrivateRoute";
import UserSelfRegister from "../pages/office/memberchip/UserSelfRegister";
import PasswordForgotten from "../pages/office/memberchip/PasswordForgotten";

interface PageRouterProps {
    children?: ReactNode;
}

export default function PageRouter(props: PageRouterProps) {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/user/create" component={UserSelfRegister}></Route>
                <Route
                    path="/authentication/passwordForgotten"
                    component={PasswordForgotten}
                ></Route>
                <PrivateRoute path="" component={Base}></PrivateRoute>
            </Switch>
        </Router>
    );
}
