export let allowedDir = [];
export let knightMoves = [];
export let rookMoves = [];
export let bishopMoves = [];
export let queenMoves = [];
export let kingMoves = [];

//how far north south east west you can move from each square
for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
        let north = i;
        let south = 7 - i;
        let east = 7 - j;
        let west = j;

        let northEast = Math.min(north, east);
        let northWest = Math.min(north, west);
        let southEast = Math.min(south, east);
        let southWest = Math.min(south, west);

        allowedDir.push([north, east, south, west, northEast, southEast, southWest, northWest]);
    }
}

//where the knight can move on each square
for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
        let currentAllowed = allowedDir[(i * 8) + j];
        let knightJumpsWhere = [];

        for(let y = -2; y <= 2; y++){
            if(y == 0) y += 1;
            if(y > 0) {
                if (y > currentAllowed[2]) continue;
            }
            else {
                if (Math.abs(y) > currentAllowed[0]) continue;
            }
            

            for (let x = -1; x <= 1; x++) {
                if (x == 0) x += 1;
                let realx = ((3 - Math.abs(y)) * x);
                
                if (realx > 0){
                    if (realx > currentAllowed[1]) continue;
                }
                else {
                    if (Math.abs(realx) > currentAllowed[3]) continue;
                }
                
                knightJumpsWhere.push((y * 8 + realx) + ((i * 8) + j));
            }
        }
        knightMoves.push(knightJumpsWhere);

    }
}
    
// rook
for(let i = 0; i < 64; i++){
    let currentAllowed = allowedDir[i]
    let possibleMoves = []

    for (let j = 0; j < 4; j++) {
        let direction = []
        for (let x = 1; x < (currentAllowed[j] + 1); x++) {
            

            // north
            if (j === 0) {
                direction.push(i - (8 * x))
            }
            
            // east
            else if (j === 1) {
                direction.push(i + (1 * x))
            }
            
            // south
            else if (j === 2) {
                direction.push(i + (8 * x))
            }

            // west
            else {
                direction.push(i - (1 * x))
            }

        }
        possibleMoves.push(direction)
    } 

    rookMoves.push(possibleMoves)
}

// bishop
for(let i = 0; i < 64; i++){
    let currentAllowed = allowedDir[i]
    let possibleMoves = []

    for (let j = 4; j < 8; j++) {
        let direction = []
        for (let x = 1; x < (currentAllowed[j] + 1); x++) {
            

            // north east
            if (j === 4) {
                direction.push(i - (7 * x))
            }
            
            // south east
            else if (j === 5) {
                direction.push(i + (9 * x))
            }
            
            // south west
            else if (j === 6) {
                direction.push(i + (7 * x))
            }

            // west
            else {
                direction.push(i - (9 * x))
            }

        }
        possibleMoves.push(direction)
    } 

    bishopMoves.push(possibleMoves)
}


for(let i = 0; i < 64; i++){
    let currentAllowed = allowedDir[i]
    let possibleMoves = []

    for (let j = 0; j < 8; j++) {
        let direction = []
        for (let x = 1; x < (currentAllowed[j] + 1); x++) {
            

            // north
            if (j === 0) {
                direction.push(i - (8 * x))
            }
            
            // east
            else if (j === 1) {
                direction.push(i + (1 * x))
            }
            
            // south
            else if (j === 2) {
                direction.push(i + (8 * x))
            }

            // west
            else if (j === 3) {
                direction.push(i - (1 * x))
            }

            // north east
            else if (j === 4) {
                direction.push(i - (7 * x))
            }
            
            // south east
            else if (j === 5) {
                direction.push(i + (9 * x))
            }
            
            // south west
            else if (j === 6) {
                direction.push(i + (7 * x))
            }

            // west
            else {
                direction.push(i - (9 * x))
            }

        }
        possibleMoves.push(direction)
    } 

    queenMoves.push(possibleMoves)
}

for (let x = 0; x < 64; x++) { 
    let currentAllowed = allowedDir[x]
    let possibleMoves = []
    

    for (let i = 0; i < currentAllowed.length; i++) {

        if (currentAllowed[i] != 0) {
            for (let j = 0; j < 1; j++) {
                if (i === 0) {
                    possibleMoves.push(x - 8)
                }

                else if (i === 1) {
                    possibleMoves.push(x + 1)
                }

                else if (i === 2) {
                    possibleMoves.push(x + 8)
                }

                else if (i === 3) {
                    possibleMoves.push(x - 1)
                }

                else if (i === 4) {
                    possibleMoves.push(x - 7)
                }

                else if (i === 5) {
                    possibleMoves.push(x + 9)
                }

                else if (i === 6) {
                    possibleMoves.push(x + 7)
                }

                else if (i === 7) {
                    possibleMoves.push(x - 9)
                }
            }
        }
    }

    kingMoves.push(possibleMoves)

}
