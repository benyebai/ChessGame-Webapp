import React from 'react';
import { Knight } from './knight';
import { Square } from './square';
import { knightMoves } from './precomputedData';

export class Board extends React.Component {
    constructor(props){
        super(props);

        let fakeBoard = [];
        for(let i = 0; i < 64; i++){
            fakeBoard.push("em");
        }
        let startingPieces = [
            {piece:"knight", pos:17, alive:true, team:"black", pinned:false}
        ]

        for(let i = 0; i < startingPieces.length; i++){
            fakeBoard[startingPieces[i]["pos"]] = i;
        }

        this.state = {
            existingPiece:startingPieces,
            board:fakeBoard
        }

        this.movePiece = this.movePiece.bind(this);
        this.genValidMovesKnight = this.genValidMovesKnight.bind(this);
    }

    movePiece(from, to){
        let fakeBoard = this.state.board;
        let pieceMove = fakeBoard[from];

        if(this.state.existingPiece[pieceMove].piece === "knight"){
            if(!this.checkValidKnight(from, to)) return;
        }

        fakeBoard[from] = "em";
        fakeBoard[to] = pieceMove;

        this.setState({"board": fakeBoard});
    }

    genValidMovesKnight(pos){
        if(this.state.existingPiece[this.state.board[pos]].pinned) return [];

        let valid = []
        let existingPiece = this.state.existingPiece;
        let board = this.state.board;
        for(let i = 0; i < knightMoves[pos].length; i++){
            //if destination is empty or desitnation is not same team
            if(board[knightMoves[pos][i]] === "em" || existingPiece[board[knightMoves[pos][i]]].team != existingPiece[board[pos]].team){
                valid.push(knightMoves[pos][i]);
            } 
        }
        return valid;
    }

    checkValidKnight(start, stop){
        let board = this.state.board;
        let existingPiece = this.state.existingPiece;
        if(board[stop] === "em" || existingPiece[board[stop]] != existingPiece[board[start]]){
            let distY = Math.abs(parseInt(start / 8) - parseInt(stop / 8));
            let distX = Math.abs((start % 8) - (stop % 8));
            return (distY == 2 && distX == 1) || (distX == 2 && distY == 1) ;
        }
        return false;
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