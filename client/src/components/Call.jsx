import { useEffect, useRef, useState } from 'react';

// Plays the remote audio stream and exposes mute/hangup controls.
export default function Call({ onRemoteStream, hangUp }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    onRemoteStream((stream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
      }
      setRemoteConnected(true);
    });
  }, [onRemoteStream]);

  const toggleMute = () => {
    const stream = audioRef.current?.srcObject;
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = muted;
    });
    setMuted((m) => !m);
  };

  return (
    <div className="call">
      <audio ref={audioRef} autoPlay />
      <p>{remoteConnected ? 'Voice call connected' : 'Waiting for audio…'}</p>
      <div className="call-controls">
        <button type="button" onClick={toggleMute}>
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button type="button" onClick={hangUp}>
          Hang up
        </button>
      </div>
    </div>
  );
}
