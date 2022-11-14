import React, {useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import {css, IconButton, Paper, styled} from '@mui/material';
import Onboarding from './Onboarding.jsx';
import {ArrowBack, Close, DragIndicator} from '@mui/icons-material';
import Form from './Form.jsx';
import VideoPlayer from '../VideoPlayer.jsx';
import {peerConfig} from '../peer.js';
import {firestore} from '../firebase.js';
import {collection, doc, setDoc, addDoc, onSnapshot} from 'firebase/firestore';

const Base = styled(Paper)`
  z-index: ${({theme}) => theme.zIndex.modal};
  position: absolute;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  overflow: hidden;

  ${({widgetView}) => widgetView === 'collapsed' && css`
    position: fixed;
    bottom: 240px;
    left: 0;

    width: 48px;
    height: 140px;

    transform: none !important;

    > * {
      display: none;
    }
  `};
`;

const Actions = styled('div')`
  background: rgba(255, 255, 255, 0.7);
  border-bottom-left-radius: 16px;
  backdrop-filter: blur(20px);
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;

  display: flex;

  z-index: 2;
  position: absolute;
  padding: 4px;
  top: 0;
  right: 0;
`;

const CloseButton = styled(IconButton)`

`;

const BackButton = styled(IconButton)`
  position: absolute;
  top: 4px;
  left: 4px;
`;

const DragButton = styled('div')`
  display: flex;
  width: 60px;
  align-items: center;
  justify-content: center;

  cursor: move;

  svg {
    transform: rotate(90deg);
    position: relative;
    top: -1px;
  }
`;

const Header = styled('div')`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 33333;
`;

const steps = {
  onBoarding: {
    name: 'onboarding',
    width: 160,
    height: 220
  },
  form: {
    name: 'form',
    width: 320,
    height: 320
  },
  player: {
    name: 'player',
    width: 800,
    height: 600
  }
};


const VideoWidget = () => {
  const [step, setStep] = useState(steps.onBoarding);
  const [callDocId, setCallDocId] = useState(null);
  const [widgetView, setWidgetView] = useState('expanded'); // collapsed | expanded
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(null);

  const handleOnboardingEnter = () => {
    setStep(steps.form);
  };

  const handleConnect = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    mediaStream.getTracks().forEach(track => {
      pc.addTrack(track, mediaStream);
    });

    pc.ontrack = (event) => {
      console.log(event);
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    setLocalStream(mediaStream);
    setStep(steps.player);

    // Call

    const callDoc = doc(collection(firestore, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    setCallDocId(callDoc.id);

    pc.onicecandidate = (event) => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type
    };

    await setDoc(callDoc, {offer});

    // Listen for remote answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  };

  const handleBack = () => {
    setStep(steps.onBoarding);
  };

  const handleClose = () => {
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    setWidgetView('collapsed');
    setStep(steps.onBoarding);
  };

  const handleOpen = () => {
    if (closed) {
      setWidgetView('expanded');
    }
  };

  useEffect(() => {
    setPc(new RTCPeerConnection(peerConfig));
    setRemoteStream(new MediaStream());
  }, []);

  return (
    <Draggable
      defaultPosition={{x: 16, y: window.innerHeight - step.height - 16}}
      cancel={'[class*="MuiDialogContent-root"]'}
      bounds="#root"
      handle={'#dragHandle'}
    >
      <Base elevation={16} width={step.width} height={step.height} widgetView={widgetView} onClick={handleOpen}>
        {step.name === steps.form.name && <BackButton size="small" onClick={handleBack}>
          <ArrowBack/>
        </BackButton>}

        <Header>
          {callDocId}
        </Header>

        <Actions>
          {step.name !== steps.onBoarding.name && <DragButton id="dragHandle">
            <DragIndicator/>
          </DragButton>}

          <CloseButton size="small" onClick={handleClose}>
            <Close/>
          </CloseButton>
        </Actions>

        {step.name === steps.onBoarding.name && <Onboarding onEnter={handleOnboardingEnter}/>}
        {step.name === steps.form.name &&
          <Form onConnect={handleConnect} localStream={localStream} connection={pc} setLocalStream={setLocalStream}
                setConnection={setPc}/>}
        {localStream && <VideoPlayer localStream={localStream} remoteStream={remoteStream} />}
      </Base>
    </Draggable>
  );
};

export default VideoWidget;