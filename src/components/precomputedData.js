export let allowedDir = [];
export let knightMoves = [];

//how far north south east west you can move from each square
for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
        let north = i;
        let south = 7 - i;
        let east = 7 - j;
        let west = j;

        allowedDir.push([north, east, south, west]);
    }
}

//where the knight can move on each square
for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
        let currentAllowed = allowedDir[(i * 8) + j];
        let knightJumpsWhere = [];

        for(let y = -2; y <= 2; y++){
            if(y == 0) y += 1;
            if(y > 0){
                if(y > currentAllowed[2]) continue;
            }
            else{
                if(Math.abs(y) > currentAllowed[0]) continue;
            }
            

            for (let x = -1; x <= 1; x++){
                if(x == 0) x += 1;
                let realx = ((3 - Math.abs(y)) * x);
                
                if(realx > 0){
                    if(realx > currentAllowed[1]) continue;
                }
                else{
                    if(Math.abs(realx) > currentAllowed[3]) continue;
                }
                
                knightJumpsWhere.push((y * 8 + realx) + ((i * 8) + j));
            }
        }
        knightMoves.push(knightJumpsWhere);

    }
}

console.log(knightMoves);
    