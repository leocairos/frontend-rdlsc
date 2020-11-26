import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconWebSite from '@material-ui/icons/Web';
import IconSupport from '@material-ui/icons/ContactSupport';

const useStyles = makeStyles(theme => ({
  demo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoIcon: {},
  demoName: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  button: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      margin: 3,
    },
  },
}));

const HeaderMenu: React.FC<any> = props => {
  const classes = useStyles(props);

  return (
    <div className={classes.demo}>
      <Tooltip title="Website RDLSC">
        <Button
          size="small"
          variant="outlined"
          color="primary"
          className={classes.button}
          href="https://www.rdlsc.com"
        >
          <IconWebSite className={classes.demoIcon} />
          <span className={classes.demoName}>Web Site</span>
        </Button>
      </Tooltip>
      <Tooltip title="Ajuda/Suporte">
        <Button
          component={Link}
          size="small"
          variant="outlined"
          color="primary"
          className={classes.button}
          to="/support"
        >
          <IconSupport className={classes.demoIcon} />
          <span className={classes.demoName}>Suporte</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default HeaderMenu;
