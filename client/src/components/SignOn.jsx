import { useState } from 'react';
import { CONTACTS, slugify } from '../data/contacts';

const STORAGE_KEY = 'p2p-connect-identity';

// Lets the user pick an identity from the known roster, or type a new one.
export default function SignOn({ onSignIn }) {
  const [name, setName] = useState('');

  const signInAs = (fullName) => {
    const id = slugify(fullName);
    if (!id) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, name: fullName }));
    onSignIn({ id, name: fullName });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) signInAs(name.trim());
  };

  return (
    <div className="sign-on">
      <h2>Who are you?</h2>
      <p>Pick your name to sign in:</p>
      <div className="sign-on-list">
        {CONTACTS.map((contact) => (
          <button key={contact.id} type="button" className="sign-on-option" onClick={() => signInAs(contact.name)}>
            {contact.name}
          </button>
        ))}
      </div>

      <p>Not on the list? Enter your name:</p>
      <form onSubmit={handleSubmit} className="sign-on-form">
        <input
          type="text"
          placeholder="First Last"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export function getSavedIdentity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
