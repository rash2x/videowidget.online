const peerConfig = {
  iceServers: [{
    urls: 'stun:stun1.l.google.com:19302',
  }],
  iceCandidatePoolSize: 10,
};

export {
  peerConfig
}