import React from 'react';
import clsx from 'clsx';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import IconArrowDropDown from '@material-ui/icons/ArrowDropDown';
import IconProfile from '@material-ui/icons/AccountBox';
import IconLogout from '@material-ui/icons/ExitToApp';

import { useAuth } from '../../../hooks/auth';

const useStyles = makeStyles(theme => ({
  headerProfile: {
    display: 'inline-flex',
  },
  profileButton: {
    borderRadius: 30,
    fontSize: '1.2rem',
    padding: 8,
  },
  profileAvatar: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  profileName: {
    fontWeight: 500,
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  profileMenu: {
    marginLeft: '-16px',
  },
}));

const HeaderProfile = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, signOut } = useAuth();

  if (!user) {
    return <div className={clsx('headerProfile', classes.headerProfile)} />;
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={clsx('headerProfile', classes.headerProfile)}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Search"
        className={classes.profileButton}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar
          className={classes.profileAvatar}
          alt={user.name}
          src={user.avatar_url}
        />
        <span className={classes.profileName}>{user.name.split(' ', 1)}</span>
        <IconArrowDropDown />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={1}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.profileMenu,
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          <ListItemIcon>
            <IconProfile />
          </ListItemIcon>
          <ListItemText primary="Meu perfil" />
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => signOut()} component={Link} to="/">
          <ListItemIcon>
            <IconLogout />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HeaderProfile;
