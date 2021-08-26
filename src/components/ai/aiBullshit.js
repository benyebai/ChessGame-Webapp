import { generateAllLegal } from "../boardLogic/moveGenerator";

const queenVal = 90;
const bishopVal = 30;
const knightVal = 30;
const rookVal = 50;
const pawnVal = 10;


export var bestMove = []
export var biggestDepth = 0




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
    if(depth === 0) return evaluateValue(board, team);

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
            let newBoard = makeBoardMove(board, curr, movesAtCurrent[0][curr][j])
            let oppositeTeam = board[curr].team

            if (oppositeTeam === 'white') {
                oppositeTeam = 'black'
            } else {
                oppositeTeam = 'white'
            }

            let evaluation = -(decideBestAiMove(newBoard, oppositeTeam, turnNum + 1, depth - 1))
            bestEvaluation = Math.max(evaluation, bestEvaluation)

            if (bestEvaluation === evaluation && depth === biggestDepth) {
                bestMove = [curr, movesAtCurrent[0][curr][j]]
            }


        }
    }

    return bestEvaluation
}

export function makeBoardMove(boardUntouchable, start, move){
    //all special moves that i can think of
    //en passant is not here since its sorta different

    let board = [...boardUntouchable];

    if(move === "right castle"){

    }
    else if (move === "left castle"){

    }
    else if(Array.isArray(move)){
        board[move[0]] = board[start];
        board[start] = "em";
        switch(move[1]){
            case "promote queen": board[move[0]].piece = "queen";
            case "promote rook": board[move[0]].piece = "rook";
            case "promote bishop": board[move[0]].piece = "bishop";
            case "promote knight": board[move[0]].piece = "knight";
        }
    }

    if(board[start].piece === "pawn"){
        let pawnDirection = (move - start) / Math.abs(move - start);
        if(move - start != 8 && board[move] === "em"){
            board[move] = board[start];
            board[start] = "em";
            board[move - (8 * pawnDirection)] = "em";
        }
        else{
            board[move] = board[start];
            board[start] = "em";
        }
        return board;
    }

    board[move] = board[start];
    board[start] = "em";
    return board;
}

function evaluateValue(board, team){
    let totalVal = 0;
    for(let i = 0; i < board.length; i++){
        if(board[i].team === team){
            switch(board[i].piece){
                case "pawn": totalVal += pawnVal;
                case "rook": totalVal += rookVal;
                case "knight": totalVal += knightVal;
                case "bishop": totalVal += bishopVal;
                case "queen": totalVal += queenVal;
            }
        }
    }
    return totalVal;
}