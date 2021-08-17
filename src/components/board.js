import React from 'react';
import { ChessPiece } from './chessPiece';
import { Square } from './square';
import { knightMoves, rookMoves, bishopMoves, queenMoves, kingMoves } from './precomputedData';
import { CustomDragLayer } from './customDrag';
import { Promotion } from './promotion';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { checkPinned } from './checkPinned';
import { generateAllLegal } from './moveGenerator';

export class Board extends React.Component {
    constructor(props){
        super(props);

        let fakeBoard = [];
        for(let i = 0; i < 64; i++){
            fakeBoard.push("em");
        }

        let startingPieces = [
            {piece:"rook", key:0, team:"black", pinned:false, moved:false},
            {piece:"knight", key:1, team:"black", pinned:false},
            {piece:"bishop", key:2, team:"black", pinned:false},
            {piece:"queen", key:3, team:"black", pinned:false},
            {piece:"king", key:4, team:"black", pinned:false, moved:false},
            {piece:"bishop", key:5, team:"black", pinned:false},
            {piece:"knight", key:6, team:"black", pinned:false},
            {piece:"rook", key:7, team:"black", pinned:false, moved:false},

            {piece:"pawn", key:8, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:9, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:10, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:11, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:12, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:13, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:14, team:"black", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:15, team:"black", pinned:false, moved:false, doublejumped: -1},

            {piece:"pawn", key:48, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:49, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:50, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:51, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:52, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:53, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:54, team:"white", pinned:false, moved:false, doublejumped: -1},
            {piece:"pawn", key:55, team:"white", pinned:false, moved:false, doublejumped: -1},

            {piece:"rook", key:56, team:"white", pinned:false, moved:false},
            {piece:"knight", key:57, team:"white", pinned:false},
            {piece:"bishop", key:58, team:"white", pinned:false},
            {piece:"queen", key:59, team:"white", pinned:false},
            {piece:"king", key:60, team:"white", pinned:false, moved:false},
            {piece:"bishop", key:61, team:"white", pinned:false},
            {piece:"knight", key:62, team:"white", pinned:false},
            {piece:"rook", key:63, team:"white", pinned:false, moved:false},
        ] 

        for(let i = 0; i < startingPieces.length; i++){
            fakeBoard[startingPieces[i]["key"]] = startingPieces[i];
        }

        this.state = {
            board:fakeBoard,
            turnNum:1,
            whitesTurn: true,
            choosingPromotion : -1
        }

        this.movePiece = this.movePiece.bind(this);
        this.genValidMovesKnight = this.genValidMovesKnight.bind(this);
        this.promotePawn = this.promotePawn.bind(this);
    }

