import React, {useState} from 'react';
import Draggable from 'react-draggable';
import {css, IconButton, Paper, styled} from '@mui/material';
import Onboarding from './Onboarding.jsx';
import {ArrowBack, Close, DragIndicator} from '@mui/icons-material';
import Form from './Form.jsx';
import Player from './Player.jsx';

const Base = styled(Paper)`
  z-index: ${({theme}) => theme.zIndex.modal};
  position: absolute;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  overflow: hidden;

  ${({closed}) => closed && css`
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
  const [closed, setClosed] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [connection, setConnection] = useState(null);

  const handleOnboardingEnter = () => {
    setStep(steps.form);
  };

  const handleConnect = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    mediaStream.getTracks().forEach(track => {
      connection.addTrack(track, mediaStream);
    });

    setLocalStream(mediaStream);
    setStep(steps.player);
  }

  const handleBack = () => {
    setStep(steps.onBoarding);
  }

  const handleClose = () => {
    localStream.getTracks().forEach(track => track.stop());
    setClosed(true);
    setStep(steps.onBoarding);
  }

  const handleOpen = () => {
    if(closed) {
      setClosed(false);
    }
  }

  return (
    <Draggable
      defaultPosition={{x: 16, y: window.innerHeight - step.height - 16}}
      cancel={'[class*="MuiDialogContent-root"]'}
      bounds="#root"
      handle={'#dragHandle'}
    >
      <Base elevation={16} width={step.width} height={step.height} closed={closed} onClick={handleOpen}>
        {step.name === steps.form.name && <BackButton size="small" onClick={handleBack}>
          <ArrowBack />
        </BackButton>}

        <Actions>
          {step.name !== steps.onBoarding.name && <DragButton id="dragHandle">
            <DragIndicator/>
          </DragButton>}

          <CloseButton size="small" onClick={handleClose}>
            <Close/>
          </CloseButton>
        </Actions>

        {step.name === steps.onBoarding.name && <Onboarding onEnter={handleOnboardingEnter}/>}
        {step.name === steps.form.name && <Form onConnect={handleConnect} localStream={localStream} connection={connection} setLocalStream={setLocalStream} setConnection={setConnection} />}
        {localStream && <Player localStream={localStream} connection={connection} setLocalStream={setLocalStream} setConnection={setConnection} />}
      </Base>
    </Draggable>
  );
};

export default VideoWidget;