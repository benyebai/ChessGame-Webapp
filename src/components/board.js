import React from 'react';
import { ChessPiece } from './chessPiece';
import { Square } from './square';
import { knightMoves, rookMoves, bishopMoves } from './precomputedData';
import { CustomDragLayer } from './customDrag';

export class Board extends React.Component {
    constructor(props){
        super(props);

        let fakeBoard = [];
        for(let i = 0; i < 64; i++){
            fakeBoard.push("em");
        }
        let startingPieces = [

            {piece:"knight", pos:0, team:"black", pinned:false},
            {piece:"knight", pos:1, team:"black", pinned:false},
            {piece:"rook", pos:2, team:"white", pinned:false},
            {piece:"knight", pos:3, team:"black", pinned:false},
            {piece:"knight", pos:4, team:"black", pinned:false},
            {piece:"bishop", pos:6, team:"black", pinned:false}

            
        ]

        for(let i = 0; i < startingPieces.length; i++){
            fakeBoard[startingPieces[i]["key"]] = startingPieces[i];
        }

        this.state = {
            board:fakeBoard
        }

        this.movePiece = this.movePiece.bind(this);
        this.genValidMovesKnight = this.genValidMovesKnight.bind(this);
    }

    movePiece(from, to){
        let fakeBoard = this.state.board;
        let pieceMove = fakeBoard[from];

        if(pieceMove.piece === "knight"){
            if(!this.checkValidKnight(from, to)) return;
        }

        if(pieceMove.piece === "rook"){
            if(!this.checkValidRook(from, to)) return;
        }

        if(pieceMove.piece === "bishop"){
            if(!this.checkValidBishop(from, to)) return;
        }

        fakeBoard[from] = "em";
        fakeBoard[to] = pieceMove;
        fakeBoard[to] = JSON.parse(JSON.stringify(fakeBoard[to]));

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

    checkValidKnight(start, stop) {
        let board = this.state.board;
        if(board[stop] === "em" || board[stop].team != board[start].team){

            let distY = Math.abs(parseInt(start / 8) - parseInt(stop / 8));
            let distX = Math.abs((start % 8) - (stop % 8));
            return (distY == 2 && distX == 1) || (distX == 2 && distY == 1) ;
        }
        return false;
    }

    checkValidRook(start, stop) {
        let board = this.state.board;
        let where = []
        if(board[stop] === "em" || board[stop].team != board[start].team){ 

            // finding where the stop is located within the precomputed data
            for (let i = 0; i < rookMoves[start].length; i++) {
                for (let j = 0; j < rookMoves[start][i].length; j++) {
                    if (rookMoves[start][i][j] === stop) {
                        where = [i, j]
                    }
                }
            }

            if (where.length === 0) {
                return false
            }
            
            // checking for enemies
            for (let i = 0; i < where[1]; i++) {
                if (board[rookMoves[start][where[0]][i]] != 'em'){
                    return false
                }
            }
        } 

        return true
    }

    checkValidBishop(start, stop) {
        let board = this.state.board;
        let where = []
        if(board[stop] === "em" || board[stop].team != board[start].team){ 

            // finding where the stop is located within the precomputed data
            for (let i = 0; i < bishopMoves[start].length; i++) {
                for (let j = 0; j < bishopMoves[start][i].length; j++) {
                    if (bishopMoves[start][i][j] === stop) {
                        where = [i, j]
                    }
                }
            }

            console.log(where)

            if (where.length === 0) {
                return false
            }
            
            // checking for enemies
            for (let i = 0; i < where[1]; i++) {
                if (board[bishopMoves[start][where[0]][i]] != 'em'){
                    return false
                }
            }
        } 

        return true
    }

    render() {
        let entireBoard = [];

        for(let i = 0; i < 8; i ++){
            let currentRow = [];
            for(let j = 0; j < 8; j++){
                let squareProps = {row : i, col : j, board:this};

                if(this.state.board[(i * 8) + j] === "em"){
                    currentRow.push(<Square props = {squareProps} />);
                }
                else{
                    currentRow.push(
                    <Square props = {squareProps} >
                        <ChessPiece 
                        index = {(i * 8) + j}
                        team = {this.state.board[(i * 8) + j]["team"]}
                        piece = {this.state.board[(i * 8) + j]["piece"]}
                        key = {this.state.board[(i * 8) + j]["key"]}
                        />
                    </Square>);
                }
            }
            entireBoard.push(<div style = {{display:"flex"}}>{currentRow}</div>);
        }

        return(
            <div style = {{width:"100%", height:"100%"}}>
            <CustomDragLayer />
            {entireBoard}
            </div>
        );
    }
}

{/* huge penis */}