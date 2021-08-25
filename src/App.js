import React from 'react';
import './App.css';
import Menu from "./menu.js"
import {Board} from "./components/board.js";
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from 'react-dnd';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

class App extends React.Component {

  render() {
    return(
      <DndProvider backend = {HTML5Backend}>
        

        <Router>
          <div>
            <Switch>
              <Route exact path="/game/:id" render={(props) => (<Board {...props} gamemode = "multiplayer"/>)} />
              <Route exact path="/local" render={(props) => (<Board {...props} gamemode = "local"/>)} />
              <Route exact path="/ai" render={(props) => (<Board {...props} gamemode = "ai"/>)} />
              <Route exact path="/" component = {Menu} />
            </Switch>
          </div>
        </Router>

      </DndProvider>
    );
  }
}


export default App;
