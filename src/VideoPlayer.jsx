import React, {useEffect, useState, useRef} from 'react';
import {Fab, styled} from '@mui/material';
import {Pause, PlayArrow, Videocam, VideocamOff, VolumeOff, VolumeUp} from '@mui/icons-material';
import {peerConfig} from './peer.js';

const Base = styled('main')`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Video = styled('video')`
  width: 100%;
  height: 100%;
`;

const PauseButton = styled(Fab)`
  position: absolute;
  left: 32px;
  bottom: 32px;
`;

const VideoSettings = styled('div')`
  position: absolute;
  right: 32px;
  bottom: 32px;

  display: flex;

  > button {
    margin-left: 16px;
  }
`;

const AudioButton = styled(Fab)`

`;

const VideoButton = styled(Fab)`

`;


const VideoPlayer = ({ localStream, connection, setConnection, setLocalStream }) => {
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);
    const [videoMuted, setVideoMuted] = useState(false);

    const handleVideoStop = () => {
      setVideoMuted(!videoMuted);

      localStream.getVideoTracks().forEach(track => {
        track.enabled = videoMuted;
      });
    };

    const handleAudioStop = () => {
      setMuted(!muted);

      localStream.getAudioTracks().forEach(track => {
        track.enabled = muted;
      });
    };

    useEffect(() => {
      videoRef.current.srcObject = localStream;
    }, [localStream]);

    const isPlayed = !!localStream;

    return (
      <Base>
        {isPlayed && <>
          <PauseButton variant="extended" color="error">
            <Pause/>
            Пауза
          </PauseButton>
          <VideoSettings>
            <VideoButton onClick={handleVideoStop} color="primary">
              {videoMuted ? <VideocamOff/> : <Videocam/>}
            </VideoButton>
            <AudioButton onClick={handleAudioStop} color="primary">
              {muted ? <VolumeOff/> : <VolumeUp/>}
            </AudioButton>
          </VideoSettings>
        </>}

        <Video ref={videoRef} autoPlay playsInline muted={muted}/>
      </Base>
    );
  }
;

export default VideoPlayer;