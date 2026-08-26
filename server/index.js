require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { ExpressPeerServer } = require('peer');

const PORT = process.env.PORT || 9000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const CLIENT_BUILD_DIR = path.join(__dirname, '..', 'client', 'build');

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: false,
});

peerServer.on('connection', (client) => {
  console.log(`Peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Peer disconnected: ${client.getId()}`);
});

app.use('/peerjs', peerServer);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Serve the built React app from the same origin so only one tunnel/port is needed.
app.use(express.static(CLIENT_BUILD_DIR));
app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`PeerJS signaling server listening on port ${PORT}`);
});

