import React from 'react';
import { allowedDir, knightMoves } from './precomputedData';
import { boardEncrypted } from './globalVars';

export class Knight extends React.Component {
  constructor(props){
    super(props);
    this.pieceType = "knight"; 
    this.isPinned = false;
  }

  genValid(currentPos){
    if(this.isPinned) return [];

    let possibleSpots = []
    for(let i = 0; i < knightMoves[currentPos].length; i++){
      if(boardEncrypted[knightMoves[currentPos][i]] == "e"){
        possibleSpots.push(knightMoves[currentPos][i]);
      }
    }

    return possibleSpots;
  }

  render() {
    return(
      <div onClick = {() => {this.props.board.setState({existingPieces:[["knight",13]]})}}>
          <img src = {"/images/knight.png"} style = {{width:"100%", height:"100%"}} />
      </div>
    );
  }
}

