import React, {useEffect} from 'react';
import {AppBar, IconButton, Paper, styled, Toolbar, Typography} from '@mui/material';
import {auth, logout} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Logout} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import VideoPlayer from './VideoPlayer.jsx';
import VideoWidget from './VideoWidget';

const Base = styled('div')`

`;

const Content = styled('div')`
  display: flex;
  height: calc(100vh - 80px);
  justify-content: center;
  align-items: center;
`;

const CallBox = styled(Paper)`
  background: #ddd;
  width: 900px;
  height: 600px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  
  > button {
    position: absolute;
    margin: auto;
  }
`;

const Account = styled('div')`
  button {
    margin-left: 16px;
  }
`;

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
  }, [user, loading]);

  return (
    <Base>
      <VideoWidget />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            videowidget.online
          </Typography>
          <Account>
            {user && user.displayName}
            <IconButton color="inherit" onClick={logout}><Logout/></IconButton>
          </Account>
        </Toolbar>
      </AppBar>
      <Content>
        <CallBox>
          <VideoPlayer />
        </CallBox>
      </Content>
    </Base>
  );
};

export default Home;