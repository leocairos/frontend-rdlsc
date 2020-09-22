import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import IconMenu from '@material-ui/icons/Menu';

// import HeaderMenu from './HeaderMenu';

import HeaderProfile from './HeaderProfile';

const useStyles = makeStyles(theme => ({
  header: {
    background: '#fff',
    color: '#7b7b7b',
    boxShadow: 'none',
  },
  toolbar: {},
  menuButton: {},
  actions: {
    marginLeft: 'auto',
    alignItems: 'center',
    display: 'flex',
  },
  notificationsButton: {
    marginRight: 23,
  },
  title: {
    flexGrow: 1,
  },
}));

interface IHeaderProps {
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Header = ({ onToggle }: IHeaderProps) => {
  const classes = useStyles();

  return (
    <AppBar position="absolute" className={classes.header}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className={clsx(classes.menuButton)}
        >
          <IconMenu />
        </IconButton>
        {
          // <HeaderMenu />
        }
        <div className={classes.actions}>
          <HeaderProfile />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
