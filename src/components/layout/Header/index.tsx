import React from 'react';
import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import IconMenu from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import logoImg from '../../../assets/logo.svg';

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
  logo: {
    margin: theme.spacing(1),
    width: 40,
  },
}));

interface IHeaderProps {
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Header = ({ onToggle }: IHeaderProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar position="absolute" className={classes.header}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className={clsx(classes.menuButton)}
          title="menu"
        >
          <IconMenu />
        </IconButton>
        <img
          className={classes.logo}
          src={logoImg}
          alt="rdlsc"
          style={{ display: isDesktop ? 'none' : 'block' }}
        />
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
