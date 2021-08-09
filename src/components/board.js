import React from 'react';
import { Knight } from './knight';
import { Square } from './square';

export class Board extends React.Component {
    constructor(props){
        super(props);

        let fakeBoard = [];
        for(let i = 0; i < 64; i++){
            fakeBoard.push("em");
        }
        let startingPieces = [
            {piece:"knight", pos:17, alive:true}
        ]

        for(let i = 0; i < startingPieces.length; i++){
            fakeBoard[startingPieces[i]["pos"]] = i;
        }

        this.state = {
            existingPiece:startingPieces,
            board:fakeBoard
        }
    }



    render() {
        let entireBoard = []
        console.log(this.state.board);

        for(let i = 0; i < 8; i ++){
            let currentRow = [];
            for(let j = 0; j < 8; j++){
                let squareProps = {row : i, col : j, board:this};

                if(this.state.board[(i * 8) + j] === "em"){
                    currentRow.push(<Square props = {squareProps} />);
                }
                else{
                    switch(this.state.existingPiece[this.state.board[(i * 8) + j]]["piece"]){
                        case "knight":
                            currentRow.push(<Square props = {squareProps} > <Knight index = {(i * 8) + j} /> </Square>);
                            break;
                    }
                }
            }
            entireBoard.push(<div style = {{display:"flex"}}>{currentRow}</div>);
        }

        return(
            <div style = {{width:"100%", height:"100%"}}>
            {entireBoard}
            </div>
        );
    }
}