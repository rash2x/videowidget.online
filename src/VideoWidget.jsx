import React from 'react';
import Draggable from 'react-draggable';
import {IconButton, Paper, styled, Typography} from '@mui/material';
import {Close, FiberManualRecord, Image} from '@mui/icons-material';
import pictureImage from './picture.jpg';

const Base = styled(Paper)`
  z-index: ${({ theme }) => theme.zIndex.modal};
  position: absolute;
  width: 160px;
  height: 220px;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    max-height: 100%;
    margin-left: -25%;
    pointer-events: none;
  }
`;

const CloseButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  
  position: absolute;
  top: 0;
  right: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const Operator = styled(Typography)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  
  svg {
    margin-right: 4px;
  }
`;


const VideoWidget = () => {
  return (
    <Draggable
      defaultPosition={{x: 16, y: window.innerHeight - 220 - 16}}
      cancel={'[class*="MuiDialogContent-root"]'}
      bounds="#root"
    >
      <Base elevation={16}>
        <img src={pictureImage} alt="" />
        <Operator variant="body2">
          <FiberManualRecord color="success" fontSize="small" />
          Rashid
        </Operator>
        <CloseButton size="small">
          <Close />
        </CloseButton>
      </Base>
    </Draggable>
  );
};

export default VideoWidget;