import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Theme } from '../../theme';

interface IPageContainerProps {
  children?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 1,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const PageContainer = ({ children }: IPageContainerProps) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      {children}
    </Container>
  );
};

export default PageContainer;
