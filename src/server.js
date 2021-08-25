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
      res("nonexistent");
      return;
    }
    else if(!roomIds[roomName].white || !roomIds[roomName].black){

      let teamJoined = team;

      if(!roomIds[roomName][team]) roomIds[roomName][team] = socket.id;
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

      //count number of players in room based on roomIds.roomname and how many whites+blqacks there are
      let playersInRoom = Boolean(roomIds[roomName].white) + Boolean(roomIds[roomName].black);
      io.to(roomName).emit("playerJoined", {"players" : playersInRoom});

      if(roomIds[roomName].boardState != null){
        io.to(roomName).emit("changeState", roomIds[roomName].boardState);
      }
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

    let roomId;
    for (roomId of socket.rooms);

    if(roomIds[roomId] != null){
      
      if(roomIds[roomId].white === socket.id) {
        roomIds[roomId].white = false;
      }
      else if(roomIds[roomId].black === socket.id){ 
        roomIds[roomId].black = false;
      }
      if(!roomIds[roomId].white && !roomIds[roomId].black){
        roomIds[roomId] = null;
        return;
      }
    }
  });

  socket.on("sendInfo", (info) => {
    io.to(info.room).emit("changeState", info.state);
    changeBoard(info.state, socket);
  });

});

function changeBoard(state, socketInfo){
  let roomId;
  for(roomId of socketInfo.rooms);

  if(roomIds[roomId] != null){
    if(roomIds[roomId].boardState == null){
      roomIds[roomId].boardState = state;
    }
    else{
      if(roomIds[roomId].boardState.turnNum < state.turnNum){
        roomIds[roomId].boardState = state;
      }
    }
  }

}

server.listen(3333, () => {
  console.log('listening on *:3333');
});