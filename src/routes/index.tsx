import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/Auth/Signin';
import SignUp from '../pages/Auth/Signup';
import SignOut from '../pages/Auth/SignOut';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';

import Home from '../pages/Home';
import ServiceDesk from '../pages/ServiceDesk';
import MylimsSamples from '../pages/MylimsSamples';
import Profile from '../pages/Profile';
import Users from '../pages/Users';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* Public Routes */}
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signout" component={SignOut} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        {/* Private Routes without roles (general) */}
        <Route path="/profile" component={Profile} isPrivate />
        <Route path="/serviceDesk" component={ServiceDesk} isPrivate />
        <Route path="/mylimsSamples" component={MylimsSamples} isPrivate />
        <Route path="/" exact component={Home} isPrivate />
        {/* Private Routes protected by roles */}

        <Route path="/users" roles={['admin']} component={Users} isPrivate />
        {/* Default redirect to Home */}
        <Route path="/" component={Home} isPrivate />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
