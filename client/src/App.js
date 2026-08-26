import { useState } from 'react';
import './App.css';
import usePeer from './hooks/usePeer';
import SignOn, { getSavedIdentity } from './components/SignOn';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Call from './components/Call';
import { SunIcon } from './components/icons';

function App() {
  const [identity, setIdentity] = useState(getSavedIdentity());
  const {
    status,
    errorMessage,
    isConnected,
    isCallActive,
    callContact,
    messageContact,
    sendMessage,
    onData,
    onRemoteStream,
    hangUp,
  } = usePeer(identity?.id);
  const [activeContactId, setActiveContactId] = useState(null);

  if (!identity) {
    return (
      <div className="App">
        <header className="App-header-bar">
          <div className="App-brand">
            <SunIcon />
            <h1>Harmony</h1>
          </div>
        </header>
        <main className="App-main">
          <SignOn onSignIn={setIdentity} />
        </main>
      </div>
    );
  }

  const handleCall = (contactId) => {
    setActiveContactId(contactId);
    callContact(contactId);
  };

  const handleMessage = (contactId) => {
    setActiveContactId(contactId);
    messageContact(contactId);
  };

  return (
    <div className="App App--with-sidebar">
      <header className="App-header-bar">
        <div className="App-brand">
          <SunIcon />
          <h1>Harmony</h1>
        </div>
        <div className="App-statuses">
          <span className="status status--signed-in">{identity.name}</span>
          <span className={`status status--${status}`}>{status}</span>
        </div>
      </header>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <div className="App-body">
        <Sidebar selfId={identity.id} onCall={handleCall} onMessage={handleMessage} activeContactId={activeContactId} />
        <main className="App-main">
          {isConnected ? (
            <div className="room">
              {isCallActive && <Call onRemoteStream={onRemoteStream} hangUp={hangUp} />}
              <Chat onData={onData} sendMessage={sendMessage} />
            </div>
          ) : (
            <p className="call-placeholder">Hover a contact on the left to call or message them.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
