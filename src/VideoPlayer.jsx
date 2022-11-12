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

const PlayButton = styled(Fab)`
  position: absolute;
  left: 32px;
  bottom: 32px;
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


const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [muted, setMuted] = useState(true);
    const [videoMuted, setVideoMuted] = useState(false);
    const [connection, setConnection] = useState(null);

    const handlePlay = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      mediaStream.getTracks().forEach(track => {
        connection.addTrack(track, mediaStream);
      });

      setLocalStream(mediaStream);

      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
    };

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
      const connection = new RTCPeerConnection(peerConfig);
      setConnection(connection);
    }, []);

    useEffect(() => {
      videoRef.current.srcObject = localStream;
    }, [localStream]);

    const isPlayed = !!localStream;

    return (
      <Base>
        {!isPlayed && <PlayButton variant="extended" color="primary" onClick={handlePlay}>
          <PlayArrow/>
          Начать
        </PlayButton>}
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