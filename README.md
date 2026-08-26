# P2P Connect

Simple peer-to-peer IM + voice call site built with React and PeerJS, using a self-hosted PeerServer for signaling.

## Structure

- `server/` — Node/Express signaling server (PeerJS broker)
- `client/` — React app (Create React App)

## Run locally

1. Start the signaling server:
   ```
   cd server
   npm install
   npm run dev
   ```
2. Start the client:
   ```
   cd client
   npm install
   npm start
   ```
3. Open `http://localhost:3000` in two browser tabs/windows. Create a room in one, copy the link, and open it in the other to connect (text chat + voice call).

## Config

- `server/.env`: `PORT` (default 9000), `CLIENT_ORIGIN` (CORS, default `http://localhost:3000`)
- `client/.env`: `REACT_APP_PEER_HOST`, `REACT_APP_PEER_PORT`, `REACT_APP_PEER_PATH`

## Notes

- Uses public Google STUN servers for NAT traversal; no TURN server configured, so calls may fail on restrictive corporate networks.
- Text and voice only — no video, screen share, auth, or persisted chat history.
