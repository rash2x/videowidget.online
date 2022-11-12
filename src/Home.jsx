import React, {useEffect, useRef, useState} from 'react';
import {AppBar, Button, IconButton, Paper, styled, Toolbar, Typography} from '@mui/material';
import {auth, logout} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Logout} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {getMediaStream, peerConfig} from './peer.js';

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

const Video = styled('video')`
  display: ${({ isEnabled }) => isEnabled ? 'block': 'none'};
`;

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const videoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [connection, setConnection] = useState(null);
  const navigate = useNavigate();

  const handleOnline = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    let videoObj = videoRef.current;
    videoObj.srcObject = mediaStream;

    mediaStream.getTracks().forEach(track => {
      connection.addTrack(track, mediaStream);
    });

    setLocalStream(mediaStream);

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
  }, [user, loading]);

  useEffect(() => {
    const connection = new RTCPeerConnection(peerConfig);
    setConnection(connection);
  }, []);

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
          <Video ref={videoRef} isEnabled={!!localStream} autoPlay playsInline style={{
            width: '100%',
            height: '100%'
          }}/>
          {!localStream && <Button onClick={handleOnline}>Стать онлайн</Button>}
        </CallBox>
      </Content>
    </Base>
  );
};

export default Home;