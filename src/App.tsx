import React from 'react';

import { ThemeProvider } from '@material-ui/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppProvider from './hooks';

import theme from './components/theme';

// import AppRouter from './AppRouter';
import Route from './routes';

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AppProvider>
      <div className="App">
        <CssBaseline />
        {
          // <AppRouter />
        }
        <Route />
      </div>
    </AppProvider>
  </ThemeProvider>
);

export default App;
