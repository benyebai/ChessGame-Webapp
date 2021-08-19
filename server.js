const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get('/', (req, res) => {
  console.log("i do exist");
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("lmao", (fuck) => {
    console.log("im so fuckiong cool");
    io.emit("board", fuck);
  });

});

server.listen(3333, () => {
  console.log('listening on *:3333');
});