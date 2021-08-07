import React from 'react';
import './App.css';
import {Knight} from './components/Knight';
import {Square} from "./components/square.js";
import {Board} from "./components/board.js";

class App extends React.Component {

  render() {
    return(
      <div style = {{width:"100%", height:"100%"}}>
        <Board />
      </div>
    );
  }
}


export default App;
