import React, { Children } from 'react';
import reactDom from 'react-dom';
import {Knight} from './Knight';
import {Square} from "./square.js";
import { boardEncrypted, existingPieces} from './globalVars';

export class Board extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      existingPieces : [["knight", 17]]
    }
  }

  render(){
    let entireBoard = [];
    let boardCoded = [];
    let existingPieces = this.state.existingPieces;
    //ah shit cant make good looking code
    for(let i = 0; i < 8; i++){

      let line = [];
      for(let j = 0; j < 8; j++){

        let toAdd = <Square row = {i} col = {j} /> ;
        let toAddCoded = "e";
        for(let k = 0; k < existingPieces.length; k++){

          if(existingPieces[k][1] == (i * 8) + j){

            switch (existingPieces[k][0]) {
              case "knight":
                
                toAdd = (<Square row = {i} col = {j}> <Knight board = {this} /> </Square>);
                toAddCoded = "n";
                break;
            }

          }
        }

        line.push(toAdd);
        boardCoded.push(toAddCoded);
      }
      
      entireBoard.push(<div style = {{display:"flex"}}>{line}</div>);
    }

    return (
      <div>
        {entireBoard}
      </div>
    );
  }

}