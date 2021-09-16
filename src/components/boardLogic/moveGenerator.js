import { allowedDir, knightMoves, rookMoves, bishopMoves, queenMoves, kingMoves } from "./precomputedData";
import { checkPinned } from "./checkPinned";
import { goodBishopSpots, goodKnightSpots, goodKingSpots, goodRookSpots, goodPawnSpots } from "./precomputedData";
import {transTable} from "../ai/transpositionTableStuff.js"

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

var pinnedPositions = [];
var pinnedPositionsDefault = [];
for(let i = 0; i < 64; i++){
    pinnedPositionsDefault.push(false);
}

export function generateAllLegal(boardState, whosTeam, turnNum){
    // returns a board, but each square either say that its empty, or it says where the piece on that square can move
    //takes in the board state similar to how its set up in board.js

    //reset the values back to default
    kingDoubleCheck = false;
    attackMap = [...defaultAttackMap];
    kingInCheck = false;
    dangerSquares = [...dangerSquaresDefault];
    pinnedPositions = [...pinnedPositionsDefault];

    let enemyTeam = whosTeam === "white" ? "black" : "white";
    
    //change attack map to show all squares being attacked
    //also pulls together all allied pieces into one list
    let alliedTeam = [];
    let alliedKing = 0;
    let pieceImTesting = 0;
    for(let i = 0; i < 64; i++){
        if(boardState[i].team === enemyTeam){
            generateAttackSpaces(boardState, i);
        }
        else if(boardState[i].team === whosTeam){
            alliedTeam.push(i);
            if(boardState[i].piece === "king"){
                alliedKing = i;
            }
            if(boardState[i].key === 6969){
                pieceImTesting = i;
            }
        }
    }

    /*
    console.log(attackMap);
    console.log(kingInCheck);
    console.log(kingDoubleCheck);
    console.log(dangerSquares);
    */

    let pinInfo = checkPinned(boardState, alliedKing, whosTeam);
    for(let i = 0; i < pinInfo.length; i++){
        pinnedPositions[pinInfo[i].position] = pinInfo[i].available;
    }

    let allLegalMoves = [...pinnedPositionsDefault];
    let totalMovesFound = 0;

    let kingsMoves = generateLegalKing(alliedKing, boardState)
    allLegalMoves[alliedKing] = kingsMoves;
    totalMovesFound += kingsMoves.length;

    if(kingDoubleCheck){
        if(totalMovesFound == 0){
            return "checkmate";
            console.log("checkmate");
        }
        return [allLegalMoves, totalMovesFound, [alliedKing]];
    }

    for (let i = 0; i < alliedTeam.length; i++){
        let foundMoves = [];
        if(boardState[alliedTeam[i]].piece === "king"){
            continue
        }
        else if(boardState[alliedTeam[i]].piece === "pawn"){
            foundMoves = generateLegalPawn(alliedTeam[i], boardState, turnNum);
        }
        else if(boardState[alliedTeam[i]].piece === "knight"){
            foundMoves = generateLegalKnight(alliedTeam[i], boardState);
        }
        else{
            foundMoves = generateLegalSlider(alliedTeam[i], boardState);
        }
        totalMovesFound += foundMoves.length;
        allLegalMoves[alliedTeam[i]] = foundMoves;
    }

    if(totalMovesFound == 0){
        if(kingInCheck){
            console.log("checkmate");
            console.log(attackMap);
            console.log(dangerSquares);
            return "checkmate";
        }
        else return "stalemate";
    }
    return [allLegalMoves, totalMovesFound, alliedTeam];
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
                spotsChecked.push(currentLine[j]);

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
                spotsChecked.push(currentLine[j]);

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

                    dangerSquares[pieceIndex] = true;
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
                spotsChecked.push(currentLine[j]);

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
    if(board[pos].moved) return finishedData;

    //if kingside rook hasnt moved and king ahsnt moved then can castle
    //if queenside rook hasnt moved and king hasnt moved then can castle
    //only if no pieces in between

    if(pos + 3 > 63 || pos - 4 < 0) return finishedData;

    if(board[pos + 3] != "em" && board[pos + 3].piece === "rook" && board[pos + 3].moved === false){
        if(board[pos + 1] === "em" && board[pos + 2] === "em"){
            if(!attackMap[pos + 1] && !attackMap[pos + 2]) finishedData.push("right castle");
        }
    }
    if(board[pos - 4] != "em" && board[pos - 4].piece === "rook" && board[pos - 4].moved === false){
        if(board[pos - 3] === "em" && board[pos - 2] === "em" && board[pos - 1] === "em"){
            if(!attackMap[pos - 1] && !attackMap[pos - 2]) finishedData.push("left castle");
        }
    }

    return finishedData;
}

