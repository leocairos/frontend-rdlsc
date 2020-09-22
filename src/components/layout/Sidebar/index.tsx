import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import { Theme } from '../../theme';
import Logo from '../../common/Logo';
import SidebarNav from './SidebarNav';

interface ISidebarProps {
  onToggleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDesktop: boolean;
  isMobile: boolean;
  isSidebarCollapsedDesktop: boolean;
  isSidebarOpenMobile: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    color: theme.sidebar.color,
    background: theme.sidebar.background,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  sidebarTitleLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
  },
  logo: {
    color: theme.palette.primary.main,
  },
  title: (props: ISidebarProps) => ({
    position: 'relative',
    overflow: 'visible',
    marginLeft: '5px',
    display:
      props.isDesktop && props.isSidebarCollapsedDesktop ? 'none' : 'block',
  }),
  name: {},
  tagline: {
    fontSize: 8,
    fontWeight: 'bold',
    position: 'absolute',
    top: '100%',
    marginTop: -5,
    background: theme.palette.primary.main,
    color: '#fff',
    borderRadius: 2,
    padding: '1px 3px',
    right: 0,
  },
}));

const Sidebar = (props: ISidebarProps) => {
  const { isDesktop, isSidebarCollapsedDesktop } = props;

  const classes = useStyles(props);

  return (
    <aside className={classes.sidebar}>
      <div className={classes.sidebarHeader}>
        <Link to="/" className={classes.sidebarTitleLink}>
          <Logo size={30} className={classes.logo} />
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.title}
          >
            <span className={classes.name}>RDLSC</span>
            <span className={classes.tagline}>Painel administrativo</span>
          </Typography>
        </Link>
      </div>
      <SidebarNav isCollapsed={isDesktop && isSidebarCollapsedDesktop} />
    </aside>
  );
};

export default Sidebar;
