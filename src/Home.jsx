import React, {useEffect, useState} from 'react';
import {AppBar, Fab, IconButton, Paper, styled, Toolbar, Typography} from '@mui/material';
import {auth, logout} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Logout, PlayArrow} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import VideoPlayer from './VideoPlayer.jsx';
import VideoWidget from './VideoWidget';
import {peerConfig} from './peer.js';

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
  width: 800px;
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

const ConnectButton = styled(Fab)`
  position: absolute;
  left: 32px;
  bottom: 32px;
`;

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [connection, setConnection] = useState(null);

  const handleConnect = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    mediaStream.getTracks().forEach(track => {
      connection.addTrack(track, mediaStream);
    });

    setLocalStream(mediaStream);
  };

  useEffect(() => {
    const connection = new RTCPeerConnection(peerConfig);
    setConnection(connection);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
  }, [user, loading]);

  return (
    <Base>
      <VideoWidget/>
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
          <ConnectButton variant="extended" color="primary" onClick={handleConnect}>
            <PlayArrow/>
            Начать
          </ConnectButton>

          {localStream && <VideoPlayer localStream={localStream}
                                       connection={connection}
                                       setLocalStream={setLocalStream}
                                       setConnection={setConnection}/>}
        </CallBox>
      </Content>
    </Base>
  );
};

export default Home;