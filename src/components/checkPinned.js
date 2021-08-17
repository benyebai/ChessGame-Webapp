import { queenMoves } from './precomputedData';


export function checkPinned(board, kingPos, team) {
    let lineOfSight = queenMoves[kingPos]
    let boardCopy = board
    
    // horizontally
    let pinned = []


    
    for (let i = 0; i < 4; i++) {
        let found = null
        let foundPos = null
        for (let j = 0; j < lineOfSight[i].length; j++) {

            if (found != null && boardCopy[lineOfSight[i][j]].team === team) {
                break
            }

            else if (boardCopy[lineOfSight[i][j]].team != team && found != null && (boardCopy[lineOfSight[i][j]].piece === 'rook' || boardCopy[lineOfSight[i][j]].piece === 'queen')) {
                let pin = {}
                let redSpots = []

                for (let x = 0; x < j; x++) {
                    if (boardCopy[lineOfSight[i][x]] != found) {
                    redSpots.push(lineOfSight[i][x])

                    }
                }

                redSpots.push(lineOfSight[i][j])
                
                pin['piece'] = found.piece
                pin['available'] = redSpots
                pin['position'] = foundPos 
                pin['team'] = team
                pinned.push(pin)


                break
            }

            
            else if (boardCopy[lineOfSight[i][j]].team === team && found === null) {
                found = boardCopy[lineOfSight[i][j]]
                foundPos = lineOfSight[i][j]
            }

           
            
        }
    }

    for (let i = 4; i < 8; i++) {
        let found = null
        let foundPos = null
        for (let j = 0; j < lineOfSight[i].length; j++) {

            if (found != null && boardCopy[lineOfSight[i][j]].team === team) {
                break
            }

            else if (boardCopy[lineOfSight[i][j]].team != team && found != null && (boardCopy[lineOfSight[i][j]].piece === 'bishop' || boardCopy[lineOfSight[i][j]].piece === 'queen')) {
                let pin = {}
                let redSpots = []

                for (let x = 0; x < j; x++) {
                    if (boardCopy[lineOfSight[i][x]] != found) {
                    redSpots.push(lineOfSight[i][x])

                    }
                }

                redSpots.push(lineOfSight[i][j])
                
                pin['piece'] = found.piece
                pin['available'] = redSpots
                pin['position'] = foundPos 
                pin['team'] = team
                pinned.push(pin)


                break
            }

            
            else if (boardCopy[lineOfSight[i][j]].team === team && found === null) {
                found = boardCopy[lineOfSight[i][j]]
                foundPos = lineOfSight[i][j]
            }

           
            
        }
    }


    
    


    console.log(pinned)

    return pinned
}

