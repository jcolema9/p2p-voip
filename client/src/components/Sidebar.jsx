import { CONTACTS } from '../data/contacts';

// Shows other known contacts; hovering a name reveals call/message icon buttons.
export default function Sidebar({ selfId, onCall, onMessage, activeContactId }) {
  const others = CONTACTS.filter((c) => c.id !== selfId);

  return (
    <aside className="sidebar">
      <h2>Contacts</h2>
      <ul className="contact-list">
        {others.map((contact) => (
          <li
            key={contact.id}
            className={`contact-row${contact.id === activeContactId ? ' contact-row--active' : ''}`}
          >
            <span className="contact-name">{contact.name}</span>
            <span className="contact-actions">
              <button
                type="button"
                className="icon-button"
                title={`Call ${contact.name}`}
                aria-label={`Call ${contact.name}`}
                onClick={() => onCall(contact.id)}
              >
                📞
              </button>
              <button
                type="button"
                className="icon-button"
                title={`Message ${contact.name}`}
                aria-label={`Message ${contact.name}`}
                onClick={() => onMessage(contact.id)}
              >
                💬
              </button>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

