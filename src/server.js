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
    console.log("asd");

    if(roomIds[roomName] == null){
      res("nonexistent");
      return;
    }
    else if(!roomIds[roomName].white || !roomIds[roomName].black){

      let teamJoined = team;

      if(!roomIds[roomName][team]) roomIds[roomName][team] = true;
      else{

        if(team === "white"){
          roomIds[roomName].black = socket.id;
          teamJoined = "black";
        }
        else{
          roomIds[roomName].white = socket.id;
          teamJoined = "white";
        }
      }

      socket.join(roomName);

      res("joined " + teamJoined);
    }
    else{
      res("room full");
    }

    //count number of players in room based on roomIds.roomname and how many whites+blqacks there are


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
      

      if(roomIds[socket.rooms].white === socket.id) roomIds[socket.rooms].white = false;
      else if(roomIds[socket.rooms].black === socket.id) roomIds[socket.rooms].black = false;

      console.log(roomIds[socket.rooms])

      if(!roomIds[socket.rooms].white && !roomIds[socket.rooms].black){
        roomIds[socket.rooms] = null;
        return;
      }
      
    }
  });

  socket.on("sendInfo", (info) => {
    io.to(info.room).emit("changeState", info.state);
  });

});

server.listen(3333, () => {
  console.log('listening on *:3333');
});