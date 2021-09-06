import { generateAllLegal } from "../boardLogic/moveGenerator";
import { lazyMoveOrder } from "../boardLogic/moveGenerator";
import { goodBishopSpots, goodKnightSpots, goodKingSpots, goodRookSpots, goodPawnSpots } from "../boardLogic/precomputedData";

const queenVal = 900;
const bishopVal = 300;
const knightVal = 300;
const rookVal = 500;
const pawnVal = 100;


export var bestMove = []
export var biggestDepth = 0
var previous = "em";
export var fuckMe = 0;
var myTeam = "black";




// this basic idea is from here https://www.youtube.com/watch?v=U4ogK0MIzqk
//great video from sebastian lague talking about making a chess ai
// recursive function, depth first search going like a depth of 3 or 4 on all possible moves
//the value of the move is based on piece value
//go on enemys best move on your move and stuff
//ive got no idea how to explain in text form but heres a timestamp of a good explanation https://youtu.be/U4ogK0MIzqk?t=819


export function resetGlobalVar(team) {
    bestMove = [];
    biggestDepth = 0;
    fuckMe = 0;
    myTeam = team;
}

export function decideBestAiMove(board, team, turnNum, depth, alpha, beta){
    if(fuckMe === 2000000) console.log("youve gone to a depth of 2 million, so im stopping the function");
    if(fuckMe >= 2000000) return;
    if(depth === 0){
        fuckMe += 1;
        let oppTeam = (team === "white" ? "black" : "white");
        let mult = 1;
        if(biggestDepth % 2 == 0) mult = -1;
        return mult * (evaluateValue(board, team) - evaluateValue(board, oppTeam));
    } 

    if (depth > biggestDepth) {
        biggestDepth = depth;
    }

    let movesAtCurrent = generateAllLegal(board, team, turnNum);
    let ordered = lazyMoveOrder([...board], movesAtCurrent);

    if(movesAtCurrent === "checkmate") return -100000000;
    if(movesAtCurrent === "stalemate") return 0;

    //console.log(ordered);

    for(let i = 0; i < ordered.length; i++){
        let curr = ordered[i];
        let newBoard = makeBoardMove(board, curr[0], curr[1]);
        let previousMove = previous;
        let oppositeTeam = board[curr[0]].team;

        if (oppositeTeam === 'white') {
            oppositeTeam = 'black';
        } else {
            oppositeTeam = 'white';
        }

        let evaluation = -(decideBestAiMove(newBoard, oppositeTeam, turnNum + 1, depth - 1, -beta, -alpha));

        unMakeBoardMove(board, curr[0], curr[1], previousMove);

        if (evaluation >= beta) {
            return beta;
        }

        let changedAlpha = false;

        if(evaluation > alpha && depth === biggestDepth) {
            alpha = evaluation;
            changedAlpha = true;
        }
        else alpha = Math.max(alpha, evaluation);

        if (changedAlpha && depth === biggestDepth) {
            bestMove = [curr[0], curr[1]];
            //console.log(evaluation);
            //console.log(bestMove);
            //console.log(alpha);
        }
    }
    
    
    /*
    //old code
    //works if you make it
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

            let evaluation = -(decideBestAiMove(newBoard, oppositeTeam, turnNum + 1, depth - 1, -beta, -alpha));
            unMakeBoardMove(board, curr, movesAtCurrent[0][curr][j], previousMove);
            if (evaluation >= beta) {
                return beta;
            }

<<<<<<< HEAD
            let changed = false
            if (depth === biggestDepth) {
                if (evaluation > alpha) {
                    alpha = evaluation
                    changed = true
                }
            } else {
                alpha = Math.max(alpha, evaluation)
            }

            

            if (changed && depth === biggestDepth) {
=======
            let changedAlpha = false;

            if(evaluation > alpha && depth === biggestDepth) {
                alpha = evaluation;
                changedAlpha = true;
            }
            else alpha = Math.max(alpha, evaluation);

            if (changedAlpha && depth === biggestDepth) {
>>>>>>> 31ba67f97287c1e0561bcf0330e532fb1e3a8021
                bestMove = [curr, movesAtCurrent[0][curr][j]];
                //console.log(bestMove);
                //console.log(alpha);
            }
        }
    }
    */
    
    return alpha
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

export function orderlessDecideBestAiMove(board, team, turnNum, depth, alpha, beta){
    
    if(depth === 0){
        fuckMe += 1;
        let oppTeam = (team === "white" ? "black" : "white");
        let mult = 1;
        if(biggestDepth % 2 == 0) mult = -1;
        return mult * (evaluateValue(board, team) - evaluateValue(board, oppTeam));
    } 

    if (depth > biggestDepth) {
        biggestDepth = depth;
    }

    let movesAtCurrent = generateAllLegal(board, team, turnNum);
    //let ordered = lazyMoveOrder([...board], movesAtCurrent);

    if(movesAtCurrent === "checkmate") return -100000000;
    if(movesAtCurrent === "stalemate") return 0;

    //console.log(ordered);

    /*
    for(let i = 0; i < ordered.length; i++){
        let curr = ordered[i];
        let newBoard = makeBoardMove(board, curr[0], curr[1]);
        let previousMove = previous;
        let oppositeTeam = board[curr[0]].team;

        if (oppositeTeam === 'white') {
            oppositeTeam = 'black';
        } else {
            oppositeTeam = 'white';
        }

        let evaluation = -(decideBestAiMove(newBoard, oppositeTeam, turnNum + 1, depth - 1, -beta, -alpha));

        unMakeBoardMove(board, curr[0], curr[1], previousMove);

        if (evaluation >= beta) {
            return beta;
        }

        let changedAlpha = false;

        if(evaluation > alpha && depth === biggestDepth) {
            alpha = evaluation;
            changedAlpha = true;
        }
        else alpha = Math.max(alpha, evaluation);

        if (changedAlpha && depth === biggestDepth) {
            bestMove = [curr[0], curr[1]];
            console.log(evaluation);
            //console.log(bestMove);
            //console.log(alpha);
        }
    }
    */
    
    
    
    //old code
    //works if you make it
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

            let evaluation = -(decideBestAiMove(newBoard, oppositeTeam, turnNum + 1, depth - 1, -beta, -alpha));
            unMakeBoardMove(board, curr, movesAtCurrent[0][curr][j], previousMove);
            if (evaluation >= beta) {
                return beta;
            }

            let changedAlpha = false;

            if(evaluation > alpha && depth === biggestDepth) {
                alpha = evaluation;
                changedAlpha = true;
            }
            else alpha = Math.max(alpha, evaluation);

            if (changedAlpha && depth === biggestDepth) {
                bestMove = [curr, movesAtCurrent[0][curr][j]];
                //console.log(bestMove);
                //console.log(alpha);
            }
        }
    }
    
    
    return alpha
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
            let number = i;
            if(team === "black") number = 63 - i;

            switch(board[i].piece){
                case "pawn": totalVal += pawnVal; break;
                case "rook": totalVal += rookVal; break;
                case "knight": totalVal += knightVal; break;
                case "bishop": totalVal += bishopVal; break;
                case "queen": totalVal += queenVal; break;
                //case "king" : totalVal += goodKingSpots[number]; break;
            }
        }
    }

    return totalVal;
}