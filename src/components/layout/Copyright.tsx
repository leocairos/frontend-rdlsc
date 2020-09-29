import React from 'react';
import { Link, Typography } from '@material-ui/core';

const Copyright: React.FC = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://www.rdlsc.com/">
      www.rdlsc.com
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
);

export default Copyright;