function generateLegalKnight(pos, board){
    //if a knight is pinned it has straight no moves since it moves so weird and never in a sliding line
    if(pinnedPositions[pos] !== false) return [];

    let allowedMoves = [];
    for(let i = 0; i < knightMoves[pos].length; i++){
        let toMove = board[knightMoves[pos][i]];

        if(toMove !== "em" && toMove.team === board[pos].team) continue;

        if(kingInCheck){
            if(dangerSquares[knightMoves[pos][i]]) allowedMoves.push(knightMoves[pos][i]);
        }
        else allowedMoves.push(knightMoves[pos][i]);
    }
    return allowedMoves;
}

function checkValidPawn(start, end, turnNum, board){

    //shamelessly copy and pasted from board.js

    //1 means down
    let movementDir = 1;
    if(board[start].team === "white"){
        movementDir = -1;
    }

    if(board[start] === "em") return false;
    //if the start and stop is on the same row, required due to quriks of making board 1 layer
    if(Math.floor(end / 8) == Math.floor(start / 8)) return false;
    if(Math.abs(Math.floor(end / 8) - Math.floor(start/8)) == 2){
        if(end === start + (16 * movementDir) && board[end] === "em" && board[start].moved === false && board[end - (8 * movementDir)] === "em"){
            return "double";
        }
        else return false
    }

    //vertical movement
    if(end === start + (8 * movementDir) && board[end] === "em"){
        return true;
    }

    //diag movement
    if(end === start + (7 * movementDir) && board[end].team !== board[start].team && board[end] !== "em"){
        return true;
    }
    if(end === start + (9 * movementDir) && board[end].team !== board[start].team && board[end] !== "em"){
        return true;
    }
    //en passant
    //if pawn to my left or right double jumped last turn
    if(board[start - (1 * movementDir)].doublejumped === turnNum - 1){
        if(end === start + (7 * movementDir) && board[end] === "em"){
            return ["en passant"];
        }
    }

    if(board[start + (1 * movementDir)].doublejumped === turnNum - 1){
        if(end === start + (9 * movementDir) && board[end] === "em"){
            return ["en passant"];
        }
    }

    return false
}

function generateLegalPawn(pos, board, turnNum){

    let validMoves = []

    let movementDir = 1;
    if(board[pos].team === "white"){
        movementDir = -1;
    }  
    let start = pos;

    let possibleSpots = [
        start + (8 * movementDir), 
        start + (16 * movementDir),
        start + (7 * movementDir),
        start + (9 * movementDir)
    ]

    for (let i = 0; i < possibleSpots.length; i++){
        let returnVal = checkValidPawn(start, possibleSpots[i], turnNum, board);
        if(returnVal !== false){
            if((-1 < possibleSpots[i] && possibleSpots[i] < 8) || (55 < possibleSpots[i] && possibleSpots[i] < 64)){
                validMoves.push([possibleSpots[i], "promote queen"]);
                validMoves.push([possibleSpots[i], "promote bishop"]);
                validMoves.push([possibleSpots[i], "promote knight"]);
                validMoves.push([possibleSpots[i], "promote rook"]);
            }
            else if(returnVal === "en passant") validMoves.push(["en passant", possibleSpots[i]]);
            else validMoves.push(possibleSpots[i]);
        }
        
    }

    //filter moves so they fit with check or pin
    let validMoves2 = [];
    if(kingInCheck){
        for(let i = 0; i < validMoves.length; i++){
            if(dangerSquares[validMoves[i]]) validMoves2.push(validMoves[i]);
        }
        validMoves = validMoves2;
    }
    validMoves2 = [];
    if(pinnedPositions[pos] !== false){
        for(let i = 0; i < pinnedPositions[pos].length; i++){
            if(validMoves.includes(pinnedPositions[pos][i])) validMoves2.push(pinnedPositions[pos][i]);
        }
        validMoves = validMoves2;
    }

    return validMoves;
}

