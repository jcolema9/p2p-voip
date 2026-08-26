import './App.css';
import usePeer from './hooks/usePeer';
import Landing from './components/Landing';
import Chat from './components/Chat';
import Call from './components/Call';

function App() {
  const { peerId, status, errorMessage, isConnected, connectToRoom, sendMessage, onData, onRemoteStream, hangUp } =
    usePeer();

  return (
    <div className="App">
      <header className="App-header-bar">
        <h1>P2P Connect</h1>
        <span className={`status status--${status}`}>{status}</span>
      </header>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <main className="App-main">
        {isConnected ? (
          <div className="room">
            <Call onRemoteStream={onRemoteStream} hangUp={hangUp} />
            <Chat onData={onData} sendMessage={sendMessage} />
          </div>
        ) : (
          <Landing peerId={peerId} onConnect={connectToRoom} />
        )}
      </main>
    </div>
  );
}

export default App;
