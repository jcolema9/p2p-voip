import { useState } from 'react';

// Shows your own ID to share, and lets you connect directly to someone else's ID.
export default function Landing({ peerId, onConnect }) {
  const [copied, setCopied] = useState(false);
  const [targetId, setTargetId] = useState('');

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e) => {
    e.preventDefault();
    const id = targetId.trim();
    if (id) onConnect(id);
  };

  return (
    <div className="landing">
      <section>
        <h2>Your ID</h2>
        <p>Share this with the person you want to talk to:</p>
        <div className="share-row">
          <input type="text" readOnly value={peerId || 'Generating ID…'} />
          <button type="button" onClick={copyId} disabled={!peerId}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </section>

      <section>
        <h2>Connect to an ID</h2>
        <form onSubmit={handleConnect}>
          <input
            type="text"
            placeholder="Paste their ID"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <button type="submit">Connect</button>
        </form>
      </section>
    </div>
  );
}
