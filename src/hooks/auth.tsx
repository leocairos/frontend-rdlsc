import React, { createContext, useCallback, useState, useContext } from 'react';
import { api } from '../services/api';

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IAuthContextData {
  user: IUser;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@rdlscfrontend:token');
    const user = localStorage.getItem('@rdlscfrontend:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    /* const response = await api.post('/sessions', {
      email,
      password,
    }); */

    /* const response = await apiGLPI.get('/initSession', {
      headers: {
        Authorization: 'test-value',
      },
    }); */

    // const { token, user } = response.data;

    if (email === 'mail@mail.com' && password === 'Password123') {
      const { token, user } = {
        token: 'mytoken12345',
        user: {
          id: '01',
          name: 'UserName',
          email: 'mail@domain.com',
          avatar_url: '',
          role: 'admin',
        },
      };

      localStorage.setItem('@rdlscfrontend:token', token);
      localStorage.setItem('@rdlscfrontend:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user });
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@rdlscfrontend:token');
    localStorage.removeItem('@rdlscfrontend:user');

    setData({} as IAuthState);
  }, []);

  const updateUser = useCallback(
    (user: IUser) => {
      localStorage.setItem('@rdlscfrontend:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('userAuth must be used within an authProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