function generateLegalSlider(pos, board){
    let possibleMoves = queenMoves;
    let whatIAm = board[pos].piece;
    if(whatIAm === "bishop"){
        possibleMoves = bishopMoves;
    }
    if(whatIAm === "rook"){
        possibleMoves = rookMoves
    }

    if(pinnedPositions[pos] !== false){
        //if i am pinned, check what is pinning me
        //whats pinning me is the final item of the array
        let whatsPinning = board[pinnedPositions[pos][pinnedPositions[pos].length - 1]];
        if(whatsPinning.piece === whatIAm || whatIAm === "queen"){
            return [...pinnedPositions[pos]]
        }

        //only thing not covered is when a queen is pinnging a non queen to king

        let directionType = "straight";
        let moveOffset = Math.abs(pinnedPositions[pos][pinnedPositions[pos].length - 1] - pos);
        //if offset from piece thats pinning is diagonal
        if(moveOffset % 9 === 0 || moveOffset % 7 === 0){
            directionType = "diagonal"
        }

        if(directionType === "diagonal" && whatIAm === "bishop"){
            return [...pinnedPositions[pos]];
        }
        if(directionType === "straight" && whatIAm === "rook"){
            return [...pinnedPositions[pos]];
        }

        return [];
    }

    let allMoves = [];

    for(let i = 0; i < possibleMoves[pos].length; i++){

        let currentLine = possibleMoves[pos][i];
        for(let j = 0; j < currentLine.length; j++){

            let currSquare = board[currentLine[j]];
            if(currSquare !== "em"){
                //we ran into a piece, can no longer go any further in this direction
                if(currSquare.team !== board[pos].team){
                    if(kingInCheck){
                        if(dangerSquares[currentLine[j]]) allMoves.push(currentLine[j]);
                    }
                    else allMoves.push(currentLine[j]);
                    break;
                }
                else break;
            }
            else {
                if(kingInCheck){
                    if(dangerSquares[currentLine[j]]) allMoves.push(currentLine[j]);
                }
                else allMoves.push(currentLine[j]);
            }
            
        }
    }

    return allMoves;
}

