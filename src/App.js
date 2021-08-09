import React from 'react';
import './App.css';
import {Board} from "./components/board.js";
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from 'react-dnd';

class App extends React.Component {

  render() {
    return(
      <DndProvider backend = {HTML5Backend}>
        <Board />
      </DndProvider>
    );
  }
}


export default App;
