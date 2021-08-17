import { allowedDir, knightMoves, rookMoves, bishopMoves, queenMoves, kingMoves } from "./precomputedData";

var kingDoubleCheck = false;
var defaultAttackMap = [];
for(let i = 0; i < 64; i++){
    defaultAttackMap.push(false);
}
var attackMap = defaultAttackMap;
var kingInCheck = false;

var dangerSquares = [];
var dangerSquaresDefault = [];
for(let i = 0; i < 64; i++){
    dangerSquares.push(false);
}

var legalMovesDefault = [];
for(let i = 0; i < 64; i++){
    legalMovesDefault.push([]);
}

export function generateAllLegal(boardState, whosTeam){
    // returns a board, but each square either say that its empty, or it says where the piece on that square can move
    //takes in the board state similar to how its set up in board.js

    //reset the values back to default
    kingDoubleCheck = false;
    attackMap = defaultAttackMap;
    kingInCheck = false;
    dangerSquares = dangerSquaresDefault;

    let enemyTeam = whosTeam === "white" ? "black" : "white";
    
    //change attack map to show all squares being attacked
    //also pulls together all allied pieces into one list
    let alliedTeam = [];
    let alliedKing = 0;
    for(let i = 0; i < 64; i++){
        if(boardState[i].team === enemyTeam){
            generateAttackSpaces(boardState, i);
        }
        else if(boardState[i].team === whosTeam){
            alliedTeam.push(i);
            if(boardState[i].piece === "king"){
                alliedKing = i;
            }
        }
    }

    
    console.log(attackMap);
    console.log(kingInCheck);
    console.log(kingDoubleCheck);
    console.log(dangerSquares);

    //generate king moves
    //if double check then youre done


}

