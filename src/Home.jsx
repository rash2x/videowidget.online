import React, {useEffect, useState} from 'react';
import {AppBar, Fab, IconButton, Paper, styled, Toolbar, Typography} from '@mui/material';
import {auth, firestore, logout} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Logout, PlayArrow} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import VideoPlayer from './VideoPlayer.jsx';
import VideoWidget from './VideoWidget';
import {peerConfig} from './peer.js';
import {addDoc, getDoc, updateDoc, onSnapshot, collection, doc} from 'firebase/firestore';

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
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(null);

  const handleConnect = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    mediaStream.getTracks().forEach(track => {
      pc.addTrack(track, mediaStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks(track => {
        remoteStream.addTrack(track);
      });
    };

    setLocalStream(mediaStream);

    //Call
    //callId
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const callId = urlParams.get('callId');

    const callDoc = doc(collection(firestore, 'calls'), callId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    pc.onicecandidate = (event) => {
      event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
    };

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, {answer});

    onSnapshot(offerCandidates, (snapshot) => {
      console.log(snapshot);
      snapshot.docChanges().forEach((change) => {

        if (change.type === 'added') {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
  }, [user, loading]);

  useEffect(() => {
    setPc(new RTCPeerConnection(peerConfig));
    setRemoteStream(new MediaStream());
  }, []);

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
                                       remoteStream={remoteStream}/>}
        </CallBox>
      </Content>
    </Base>
  );
};

export default Home;