import React from 'react';
import {
  Route as ReactDOMRoute,
  Redirect,
  RouteProps as ReactDOMRouteProps,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import DashboardLayout from '../components/layout';

interface IRouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
  roles?: string[];
}

const Route: React.FC<IRouteProps> = ({
  isPrivate = false,
  component: Component,
  roles = [],
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        const hasRole = roles.length > 0;
        const userLogged = !!user;

        const isPublic = !isPrivate;
        const isPrivateGeneral = isPrivate && !hasRole;
        const allowByRole = user && hasRole && roles.indexOf(user.role) > -1;

        if (isPublic || allowByRole || (isPrivateGeneral && userLogged)) {
          if (isPrivate) {
            return (
              <DashboardLayout>
                <Component />
              </DashboardLayout>
            );
          }
          return <Component />;
        }

        if (!isPublic && !userLogged) {
          return (
            <Redirect to={{ pathname: '/signin', state: { from: location } }} />
          );
        }

        if (!allowByRole) {
          return <Redirect to={{ pathname: '/' }} />;
        }

        return (
          <Redirect to={{ pathname: '/signin', state: { from: location } }} />
        );
      }}
    />
  );
};

export default Route;
