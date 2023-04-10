import React from 'react';
import './App.css';
import Menu from "./menu.js"
import {Board} from "./components/board.js";
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from 'react-dnd';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

//only way i found to alter the time values for chess from menu.js
//is using exported funcs to change the varaibles

var amountTime = window.sessionStorage.getItem("amountTime");
if(amountTime == null) amountTime = 600;

var amountIncrement =  window.sessionStorage.getItem("amountIncrement");
if(amountIncrement == null) amountIncrement = 0;

var whichTeam = window.sessionStorage.getItem("whichTeam");
if(whichTeam == null) whichTeam = "white";

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
                timeRestored = {amountIncrement}
                myTeam = {whichTeam}
              />)}/>

              <Route exact path="/local" render={(props) => (
              <Board
                {...props}
                gamemode = "local"
                startingTime = {amountTime} 
                timeRestored = {amountIncrement}
                myTeam = {whichTeam}
                />)}/>

              <Route exact path="/ai" render={(props) => (
              <Board
                {...props}
                gamemode = "ai"
                startingTime = {amountTime} 
                timeRestored = {amountIncrement}
                myTeam = {whichTeam}
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
