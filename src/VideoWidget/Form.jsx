import React, {useEffect, useRef, useState} from 'react';
import {Button, styled, Typography} from '@mui/material';
import {Videocam, VideoChat} from '@mui/icons-material';
import {peerConfig} from '../peer.js';

const Base = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  
  text-align: center;
`;

const ConnectButton = styled(Button)`
  svg {
    margin-right: 8px;
  }
`;

const Hint = styled(Typography)`
  margin-top: 16px;
`;

const VideoChatIcon = styled(VideoChat)`
  font-size: 108px;
  color: ${({ theme }) => theme.palette.primary.main};
  opacity: 0.4;
  
  margin-bottom: 24px;
`;

const Form = ({ setConnection, onConnect }) => {

  useEffect(() => {
    const connection = new RTCPeerConnection(peerConfig);
    setConnection(connection);
  }, []);

  return (
    <Base>
      <VideoChatIcon />
      <ConnectButton onClick={onConnect} variant="contained">
        <Videocam />
        Видеозвонок
      </ConnectButton>
      <Hint variant="body2">У вас будет сквозное подключение к оператору</Hint>
    </Base>
  );
};

export default Form;