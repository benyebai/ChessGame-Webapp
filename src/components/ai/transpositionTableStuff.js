//im going to cry this is hard
let cry = {depth:1, flag:"either exact, alpha, or beta", value: 16, best: [1, 17]};
export var transTable = {};

function addBoardFuckYou(depth, val, zobKey, move, flag){
    if(transTable[zobKey] != null && transTable[zobKey].depth <= depth){
        return;
    }
    transTable[zobKey] = {
        "depth" : depth,
        "value" : val,
        "move" : move,
        "flag" : flag
    }
}

function searchForBoardFuckYou(zobKey, alpha, beta, depth){
    let entry = transTable[zobKey]

    if(entry != null){
        if(entry.depth >= depth){
            if(entry.flag === "exact") return entry;
            else if(entry.flag === "alpha" && entry.val <= alpha) return entry;
            else if(entry.flag === "beta" && entry.val <= beta) return entry;
        }
    }
    return "failed";
}

export function searchForBoardMove(zobKey){
    let entry = transTable[zobKey]

    if(entry != null){
        return entry;
    }
    return "failed";
}

export function addBoard(val, zobKey, move, depth){
    if(transTable[zobKey] == null){
        transTable[zobKey] = {
            "value" : val,
            "move" : move,
        }
        return;
    }
    else if(transTable[zobKey].depth <= depth){
        transTable[zobKey] = {
            "value" : val,
            "move" : move,
        }
    }
    else{
        if(transTable[zobKey].value < val){
            transTable[zobKey] = {
                "value" : val,
                "move" : move,
            }
        }
    }
    

}