import { CONTACTS } from '../data/contacts';

// Shows other known contacts; clicking one places a direct call.
export default function Sidebar({ selfId, onCall, activeContactId }) {
  const others = CONTACTS.filter((c) => c.id !== selfId);

  return (
    <aside className="sidebar">
      <h2>Contacts</h2>
      <ul className="contact-list">
        {others.map((contact) => (
          <li key={contact.id}>
            <button
              type="button"
              className={`contact-button${contact.id === activeContactId ? ' contact-button--active' : ''}`}
              onClick={() => onCall(contact.id)}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
