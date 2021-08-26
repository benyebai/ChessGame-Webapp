import { allowedDir, knightMoves, rookMoves, bishopMoves, queenMoves, kingMoves } from "./precomputedData";
import { checkPinned } from "./checkPinned";

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
    attackMap = defaultAttackMap;
    kingInCheck = false;
    dangerSquares = dangerSquaresDefault;
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

    if(kingDoubleCheck) return [allLegalMoves, totalMovesFound, [alliedKing]];

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
        if(kingInCheck) return "checkmate";
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
            if(!attackMap[pos + 1] && !attackMap[pos + 2])finishedData.push("right castle");      
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
        if(end === start + (16 * movementDir) && board[end] === "em" && board[start].moved === false){
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
            return movementDir;
        }
    }

    if(board[start + (1 * movementDir)].doublejumped === turnNum - 1){
        if(end === start + (9 * movementDir) && board[end] === "em"){
            return movementDir;
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
            if((-1 < possibleSpots[i] && possibleSpots[i] < 8) || (54 < possibleSpots[i] && possibleSpots[i] < 64)){
                validMoves.push([possibleSpots[i], "promote queen"]);
                validMoves.push([possibleSpots[i], "promote bishop"]);
                validMoves.push([possibleSpots[i], "promote knight"]);
                validMoves.push([possibleSpots[i], "promote rook"]);
            }
            else validMoves.push(possibleSpots[i])
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