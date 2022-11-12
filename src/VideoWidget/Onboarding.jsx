import React, {useState} from 'react';
import {styled, Typography} from '@mui/material';
import {FiberManualRecord} from '@mui/icons-material';
import pictureImage from '../picture.jpg';

const Base = styled('div')`
  width: 100%;
  height: 100%;
`;

const Operator = styled(Typography)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;

  svg {
    margin-right: 4px;
  }
`;

const Thumbnail = styled('div')`
  img {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    max-height: 100%;
    margin-left: -25%;
    user-select: none;
    -webkit-user-drag: none;
  }
`;

const Onboarding = ({onEnter}) => {
  return (
    <Base>
      <Thumbnail onClick={onEnter}>
        <img src={pictureImage} alt=""/>
      </Thumbnail>

      <Operator variant="body2">
        <FiberManualRecord color="success" fontSize="small"/>
        Rashid
      </Operator>
    </Base>
  );
};

export default Onboarding;