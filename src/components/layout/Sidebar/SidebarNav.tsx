import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import IconAdmin from '@material-ui/icons/VpnKey';

import IconProfile from '@material-ui/icons/AccountBox';

import IconLogout from '@material-ui/icons/ExitToApp';
import IconHome from '@material-ui/icons/Home';
import IconChat from '@material-ui/icons/Chat';
import IconServiceDesk from '@material-ui/icons/DeveloperBoard';
import IconSamples from '@material-ui/icons/Satellite';

import { Divider } from '@material-ui/core';
import { Theme } from '../../theme';
import SidebarNavItems from './SidebarNavItems';

import { useAuth } from '../../../hooks/auth';

export interface ISidebarNavProps {
  isCollapsed: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navList: {
      width: theme.sidebar.width,
      fontSize: '1.1em',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    navListHeader: {
      textAlign: 'center',
    },
    iconFeatures: {
      color: '#95de3c',
    },
    iconDocs: {
      color: '#f8cda9',
    },
    iconSupporters: {
      color: '#e3b546',
    },
    iconDiscuss: {
      color: '#ccc',
    },
  }),
);

const SidebarNav = (props: ISidebarNavProps): any => {
  const { isCollapsed } = props;
  const classes = useStyles();
  const { user } = useAuth();

  const itemsMenu = [
    ...(user.role === 'admin'
      ? [
          { name: 'Usuários', link: '/users', Icon: IconAdmin },
          { name: 'Home', link: '/home', Icon: IconHome },
          { name: 'Service Desk', link: '/serviceDesk', Icon: IconServiceDesk },
          {
            name: 'Samples (myLIMs)',
            link: '/mylimsSamples',
            Icon: IconSamples,
          },
          { name: 'Chat', link: '/chat', Icon: IconChat },
          { name: 'Meu Perfil', link: '/profile', Icon: IconProfile },
        ]
      : []),
    /* ...(['cacc', 'life', 'admin'].indexOf(user.role) >= 0
      ? [{ name: 'Menu CACC', link: '/profile', Icon: IconProfile }]
      : []), */
    ...(['user', 'cacc', 'life'].indexOf(user.role) >= 0
      ? [
          { name: 'Home', link: '/home', Icon: IconHome },
          { name: 'Service Desk', link: '/serviceDesk', Icon: IconServiceDesk },
          {
            name: 'Samples (myLIMs)',
            link: '/mylimsSamples',
            Icon: IconSamples,
          },
          { name: 'Meu Perfil', link: '/profile', Icon: IconProfile },
        ]
      : []),
  ];

  return (
    <div>
      <List className={classes.navList} disablePadding>
        {!isCollapsed && (
          <ListSubheader disableSticky className={classes.navListHeader}>
            Menu
          </ListSubheader>
        )}
        <SidebarNavItems isCollapsed={isCollapsed} items={itemsMenu} />
      </List>
      <Divider />
      <List className={classes.navList} disablePadding>
        <SidebarNavItems
          isCollapsed={isCollapsed}
          items={[{ name: 'Sair', link: '/signout', Icon: IconLogout }]}
        />
      </List>
    </div>
  );
};

export default SidebarNav;
