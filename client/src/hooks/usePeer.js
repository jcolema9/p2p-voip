import { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'peerjs';

// With no host/port set, PeerJS connects to its free public signaling broker
// (0.peerjs.com) — no self-hosted server needed, so the client can be a static site.
// No custom ICE config — using PeerJS's default STUN servers.
const PEER_OPTS = process.env.REACT_APP_PEER_HOST
  ? {
      host: process.env.REACT_APP_PEER_HOST,
      port: Number(process.env.REACT_APP_PEER_PORT) || 9000,
      path: process.env.REACT_APP_PEER_PATH || '/peerjs',
    }
  : {};

// Manages a single Peer instance and the active data/media connections for one session.
// selfId is the caller-chosen identity (from sign-on); the Peer isn't created until it's set.
export default function usePeer(selfId) {
  const peerRef = useRef(null);
  const [peerId, setPeerId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | connecting | connected | disconnected | error
  const [errorMessage, setErrorMessage] = useState(null);
  const [dataConnection, setDataConnection] = useState(null);
  const [mediaConnection, setMediaConnection] = useState(null);
  const dataHandlersRef = useRef(null);
  const callHandlersRef = useRef(null);

  useEffect(() => {
    if (!selfId) return;

    const peer = new Peer(selfId, PEER_OPTS);
    peerRef.current = peer;

    peer.on('open', (id) => setPeerId(id));

    peer.on('error', (err) => {
      console.error('Peer error', err);
      setErrorMessage(err.type === 'peer-unavailable' ? 'That person is not online right now.' : err.message || 'Connection error');
      setStatus('error');
    });

    peer.on('connection', (conn) => attachDataConnection(conn));
    peer.on('call', (call) => {
      // Auto-answer incoming calls with our local mic stream.
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          call.answer(stream);
          attachMediaConnection(call);
        })
        .catch((err) => {
          console.error('Failed to get local audio for incoming call', err);
          setErrorMessage('Microphone access is required to accept calls.');
        });
    });

    return () => {
      peer.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfId]);

  const attachDataConnection = useCallback((conn) => {
    conn.on('open', () => {
      setDataConnection(conn);
      setStatus('connected');
    });
    conn.on('data', (data) => dataHandlersRef.current?.(data));
    conn.on('close', () => {
      setDataConnection(null);
      setStatus('disconnected');
    });
    conn.on('error', (err) => {
      console.error('Data connection error', err);
      setErrorMessage(err.message || 'Data connection error');
    });
  }, []);

  const attachMediaConnection = useCallback((call) => {
    call.on('stream', (remoteStream) => callHandlersRef.current?.(remoteStream));
    call.on('close', () => setMediaConnection(null));
    call.on('error', (err) => {
      console.error('Media connection error', err);
      setErrorMessage(err.message || 'Call error');
    });
    setMediaConnection(call);
  }, []);

  const callContact = useCallback(
    (contactId) => {
      setErrorMessage(null);
      setStatus('connecting');
      const peer = peerRef.current;
      const conn = peer.connect(contactId, { reliable: true });
      attachDataConnection(conn);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const call = peer.call(contactId, stream);
          attachMediaConnection(call);
        })
        .catch((err) => {
          console.error('Failed to get local audio for outgoing call', err);
          setErrorMessage('Microphone access is required to start a call.');
        });
    },
    [attachDataConnection, attachMediaConnection]
  );

  const sendMessage = useCallback(
    (message) => {
      dataConnection?.send(message);
    },
    [dataConnection]
  );

  const onData = useCallback((handler) => {
    dataHandlersRef.current = handler;
  }, []);

  const onRemoteStream = useCallback((handler) => {
    callHandlersRef.current = handler;
  }, []);

  const hangUp = useCallback(() => {
    mediaConnection?.close();
    dataConnection?.close();
    setStatus('disconnected');
  }, [mediaConnection, dataConnection]);

  return {
    peerId,
    status,
    errorMessage,
    isConnected: !!dataConnection,
    callContact,
    sendMessage,
    onData,
    onRemoteStream,
    hangUp,
  };
}
