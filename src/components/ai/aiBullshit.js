import { generateAllLegal } from "../boardLogic/moveGenerator";

const queenVal = 900;
const bishopVal = 300;
const knightVal = 300;
const rookVal = 500;
const pawnVal = 100;


export var bestMove = []
export var biggestDepth = 0
var previous = "em";




// this basic idea is from here https://www.youtube.com/watch?v=U4ogK0MIzqk
//great video from sebastian lague talking about making a chess ai
// recursive function, depth first search going like a depth of 3 or 4 on all possible moves
//the value of the move is based on piece value
//go on enemys best move on your move and stuff
//ive got no idea how to explain in text form but heres a timestamp of a good explanation https://youtu.be/U4ogK0MIzqk?t=819


export function resetGlobalVar() {
    bestMove = []
    biggestDepth = 0
}

export function decideBestAiMove(board, team, turnNum, depth){
    if(depth === 0){
        let oppTeam = (team === "white" ? "black" : "white");
        return -(evaluateValue(board, team) - evaluateValue(board, oppTeam));
    } 

    if (depth > biggestDepth) {
        biggestDepth = depth
    }

    let movesAtCurrent = generateAllLegal(board, team, turnNum);
    if(movesAtCurrent === "checkmate") return -100000000;
    if(movesAtCurrent === "stalemate") return 0;

    let bestEvaluation = -100000000

    for(let i = 0; i < movesAtCurrent[2].length; i++){
        let curr = movesAtCurrent[2][i];
        for(let j = 0; j < movesAtCurrent[0][curr].length; j++){
            let newBoard = makeBoardMove(board, curr, movesAtCurrent[0][curr][j]);
            let previousMove = previous;
            let oppositeTeam = board[curr].team;

            if (oppositeTeam === 'white') {
                oppositeTeam = 'black';
            } else {
                oppositeTeam = 'white';
            }

            let evaluation = -(decideBestAiMove(newBoard, oppositeTeam, turnNum + 1, depth - 1));
            bestEvaluation = Math.max(evaluation, bestEvaluation);
            unMakeBoardMove(board, curr, movesAtCurrent[0][curr][j], previousMove);

            if (bestEvaluation === evaluation && depth === biggestDepth) {
                bestMove = [curr, movesAtCurrent[0][curr][j]];
                console.log(bestMove);
                console.log(bestEvaluation);
            }
        }
    }

    return bestEvaluation
}

export function makeBoardMove(board, start, move){
    //all special moves that i can think of
    //let board = [...boardasd];


    if(move === "right castle"){
        board[start + 2] = board[start];
        board[start] = "em";
        board[start + 3] = board[start + 1];
        board[start + 1] = "em"
        return board;
    }
    else if (move === "left castle"){
        board[start - 2] = board[start];
        board[start] = "em";
        board[start - 4] = board[start - 1];
        board[start - 1] = "em"
        return board;
    }
    else if(Array.isArray(move)){

        if(move[0] === "en passant"){
            let pawnDirection = (move[1] - start) / Math.abs(move[1] - start);
            board[move[1]] = board[start];
            board[start] = "em";
            previous = board[move[1] - (8 * pawnDirection)];
            board[move[1] - (8 * pawnDirection)] = "em";
            return board;
        }
        else{
            previous = board[move[0]];
            board[move[0]] = board[start];
            board[start] = "em";
            switch(move[1]){
                case "promote queen": board[move[0]].piece = "queen"; break;
                case "promote rook": board[move[0]].piece = "rook"; break;
                case "promote bishop": board[move[0]].piece = "bishop"; break;
                case "promote knight": board[move[0]].piece = "knight"; break;
            }
            return board;
        }

    }

    previous = board[move];
    
    if(board[start].piece === "king"){
        board[start].moved = true;
    }
    if(board[start].piece === "rook"){
        board[start].moved = true;
    }
    if(board[start].piece === "pawn"){
        board[start].moved = true;
    }

    board[move] = board[start];
    board[start] = "em";
    return board;
}

export function unMakeBoardMove(board, start, move, previous){
    //all special moves that i can think of
    //en passant is not here since its sorta different
    if(previous == null){console.log(move)}

    if(move === "right castle"){
        board[start] = board[start + 2];
        board[start + 2] = "em";
        board[start + 1] = board[start + 3];
        board[start + 1] = "em"
        return board;
    }
    else if (move === "left castle"){
        board[start] = board[start - 2];
        board[start - 2] = "em";
        board[start - 1] = board[start - 4];
        board[start - 1] = "em";
        return board;
    }
    else if(Array.isArray(move)){
        if(move[0] === "en passant"){
            let pawnDirection = (move[1] - start) / Math.abs(move[1] - start);
            board[start] = board[move[1]];
            board[move[1]] = "em";
            board[move[1] - (8 * pawnDirection)] = previous;
            return board;
        }

        board[start] = board[move[0]];
        board[move[0]] = previous;
        board[start].piece = "pawn";
        return board;
    }

    if(board[move].piece === "pawn"){
        board[start] = board[move];
        if(board[move].movedBefore !== true) board[move].moved = false;
        board[move] = previous;

        return board;
    }

    if(board[move].piece === "king"){
        if(board[move].movedBefore !== true) board[move].moved = false;
    }
    if(board[move].piece === "rook"){
        if(board[move].movedBefore !== null) board[move].moved = false;
    }

    board[start] = board[move];
    board[move] = previous;
    return board;
}

function evaluateValue(board, team){
    let totalVal = 0;
    for(let i = 0; i < board.length; i++){
        if(board[i].team === team){
            switch(board[i].piece){
                case "pawn": totalVal += pawnVal; break;
                case "rook": totalVal += rookVal; break;
                case "knight": totalVal += knightVal; break;
                case "bishop": totalVal += bishopVal; break;
                case "queen": totalVal += queenVal; break;
            }
        }
    }

    return totalVal;
}