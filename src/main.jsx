import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {CssBaseline} from '@mui/material';
import {ProgressProvider} from './ProgressContext.jsx';
import {SnackbarProvider} from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline/>
    <ProgressProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{
        horizontal: 'center',
        vertical: 'top'
      }}>
        <App/>
      </SnackbarProvider>
    </ProgressProvider>
  </React.StrictMode>
);
