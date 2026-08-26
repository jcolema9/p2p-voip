// Fixed roster of known participants — no backend directory, so this list is
// hardcoded and each name maps deterministically to a PeerJS ID.
export function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export const CONTACTS = ['Evan Hastings', 'Jordan Coleman', 'Jaden Coyle'].map((name) => ({
  id: slugify(name),
  name,
}));
