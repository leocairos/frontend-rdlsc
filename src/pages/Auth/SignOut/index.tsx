import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../../hooks/auth';

const SignOut: React.FC = () => {
  const { signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    signOut();
    history.push('/');
  }, [history, signOut]);
  return <h3>Logout</h3>;
};

export default SignOut;