    movePiece(from, to){
        console.log(generateAllLegal(this.state.board, "white", this.state.turnNum));

        let fakeBoard = this.state.board;
        let oldBoardState = JSON.parse(JSON.stringify(this.state.board));
        let pieceMove = fakeBoard[from];

        let kingOrNot = false
        
        if(this.state.choosingPromotion > 0) return;
        
        if(this.state.whitesTurn){
            if(pieceMove.team === "black") return;
        }
        else if(!this.state.whitesTurn){
            if(pieceMove.team === "white") return;
        }
        
        
        
        let kingsSquare = 0;
        let teamMoving = "black";
        if(this.state.whitesTurn) teamMoving = "white"

        for(let i = 0; i < 64; i++){
            if(fakeBoard[i].piece === "king" && fakeBoard[i].team == teamMoving){
                kingsSquare = i;
            }
        }
        
        if(pieceMove.piece === "knight"){
            if(!this.checkValidKnight(from, to)) return;
        }

        if(pieceMove.piece === "rook"){
            if(!this.checkValidRookBishopQueen(from, to, 'rook')) return;
        }

        if(pieceMove.piece === "bishop"){
            if(!this.checkValidRookBishopQueen(from, to, 'bishop')) return;
        }

        if(pieceMove.piece === "queen"){
            if(!this.checkValidRookBishopQueen(from, to, 'queen')) return;
        }
        

        let changePositions = true;
        if(pieceMove.piece === "king"){
            let board = fakeBoard
            let kingsMove = this.checkValidKing(from, to);
            changePositions = false;

            if(kingsMove === "black left"){
                board[2] = board[from]
                board[3] = board[to]
                board[from] = 'em'
                board[to] = 'em'
            }
            if(kingsMove === "black right"){
                board[6] = board[from]
                board[5] = board[to]
                board[to] = 'em'
                board[from] = 'em'
            }
            if(kingsMove == "white left"){
                board[58] = board[from]
                board[59] = board[to]
                board[from] = 'em'
                board[to] = 'em'
            }
            if(kingsMove == "white right"){
                board[62] = board[from]
                board[61] = board[to]
                board[to] = 'em'
                board[from] = 'em'
            }
            if(!kingsMove) return;
            if(kingsMove === true){ 
                changePositions = true;
            }
            
            kingsSquare = to;
        }

        if(pieceMove.piece === "pawn"){
            let pawnMove = this.checkValidPawn(from, to)
            if(pawnMove === "double"){
                //setting as turn number since boolean would mean i would need to set false later
                if(pieceMove.moved) return;
                fakeBoard[from].doublejumped = this.state.turnNum;
            }
            else if(pawnMove === true){
                //dont do anything
            }
            else if(pawnMove !== false){
                //must mean its an integer referring to direction on the en passant
                fakeBoard[to - (pawnMove * 8)] = "em";
            }
            else return;

            pieceMove.moved = true;

            if((-1 < to && to < 8) || (54 < to && to < 64)){
                console.log("asdasd");
                fakeBoard[from] = "em";
                fakeBoard[to] = pieceMove;
                this.setState({
                    "board": fakeBoard,
                    choosingPromotion : to
                });
                return;

            }

        }
        
        if(changePositions){
        fakeBoard[from] = "em";
        fakeBoard[to] = pieceMove;
        }

        if(!this.checkLegal(kingsSquare, teamMoving, fakeBoard)){
            this.setState({"board":oldBoardState});
            return;
        }

        let currentTurn = this.state.turnNum;
        
        this.setState(prevState => {
            return({
            "board": fakeBoard,
            turnNum: prevState.turnNum + 1,
            whitesTurn : !prevState.whitesTurn
            });
        });

        checkPinned(this.state.board, 4, 'black')
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

    checkValidRookBishopQueen(start, stop, pieceName) {

        let pieceMove = null
        if (pieceName === 'bishop') {
            pieceMove = bishopMoves 
        } 

        else if (pieceName === 'rook') {
            pieceMove = rookMoves
        }

        else if (pieceName === 'queen') {
            pieceMove = queenMoves
        }

        let board = this.state.board;
        let where = []

        

        if(board[stop] === "em" || board[stop].team != board[start].team){ 

            // finding where the stop is located within the precomputed data
            for (let i = 0; i < pieceMove[start].length; i++) {
                for (let j = 0; j < pieceMove[start][i].length; j++) {
                    if (pieceMove[start][i][j] === stop) {
                        where = [i, j]
                    }
                }
            }

            if (where.length === 0) {
                return false
            }
            
            // checking for enemies
            for (let i = 0; i < where[1]; i++) {
                if (board[pieceMove[start][where[0]][i]] != 'em'){
                    return false
                }
            }
            return true;
        }
        return false;

        
    }

    checkValidPawn(start, stop){
        //forward mvoement check
        let board = this.state.board;

        //1 means down
        let movementDir = 1;
        if(board[start].team === "white"){
            movementDir = -1;
        }

        if(board[start] === "em") return false;
        //if the start and stop is on the same row, required due to quriks of making board 1 layer
        if(Math.floor(stop / 8) == Math.floor(start / 8)) return false;
        if(Math.abs(Math.floor(stop / 8) - Math.floor(start/8)) == 2){
            if(stop === start + (16 * movementDir) && board[stop] === "em"){
                return "double";
            }
            else return false
        }

        //vertical movement
        if(stop === start + (8 * movementDir) && board[stop] === "em"){
            return true;
        }

        //diag movement
        if(stop === start + (7 * movementDir) && board[stop].team !== board[start].team && board[stop] !== "em"){
            return true;
        }
        if(stop === start + (9 * movementDir) && board[stop].team !== board[start].team && board[stop] !== "em"){
            return true;
        }
        //en passant
        //if pawn to my left or right double jumped last turn
        if(board[start - (1 * movementDir)].doublejumped === this.state.turnNum - 1){
            if(stop === start + (7 * movementDir) && board[stop] === "em"){
                return movementDir;
            }
        }

        if(board[start + (1 * movementDir)].doublejumped === this.state.turnNum - 1){
            if(stop === start + (9 * movementDir) && board[stop] === "em"){
                return movementDir;
            }
        }

        return false
    }

    genValidPawn(start){
        let validMoves = []
        let board = this.state.board;

        if(board[start].pinned){
            //not exactly true all the time
            return [];
        }

        let movementDir = 1;
        if(board[start].team === "white"){
            movementDir = -1;
        }  

        if(this.checkValidPawn(start, start + (8 * movementDir))) validMoves.push(start + (8 * movementDir));
        if(this.checkValidPawn(start, start + (16 * movementDir))) validMoves.push(start + (16 * movementDir));
        if(this.checkValidPawn(start, start + (7 * movementDir))) validMoves.push(start + (7 * movementDir));
        if(this.checkValidPawn(start, start + (9 * movementDir))) validMoves.push(start + (9 * movementDir));

        return validMoves;
    }

    checkLegal(kingSquare, kingTeam, boardState){
        //makes the king pretend to be every piece in the game, and checks if it can run into the piece its imitating
        //first checks for sliding pieces

        let possibleLines = queenMoves[kingSquare];
        let board = boardState;
        for(let i = 0; i < 4; i++){
            let currentDir = possibleLines[i];
            for(let j = 0; j < currentDir.length; j++){
                if(board[currentDir[j]] != "em"){
                    if(board[currentDir[j]].piece === "queen" || board[currentDir[j]].piece === "rook"){
                        if(board[currentDir[j]].team != kingTeam){
                            return false
                        } else break
                    } else break
                }
            }

        }
        for(let i = 4; i < 8; i++){
            let currentDir = possibleLines[i];
            for(let j = 0; j < currentDir.length; j++){
                if(board[currentDir[j]] != "em"){
                    if(board[currentDir[j]].piece === "queen" || board[currentDir[j]].piece === "bishop"){
                        if(board[currentDir[j]].team != kingTeam){
                            return false
                        } else break
                    }else break
                }
            }
        }

        for(let i = 0; i < knightMoves[kingSquare].length; i++){
            let pieceToCheck = board[knightMoves[kingSquare][i]]
            if(pieceToCheck !== "em" && pieceToCheck.team != kingTeam && pieceToCheck.piece === "knight"){
                return false
            }
        }

        let enemyPawnMoveDir = 1;
        if(kingTeam === "black") enemyPawnMoveDir = -1;

        for(let i = 0; i < kingMoves[kingSquare].length; i++){
            let squareToMove = kingMoves[kingSquare][i];
            let moveDiff = Math.abs(squareToMove - kingSquare);
            let pieceOnSquare = board[squareToMove];
            if(moveDiff == 9 || moveDiff == 7){
                if(pieceOnSquare !== "em" && (pieceOnSquare.piece === "king" || pieceOnSquare.piece === "pawn") && pieceOnSquare.team !== kingTeam){
                    return false;
                }
            }
            else{
                if(pieceOnSquare !== "em" && pieceOnSquare.piece === "king" && pieceOnSquare.team !== kingTeam){
                    return false;
                }
            }
        }

        return true;
    }

    checkValidKing(start, stop){
        let board = this.state.board;
        if((board[stop] === "em" || board[stop].team != board[start].team) && kingMoves[start].includes(stop)) {
            return true;
        } 

        else if (board[stop].team === board[start].team && board[stop].piece === 'rook' && !board[stop].moved && !board[start].moved) {
            if (board[start].team === 'black') {
                if (start - stop > 0 && board[1] === 'em' && board[2] === 'em' && board[3] === 'em') {
                    return "black left"
                }

                else if (start - stop < 0 && board[6] === 'em' && board[5] === 'em') {
                    return "black right"
                }
            }

            else if (board[start].team === 'white') {
                if (start - stop > 0 && board[59] === 'em' && board[58] === 'em' && board[57] === 'em') {
                    return "white left";
                }

                else if (start - stop < 0 && board[62] === 'em' && board[61] === 'em') {
                    return "white right"
                }
            }
        }
        return false
    }

    promotePawn(what){
        //what is what you want the pawn to be

        let fakeBoard = this.state.board;
        fakeBoard[this.state.choosingPromotion].piece = what;

        console.log(this.state);

        //functions also does the things that the movepiece didnt do since promoting a pawn pauses the game
        this.setState(prevState => {
            return({
            "board": fakeBoard,
            turnNum: prevState.turnNum + 1,
            whitesTurn : !prevState.whitesTurn,
            choosingPromotion : -1
            });
        });
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
                else if(this.state.choosingPromotion === (i * 8) + j){
                    currentRow.push(
                    <Square props = {squareProps} >
                        <Promotion 
                            promoteFunc = {this.promotePawn}
                            team = {this.state.board[(i * 8) + j].team}
                            whichWay = {((i * 8) + j) < 8 ? "down" : "up"}
                        />
                    </Square>
                    );
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