import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import { Theme } from '../../theme';
import packageJSON from '../../../../package.json';

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    display: 'flex',
    background: '#fff',
    padding: '0.5rem 1rem',
    justifyContent: 'space-between',
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="body2" color="textSecondary" align="left">
        <Link color="primary" href="https://twitter.com/">
          Twitter
        </Link>
        {' | '}
        <Link color="primary" href="https://www.linkedin.com/">
          LinkedIn
        </Link>
        {' | '}
        <Link color="primary" href="https://www.instagran.com/">
          Instagran
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="right">
        &copy; {new Date().getFullYear()} Copyright v{packageJSON.version}{' '}
        <a href="https://www.rdlsc.com">RDLSC</a>
      </Typography>
    </footer>
  );
};

export default Footer;
