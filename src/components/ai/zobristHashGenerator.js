let generatedNums = []
let usedNum = [1, 2]

let blackTeam = 2
let whiteTeam = 1
export function yes() {
for (let i = 0; i < 64; i++) {
    let array = {}

    let white = {}
    let black = {}
    
    let nums = []
    for (let j = 0; j < 20; j++) {
        while (true) {
            let num = Math.floor(Math.random() * 10000000000000000000) + 1
            if (!usedNum.includes(num)) {
                nums.push(num)
                break
            }
        }
    }

    white['bishop'] = nums[0]
    white['knight'] = nums[1]
    white['rook'] = nums[2]
    white['queen'] = nums[3]
    white['king'] = nums[4]
    white['pawn'] = nums[5]
    white['rook moved'] = nums[6]
    white['pawn moved'] = nums[7]
    white['pawn en passant'] = nums[18]
    white['king moved'] = nums[8]
    
    black['bishop'] = nums[9]
    black['knight'] = nums[10]
    black['rook'] = nums[11]
    black['queen'] = nums[12]
    black['king'] = nums[13]
    black['pawn'] = nums[14]
    black['rook moved'] = nums[15]
    black['pawn moved'] = nums[16]
    black['pawn en passant'] = nums[19]
    black['king moved'] = nums[17]

    array['white'] = white
    array['black'] = black

    generatedNums.push(array)
}

console.log(generatedNums)
}

export function findingHash(board, turnNum, team) {
    let willXor = []
    for (let i = 0; i < 64; i++) {
        

        if (board[i] != 'em') {
            if (board[i].piece === 'pawn') {
                if (!board[i].moved) {
                    willXor.push(generatedNums[i][board[i].team]['pawn'])
                } 
                else if (board[i].moved && board[i].doublejumped != turnNum - 1) {
                    willXor.push(generatedNums[i][board[i].team]['pawn moved'])
                } else {
                    if (board[i].doublejumped === turnNum - 1) {
                        willXor.push(generatedNums[i][board[i].team]['pawn en passant'])
                    }
                }
            }

            else if (board[i].piece === 'king' || board[i].piece === 'rook') {
                if (!board[i].moved) {
                    willXor.push(generatedNums[i][board[i].team][board[i].piece])
                } else {
                    willXor.push(generatedNums[i][board[i].team][board[i].piece + ' moved'])
                }
            }

            else {
                willXor.push(generatedNums[i][board[i].team][board[i].piece])
            }
        }
    }

    let result = willXor[0]

    for (let i = 1; i < willXor.length; i++) {
        result = result ^ willXor[i]
    }

    if (team === 'white') {
        result = result^whiteTeam
    } else {
        result = result^blackTeam
    }

    return result 
}
