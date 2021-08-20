const { SSL_OP_COOKIE_EXCHANGE } = require('constants');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

var roomIds = {};

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

  socket.on("joinRoom", (roomName, team, res) => {

    if(roomIds[roomName] == null){
      console.log("you suck");
      res("nonexistent");
    }
    else if(!roomIds[roomName].white || !roomIds[roomName].black){

      let teamJoined = team;

      if(!roomIds[roomName][team]) roomIds[roomName][team] = true;
      else{

        if(team === "white"){
          roomIds[roomName].black = true;
          teamJoined = "black";
        }
        else{
          roomIds[roomName].white = true;
          teamJoined = "white";
        }

      }

      socket.join(roomName);
      res("joined " + teamJoined);
    }
    else{
      res("room full");
    }

  });

  socket.on("createRoom", (roomName, res) => {

    if(roomIds[roomName] == null){
      roomIds[roomName] = {white:false, black:false}
      res("success");
    }
    else{
      res("try again");
    }

  });

  socket.on('disconnecting', () => {
    if(roomIds[socket.rooms] != null){
      console.log(roomIds[socket.rooms]);
      //so far, you are just not allowed to reconnect

      if(!roomIds[socket.rooms].white){
        roomIds[socket.rooms] = null;
        return;
      }

      roomIds[socket.rooms].white = false;
    }
  });

  socket.on("sendInfo", (info) => {
    io.to(info.room).emit("changeState", info.state);
  });

});

server.listen(3333, () => {
  console.log('listening on *:3333');
});