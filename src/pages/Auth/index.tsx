import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import Signin from './Signin';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';

export type AuthProps = RouteComponentProps;

const Auth = ({ match }: AuthProps): any => {
  return (
    <Switch>
      <Route path={`${match.url}/signin`} component={Signin} />
      <Route path={`${match.url}/signup`} component={Signup} />
      <Route path={`${match.url}/reset-password`} component={ResetPassword} />
      <Route path={`${match.url}/forgot-password`} component={ForgotPassword} />
    </Switch>
  );
};

export default Auth;
