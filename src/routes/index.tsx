import React, { useCallback, useState } from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

import Route from './Route';

import { IdleTimeOutModal } from '../components/layout/IdleTimeOutModal';

import { useAuth } from '../hooks/auth';

import SignIn from '../pages/Auth/Signin';
import SignUp from '../pages/Auth/Signup';
import SignOut from '../pages/Auth/SignOut';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';

import Home from '../pages/Home';
import Chat from '../pages/Chat';
import ServiceDesk from '../pages/ServiceDesk';
import MylimsSamples from '../pages/MylimsSamples';
import Profile from '../pages/Profile';
import Users from '../pages/Users';

const Routes: React.FC = () => {
  const { user, signOut } = useAuth();

  const timeout = Number(process.env.REACT_APP_INACTIVE_TIMEOUT) * 1000;

  const [idleTimer, setIdleTimer] = useState<IdleTimer | null>();
  const [showModal, setShowModal] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const onAction = useCallback(() => {
    setIsTimedOut(false);
  }, []);

  const onActive = useCallback(() => {
    setIsTimedOut(false);
  }, []);

  const onIdle = useCallback(() => {
    if (isTimedOut) {
      signOut();
      window.location.reload();
    } else if (user) {
      setShowModal(true);
      idleTimer?.reset();
      setIsTimedOut(true);
    }
  }, [idleTimer, isTimedOut, signOut, user]);

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    setShowModal(false);
    signOut();
    window.location.reload();
  }, [signOut]);

  return (
    <BrowserRouter>
      <IdleTimer
        ref={ref => {
          setIdleTimer(ref);
        }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={timeout}
      />
      <Switch>
        {/* Public Routes */}
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signout" component={SignOut} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        {/* Private Routes without roles (general) */}
        <Route path="/profile" component={Profile} isPrivate />
        <Route path="/chat" component={Chat} isPrivate />
        <Route path="/serviceDesk" component={ServiceDesk} isPrivate />

        <Route path="/mylimsSamples" component={MylimsSamples} isPrivate />

        <Route path="/" exact component={Home} isPrivate />

        {/* Private Routes protected by roles */}
        <Route path="/users" roles={['admin']} component={Users} isPrivate />

        {/* Default redirect to Home */}
        <Route path="/" component={Home} isPrivate />
      </Switch>
      <IdleTimeOutModal
        showModal={showModal}
        handleClose={handleClose}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
};

export default Routes;
