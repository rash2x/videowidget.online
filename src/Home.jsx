import React, {useEffect} from 'react';
import {AppBar, Button, IconButton, Paper, styled, Toolbar, Typography} from '@mui/material';
import {auth, logout} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Logout} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';

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

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Account = styled('div')`
  button {
    margin-left: 16px;
  }
`;

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
  }, [user, loading]);

  return (
    <Base>
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
          <Button>Стать онлайн</Button>
        </CallBox>
      </Content>
    </Base>
  );
};

export default Home;