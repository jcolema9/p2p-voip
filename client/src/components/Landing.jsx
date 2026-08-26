import { useState } from 'react';

function extractRoomId(input) {
  try {
    const url = new URL(input);
    return url.searchParams.get('room') || input;
  } catch {
    return input;
  }
}

// Lets the user either create a new room (share the link) or join an existing one.
export default function Landing({ peerId, onJoin }) {
  const [joinCode, setJoinCode] = useState('');
  const shareLink = peerId ? `${window.location.origin}${window.location.pathname}?room=${peerId}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const input = joinCode.trim();
    if (!input) return;
    // Accept either a bare room ID or a full pasted share link.
    const roomId = extractRoomId(input);
    onJoin(roomId);
  };

  return (
    <div className="landing">
      <section>
        <h2>Create a room</h2>
        <p>Share this link with the person you want to talk to:</p>
        <div className="share-row">
          <input type="text" readOnly value={shareLink || 'Generating link…'} />
          <button type="button" onClick={copyLink} disabled={!peerId}>
            Copy
          </button>
        </div>
      </section>

      <section>
        <h2>Join a room</h2>
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Paste room code or share link"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button type="submit">Join</button>
        </form>
      </section>
    </div>
  );
}
