import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from './SignIn.jsx';
import Home from './Home.jsx';
import {LinearProgress} from '@mui/material';
import {auth} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import ResetPassword from './ResetPassword.jsx';
import {SnackbarProvider} from 'notistack';

function App() {
  const [, loading] = useAuthState(auth);

  return (
    <>
      {loading && <LinearProgress style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
        <SnackbarProvider maxSnack={3} anchorOrigin={{
          horizontal: 'center',
          vertical: 'top'
        }}>
      <BrowserRouter>
        <Routes>
              <Route exact path="/" element={<SignIn/>}/>
              <Route exact path="/reset" element={<ResetPassword/>}/>
              <Route exact path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
        </SnackbarProvider>
    </>
  );
}

export default App;
