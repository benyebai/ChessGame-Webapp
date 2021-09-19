import React from 'react';
import './App.css';
import Menu from "./menu.js"
import {Board} from "./components/board.js";
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from 'react-dnd';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

//im an autist, only way i found to alter the time values for chess from menu.js
//is using exported funcs to change the varaibles
export function setTimes(amount, restore, team){
  amountTime = amount;
  amountRestored = restore;
  myTeam = team;
  if(team == null) myTeam = "white";
}

export var amountTime = 600;
export var amountRestored = 0;
export var myTeam = "white";

class App extends React.Component {

  render() {
    return(
      <DndProvider backend = {HTML5Backend}>
        
        <Router>
          <div>
            <Switch>
              
              <Route exact path="/game/:id" render={(props) => (
              <Board 
                {...props}
                gamemode = "multiplayer"
                startingTime = {amountTime}
                timeRestored = {amountRestored}
                myTeam = {myTeam}
              />)}/>

              <Route exact path="/local" render={(props) => (
              <Board
                {...props}
                gamemode = "local"
                startingTime = {amountTime} 
                timeRestored = {amountRestored}
                myTeam = {myTeam}
                />)}/>

              <Route exact path="/ai" render={(props) => (
              <Board
                {...props}
                gamemode = "ai"
                startingTime = {amountTime} 
                timeRestored = {amountRestored}
                myTeam = {myTeam}
              />)} />

              <Route exact path="/" component = {Menu} />
            </Switch>
          </div>
        </Router>

      </DndProvider>
    );
  }
}


export default App;
