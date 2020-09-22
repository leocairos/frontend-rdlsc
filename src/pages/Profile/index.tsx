import React from 'react';

import Button from '@material-ui/core/Button';

import PageContainer from '../../components/common/PageContainer';
import PageToolbar from '../../components/common/PageToolbar';

const Profile: React.FC = () => {
  const PageTitle = 'Profile';

  const PageActions = (
    <Button variant="contained" href="#contained-buttons">
      Link
    </Button>
  );

  return (
    <PageContainer>
      <PageToolbar title={PageTitle} actions={PageActions} />
      brb hreibhrep
      <p>hg rehgre</p>
    </PageContainer>
  );
};

export default Profile;
