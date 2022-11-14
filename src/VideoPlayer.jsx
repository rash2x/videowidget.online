import React, {useEffect, useState, useRef} from 'react';
import {Fab, styled} from '@mui/material';
import {Pause, Videocam, VideocamOff, VolumeOff, VolumeUp} from '@mui/icons-material';

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

const RemoteVideo = styled('video')`
  background: grey;
  position: absolute;
  right: 16px;
  bottom: 108px;
  width: 240px;
  height: 180px;
`;


const VideoPlayer = ({ localStream, remoteStream }) => {
    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);
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
      remoteVideoRef.current.srcObject = remoteStream;
    }, [localStream]);

    const isPlayed = !!localStream;

    console.log(remoteStream);

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
        <RemoteVideo ref={remoteVideoRef} autoPlay playsInline />
      </Base>
    );
  }
;

export default VideoPlayer;