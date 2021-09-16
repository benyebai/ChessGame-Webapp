//im going to cry this is hard

//i love sebastian lague so much that i would suck him off if he asked me to
//his code is incredibly readable and makes sense. you arent getting any of that here
//https://github.com/SebLague/Chess-AI/blob/main/Assets/Scripts/Core/TranspositionTable.cs


export var transTable = {};

export function resetTransTable(){
    transTable = {};
}

export function recordHash(depth, val, zobKey, move, flag){
    if(transTable[zobKey] != null){
        return;
    }
    transTable[zobKey] = {
        "depth" : depth,
        "value" : val,
        "move" : move,
        "flag" : flag
    }
}

export function probeHash(zobKey, alpha, beta, depth){
    let entry = transTable[zobKey]

    if(entry != null){
        if(entry.depth >= depth){
            if(entry.flag === "exact") return entry;
            else if(entry.flag === "alpha" && entry.val <= alpha) return alpha;
            else if(entry.flag === "beta" && entry.val <= beta) return beta;
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