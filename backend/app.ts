import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import cors from 'cors';

const app = express();
const port = 4122;

app.use(express.json());
app.use(cors());

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface Client {
  ws: WebSocket;
  isAdmin: boolean;
}

const clients: Client[] = [];
let currentPage = 1;

wss.on('connection', (ws) => {
  const client: Client = { ws, isAdmin: false };
  clients.push(client);

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'setAdmin') {
      client.isAdmin = true;
    } else if (data.type === 'setPage' && client.isAdmin) {
      currentPage = data.page;
      clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: 'pageUpdate', page: currentPage }));
      });
    } else if (data.type === 'getPage') {
      ws.send(JSON.stringify({ type: 'pageUpdate', page: currentPage }));
    }
  });

  ws.on('close', () => {
    clients.splice(clients.indexOf(client), 1);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
