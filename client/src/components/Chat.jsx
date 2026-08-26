import { useEffect, useRef, useState } from 'react';

// Simple message list + input wired to the shared DataConnection.
export default function Chat({ onData, sendMessage }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    onData((message) => {
      setMessages((prev) => [...prev, { from: 'them', text: message }]);
    });
  }, [onData]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setMessages((prev) => [...prev, { from: 'me', text: draft }]);
    setDraft('');
  };

  return (
    <div className="chat">
      <div className="chat-messages" ref={listRef}>
        {messages.length === 0 && <p className="chat-empty">No messages yet — say hi 👋</p>}
        {messages.map((m, i) => (
          <div key={i} className={`chat-message chat-message--${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-input">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