export function lazyMoveOrder(board, info, imGay){
    //it just gets all moves, loops over them all, and then orders them sorta
    //its not efficient, thus lazy move order

    let moves = info[0];
    let where = info[2];

    let existingMoves = [];

    let pawnVal = 1;
    let bishopVal = 3;
    let knightVal = 3;
    let rookVal = 5;
    let queenVal = 9;
    let kingVal = 0;

    if(info === "checkmate" || info === "stalemate") return [];

    for(let i = 0; i < where.length; i++){
        for(let j = 0; j < moves[where[i]].length; j++){
            let currentMove = moves[where[i]][j];
            let moveValue = 0;

            //castling is always better then a move that does nothing, therefore value of 1
            if(currentMove === "right castle" || currentMove === "left castle") 
            {
                existingMoves.push([where[i], currentMove, 2]);
                continue;
            }

            let from = where[i];
            let to = 0;

            //handling en passant/promotuion
            //on pormotion, the moves value gets increased by the piece they are promoting to value
            let thingsDone = [];
            if(Array.isArray(currentMove)){
                if(currentMove[0] === "en passant") to = currentMove[1];
                else to = currentMove[0];
            }
            else{
                to = currentMove;
                thingsDone.push(currentMove[1]);
                switch(currentMove[1]){
                    case "promote queen": moveValue += queenVal + 3; break;
                    case "promote bishop": moveValue += bishopVal + 1; break;
                    case "promote knight": moveValue += knightVal + 1; break;
                    case "promote rook": moveValue += rookVal + 2; break;
                }
            }

            //on find value of piece being captured and piece that is moving
            let pieceCaptureVal = 0;
            let pieceMoveVal = 0;
            if(board[to] != "em"){
                switch(board[to].piece){
                    case "pawn": pieceCaptureVal = pawnVal; break;
                    case "bishop": pieceCaptureVal = bishopVal; break;
                    case "knight": pieceCaptureVal = knightVal; break;
                    case "rook": pieceCaptureVal = rookVal; break;
                    case "queen": pieceCaptureVal = queenVal; break;
                }
            }

            if(board[from] != "em"){
                switch(board[from].piece){
                    case "pawn": pieceMoveVal = pawnVal; break;
                    case "bishop": pieceMoveVal = bishopVal; break;
                    case "knight": pieceMoveVal = knightVal; break;
                    case "rook": pieceMoveVal = rookVal; break;
                    case "queen": pieceMoveVal = queenVal; break;
                }
            }

            //moveValue += pieceCaptureVal - pieceMoveVal;
            if(pieceCaptureVal != 0){
                //multiply by ten so that non moves are preferred less than captures
                thingsDone.push(["captured for", (10 * pieceCaptureVal) - pieceMoveVal])
                moveValue += (10 * pieceCaptureVal) - pieceMoveVal;
            }

            let enemyTeam = board[from].team === "white" ? "black" : "white";
            let pawnDirection = 1;
            if(enemyTeam === "white") pawnDirection = -1;

            let pawnSpot = Math.floor((to + 7) / 8) === 1 ? board[to + (7 * pawnDirection)] : "em";
            let pawnSpot2 = Math.floor((to + 9) / 8) === 1 ? board[to + (9 * pawnDirection)] : "em";

            if(to + (7 * pawnDirection) < 0 || to + (7 * pawnDirection) > 63) pawnSpot = "em";
            if(to + (9 * pawnDirection) < 0 || to + (9 * pawnDirection) > 63) pawnSpot2 = "em";

            if(pawnSpot != "em" && pawnSpot.piece === "pawn" && pawnSpot.team === "enemyTeam"){
                moveValue -= pieceMoveVal;
            }
            else if(pawnSpot2 != "em" && pawnSpot2.piece === "pawn" && pawnSpot2.team === "enemyTeam"){
                moveValue -= pieceMoveVal;
            }
            //else if(attackMap[to]) moveValue -= pieceMoveVal;

            let toModified = to;
            if(board[from].team === "black") toModified = 63 - toModified;

            switch(board[from].piece){
                case "bishop": moveValue += goodBishopSpots[toModified] / 100; break;
                case "rook": moveValue += goodRookSpots[toModified] / 100; break;
                case "knight": moveValue += goodKnightSpots[toModified] / 100; break;
                case "king": moveValue += goodKingSpots[toModified] / 100; break;
                case "pawn": moveValue += goodPawnSpots[toModified] / 100; break;
            }
            
            existingMoves.push([from, currentMove, moveValue]);
        }
    }
    //from here sort
    /*
    existingMoves = existingMoves.sort((a, b) => {
        if(a[2] > b[2]) return -1;
        else if(a[2] < b[2]) return 1;
        return 0;
    });
    */

    
    for(let i = 0; i < existingMoves.length - 1; i++){
        for(let j = i + 1; j > 0; j--){
            if(existingMoves[j - 1][2] < existingMoves[j][2]){
                [existingMoves[j - 1], existingMoves[j]] = [existingMoves[j], existingMoves[j - 1]];
            }
        }
    }
    

    //console.log(existingMoves);
    return existingMoves;
}

