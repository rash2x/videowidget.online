import React, {useContext} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from './SignIn.jsx';
import Home from './Home.jsx';
import {LinearProgress} from '@mui/material';
import ResetPassword from './ResetPassword.jsx';
import {ProgressContext} from './ProgressContext.jsx';

function App() {
  const {progress} = useContext(ProgressContext);

  return (
    <>
      {progress && <LinearProgress style={{position: 'absolute', top: 0, left: 0, right: 0}}/>}

      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignIn/>}/>
          <Route exact path="/reset" element={<ResetPassword/>}/>
          <Route exact path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
