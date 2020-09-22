import React from 'react';
import { AppBar, makeStyles, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

import logoImg from '../../assets/logo_white.svg';

const drawerWidth = 0;

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    backgroundColor: '#3483CB',
    color: '#FFFAFA',
    padding: '0.5rem 8rem',
    justifyContent: 'space-between',
  },
  svg: {
    marginRight: '5px',
    marginLeft: '15px',
    color: '#FFFAFA',
  },
  logo: {
    margin: theme.spacing(1),
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      height: '55px',
      marginLeft: drawerWidth,
      backgroundColor: '#183f73',
    },
  },
}));

export const PublicHeader: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <img className={classes.logo} width={50} src={logoImg} alt="rdlsc" />
    </AppBar>
  );
};

export const PublicFooter: React.FC = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Typography align="left">
        <PhoneIcon />
        75 3023 8733
        <MailOutlineIcon className={classes.svg} />
        contato@rdlsc.com
      </Typography>

      <Typography align="center">
        <Link href="https://www.facebook.com/rdlsc/" target="_blank">
          <FacebookIcon className={classes.svg} />
        </Link>
        <Link href="https://www.instagram.com/rdlsc/" target="_blank">
          <InstagramIcon className={classes.svg} />
        </Link>
      </Typography>
      <Typography align="right">
        <span>&copy; {new Date().getFullYear()} RDLSC</span>
      </Typography>
    </footer>
  );
};