export function lazyMoveOrder2(board, info, zobKey){
    //it just gets all moves, loops over them all, and then orders them sorta
    //its not efficient, thus lazy move order

    let moves = info[0];
    let where = info[2];

    let existingMoves = [];

    let pawnVal = 1;
    let bishopVal = 3;
    let knightVal = 3;
    let rookVal = 5;
    let queenVal = 9;
    let kingVal = 0;

    if(info === "checkmate" || info === "stalemate") return [];

    //console.log("im unfinished, need zobkey");
    //console.log(transTable);
    if(transTable[zobKey] != null) {
        if(transTable[zobKey].move != null) existingMoves.push(transTable[zobKey].move);
    }

    for(let i = 0; i < where.length; i++){
        for(let j = 0; j < moves[where[i]].length; j++){
            let currentMove = moves[where[i]][j];
            let moveValue = 0;

            //castling is always better then a move that does nothing, therefore value of 1
            if(currentMove === "right castle" || currentMove === "left castle") 
            {
                existingMoves.push([where[i], currentMove, 2]);
                continue;
            }

            let from = where[i];
            let to = 0;

            //handling en passant/promotuion
            //on pormotion, the moves value gets increased by the piece they are promoting to value
            let thingsDone = [];
            if(Array.isArray(currentMove)){
                if(currentMove[0] === "en passant") to = currentMove[1];
                else to = currentMove[0];
            }
            else{
                to = currentMove;
                thingsDone.push(currentMove[1]);
                switch(currentMove[1]){
                    case "promote queen": moveValue += queenVal + 3; break;
                    case "promote bishop": moveValue += bishopVal + 1; break;
                    case "promote knight": moveValue += knightVal + 1; break;
                    case "promote rook": moveValue += rookVal + 2; break;
                }
            }

            //on find value of piece being captured and piece that is moving
            let pieceCaptureVal = 0;
            let pieceMoveVal = 0;
            if(board[to] != "em"){
                switch(board[to].piece){
                    case "pawn": pieceCaptureVal = pawnVal; break;
                    case "bishop": pieceCaptureVal = bishopVal; break;
                    case "knight": pieceCaptureVal = knightVal; break;
                    case "rook": pieceCaptureVal = rookVal; break;
                    case "queen": pieceCaptureVal = queenVal; break;
                }
            }

            if(board[from] != "em"){
                switch(board[from].piece){
                    case "pawn": pieceMoveVal = pawnVal; break;
                    case "bishop": pieceMoveVal = bishopVal; break;
                    case "knight": pieceMoveVal = knightVal; break;
                    case "rook": pieceMoveVal = rookVal; break;
                    case "queen": pieceMoveVal = queenVal; break;
                }
            }

            //moveValue += pieceCaptureVal - pieceMoveVal;
            if(pieceCaptureVal != 0){
                //multiply by ten so that non moves are preferred less than captures
                thingsDone.push(["captured for", (10 * pieceCaptureVal) - pieceMoveVal])
                moveValue += (10 * pieceCaptureVal) - pieceMoveVal;
            }

            let enemyTeam = board[from].team === "white" ? "black" : "white";
            let pawnDirection = 1;
            if(enemyTeam === "white") pawnDirection = -1;

            let pawnSpot = Math.floor((to + 7) / 8) === 1 ? board[to + (7 * pawnDirection)] : "em";
            let pawnSpot2 = Math.floor((to + 9) / 8) === 1 ? board[to + (9 * pawnDirection)] : "em";

            if(to + (7 * pawnDirection) < 0 || to + (7 * pawnDirection) > 63) pawnSpot = "em";
            if(to + (9 * pawnDirection) < 0 || to + (9 * pawnDirection) > 63) pawnSpot2 = "em";

            if(pawnSpot != "em" && pawnSpot.piece === "pawn" && pawnSpot.team === "enemyTeam"){
                moveValue -= pieceMoveVal;
            }
            else if(pawnSpot2 != "em" && pawnSpot2.piece === "pawn" && pawnSpot2.team === "enemyTeam"){
                moveValue -= pieceMoveVal;
            }
            //else if(attackMap[to]) moveValue -= pieceMoveVal;

            let toModified = to;
            if(board[from].team === "black") toModified = 63 - toModified;

            switch(board[from].piece){
                case "bishop": moveValue += goodBishopSpots[toModified] / 100; break;
                case "rook": moveValue += goodRookSpots[toModified] / 100; break;
                case "knight": moveValue += goodKnightSpots[toModified] / 100; break;
                case "king": moveValue += goodKingSpots[toModified] / 100; break;
                case "pawn": moveValue += goodPawnSpots[toModified] / 100; break;
            }
            
            existingMoves.push([from, currentMove, moveValue]);
        }
    }
    //from here sort
    /*
    existingMoves = existingMoves.sort((a, b) => {
        if(a[2] > b[2]) return -1;
        else if(a[2] < b[2]) return 1;
        return 0;
    });
    */

    
    for(let i = 0; i < existingMoves.length - 1; i++){
        for(let j = i + 1; j > 0; j--){
            if(existingMoves[j - 1][2] < existingMoves[j][2]){
                [existingMoves[j - 1], existingMoves[j]] = [existingMoves[j], existingMoves[j - 1]];
            }
        }
    }
    

    //console.log(existingMoves);
    return existingMoves;
}