import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Reports from './pages/reports';
import Audits from './pages/audits';
import Accounts from './pages/accounts';
import AccountConfiguration from './pages/account-configuration';
import Configurations from './pages/configurations';
import Password from './pages/password';
import Cameras from './pages/cameras';
import AllCams from './pages/cameras/allCams';

import { IsAuthenticated, IsAdmin, IsUser, HavePermission, IsRoot } from "./services/auth";


const PrivateRouteUser = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (IsUser())
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteAdmin = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (IsAdmin())
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteDashboard = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (HavePermission(24))
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteReports = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (HavePermission(4))
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteAudits = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (HavePermission(1))
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteAccounts = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (HavePermission(8))
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteEditAccounts = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (HavePermission(9))
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

const PrivateRouteConfigurations = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (IsAuthenticated()) {

                if (HavePermission(32) || IsRoot())
                    return <Component {...props} />;
                else
                    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />

            } else {
                return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        }
        }
    />
);

export const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/cameras-for-mobile/:camnumber/:sessionid/:http/:baseauth" component={Cameras} />
            <PrivateRouteDashboard path="/dashboard" component={Dashboard} />
            <PrivateRouteReports path="/reports" component={Reports} />
            <PrivateRouteUser exact path="/all-cams" component={AllCams} />
            <PrivateRouteAudits path="/audits" component={Audits} />
            <PrivateRouteAccounts path="/accounts" component={Accounts} />
            <PrivateRouteEditAccounts path="/account/:id" component={AccountConfiguration} />
            <PrivateRouteConfigurations path="/configurations" component={Configurations} />
            <PrivateRouteUser path="/password" component={Password} />
            <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;