const { SSL_OP_COOKIE_EXCHANGE } = require('constants');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

var rooms = [];

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get('/', (req, res) => {
  console.log("i do exist");
});

app.post("/checkRoom", (req, res) => {
  console.log("asdasdasd");
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
  });

  socket.on('disconnect', () => {
    console.log("asd");
  });

  socket.on("sendInfo", (info) => {
    io.to(info.room).emit("changeState", info.state);
  });

});

server.listen(3333, () => {
  console.log('listening on *:3333');
});