const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const users = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('send-message', (data) => {
      const msg = {
        id: uuidv4(),
        user: data.sender,
        text: data.message,
        timeStamp: new Date().toISOString(),
      };

      io.emit('chat-message', msg);
    });

    socket.on('user joined', (username) => {
      users.set(socket.id, username);
      io.emit('update users', Array.from(users.values()));
      socket.broadcast.emit('user joined', username);
    });

    socket.on('disconnect', () => {
      const username = users.get(socket.id);
      users.delete(socket.id);
      io.emit('update users', Array.from(users.values()));
      if (username) {
        socket.broadcast.emit('user left', username);
      }
      console.log('❌ Client disconnected');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('✅ Ready on http://localhost:3000');
  });
});
