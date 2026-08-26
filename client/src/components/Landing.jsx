import { useState } from 'react';

// Only supports creating a room; joining happens automatically when the shared link is opened.
export default function Landing({ peerId }) {
  const [copied, setCopied] = useState(false);
  const shareLink = peerId ? `${window.location.origin}${window.location.pathname}?room=${peerId}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing">
      <section>
        <h2>Create a room</h2>
        <p>Share this link with the person you want to talk to:</p>
        <div className="share-row">
          <input type="text" readOnly value={shareLink || 'Generating link…'} />
          <button type="button" onClick={copyLink} disabled={!peerId}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </section>
    </div>
  );
}