function generateAttackSpaces(boardState, pieceIndex){
    let board = boardState;
    let toCheck = boardState[pieceIndex];
    let dangerSquaresFake = [];

    if(toCheck.piece === "pawn"){
        let moveDir = -1
        if(toCheck.team === "black") moveDir = 1;

        if(Math.abs(Math.floor(pieceIndex / 8) - Math.floor((pieceIndex + (7 * moveDir)) / 8)) === 1){
            attackMap[pieceIndex + (7 * moveDir)] = true;

            if(board[pieceIndex + (7 * moveDir)].piece === "king"){
                if(board[pieceIndex].team !== board[pieceIndex + (7 * moveDir)].team){
                    kingDoubleCheck = kingInCheck;
                    kingInCheck = true;

                    dangerSquaresFake = [pieceIndex];
                }
            }

        }
        if(Math.abs(Math.floor(pieceIndex / 8) - Math.floor((pieceIndex + (9 * moveDir)) / 8)) === 1){
            attackMap[pieceIndex + (9 * moveDir)] = true;

            if(board[pieceIndex + (9 * moveDir)].piece === "king"){
                if(board[pieceIndex].team !== board[pieceIndex + (9 * moveDir)].team){
                    kingDoubleCheck = kingInCheck;
                    kingInCheck = true;

                    dangerSquaresFake = [pieceIndex];
                }
            }
        }
    }

    else if(toCheck.piece === "king"){
        for(let i = 0; i < kingMoves[pieceIndex].length; i++){
            attackMap[kingMoves[pieceIndex][i]] = true;
        }
    }

    else if(toCheck.piece === "queen"){
        for(let i = 0; i < queenMoves[pieceIndex].length; i++){

            let currentLine = queenMoves[pieceIndex][i];
            let spotsChecked = [];
            let breakNext = false;

            for(let j = 0; j < currentLine.length; j++){
                attackMap[currentLine[j]] = true;

                let currSquare = board[currentLine[j]];
                if(currSquare !== "em"){
                    if(currSquare.team !== board[pieceIndex].team && currSquare.piece === "king"){
                        kingDoubleCheck = kingInCheck;
                        kingInCheck = true;
                        breakNext = true;

                        dangerSquaresFake = [...spotsChecked, pieceIndex];
                    }
                    else if(breakNext) break;
                    else break;
                }
            }
        }
    }

    else if(toCheck.piece === "bishop"){
        for(let i = 0; i < bishopMoves[pieceIndex].length; i++){

            let currentLine = bishopMoves[pieceIndex][i];
            let spotsChecked = [];
            let breakNext = false;

            for(let j = 0; j < currentLine.length; j++){
                attackMap[currentLine[j]] = true;

                let currSquare = board[currentLine[j]];
                if(currSquare !== "em"){
                    if(currSquare.team !== board[pieceIndex].team && currSquare.piece === "king"){
                        kingDoubleCheck = kingInCheck;
                        kingInCheck = true;
                        breakNext = true;

                        dangerSquaresFake = [...spotsChecked, pieceIndex];
                    }
                    else if(breakNext) break;
                    else break;
                }
            }
        }
    }

    else if(toCheck.piece === "knight"){
        for(let i = 0; i < knightMoves[pieceIndex].length; i++){
            attackMap[knightMoves[pieceIndex][i]] = true;

            if(board[knightMoves[pieceIndex][i]] !== "em" && board[knightMoves[pieceIndex][i]].piece === "king"){
                if(board[pieceIndex].team !== board[knightMoves[pieceIndex][i]].team){
                    kingDoubleCheck = kingInCheck;
                    kingInCheck = true;

                    dangerSquares = [pieceIndex];
                }
            }
        }
    }

    else if(toCheck.piece === "rook"){
        for(let i = 0; i < rookMoves[pieceIndex].length; i++){

            let currentLine = rookMoves[pieceIndex][i];
            let spotsChecked = [];
            let breakNext = false;

            for(let j = 0; j < currentLine.length; j++){
                attackMap[currentLine[j]] = true;

                let currSquare = board[currentLine[j]];
                if(currSquare !== "em"){
                    if(currSquare.team !== board[pieceIndex].team && currSquare.piece === "king"){
                        kingDoubleCheck = kingInCheck;
                        kingInCheck = true;
                        breakNext = true;

                        dangerSquaresFake = [...spotsChecked, pieceIndex];
                    }
                    else if(breakNext) break;
                    else break;
                }
            }
        }
    }

    for(let i = 0; i < dangerSquaresFake.length; i++){
        dangerSquares[dangerSquaresFake[i]] = true; 
    }
}

function generateLegalKing(pos, board){
    let finishedData = [];
    for(let i = 0; i < kingMoves[pos].length; i++){
        //checks for both if the square is being attacked and if its not occupied by ally

        let potentialMove = kingMoves[pos][i];
        if(attackMap[potentialMove]) continue;
        if(board[potentialMove] !== "em" && board[pos].team === board[potentialMove].team) continue;

        finishedData.push(potentialMove);
    }
    if(kingInCheck) return finishedData;
    if(!board[pos].moved) return finishedData;

    //if kingside rook hasnt moved and king ahsnt moved then can castle
    //if queenside rook hasnt moved and king hasnt moved then can castle

    if(board[pos + 3].piece === "rook" && board[pos + 3].moved === false) finishedData.push("right");
    if(board[pos - 4].piece === "rook" && board[pos - 4].moved === false) finishedData.push("right");

    return finishedData;
}

function generatelegalKnight(pos, board){
    //if a knight is pinned it has straight no moves since it moves so weird and never in a sliding line
    if(board.pinned) return [];
    let allowedMoves = [];
    for(let i = 0; i < knightMoves[pos].length; i++){
        let toMove = board[knightMoves[pos][i]];

        if(toMove !== "em" && toMove.team === board[pos].team) continue;

        if(kingInCheck){
            if(dangerSquares[knightMoves[pos][i]]) allowedMoves.push(knightMoves[pos][i]);
        }
        else allowedMoves.push(knightMoves[pos][i]);
    }
}