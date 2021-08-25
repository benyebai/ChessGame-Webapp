import { generateAllLegal } from "../boardLogic/moveGenerator";

const queenVal = 90;
const bishopVal = 30;
const knightVal = 30;
const rookVal = 50;
const pawnVal = 10;


// this basic idea is from here https://www.youtube.com/watch?v=U4ogK0MIzqk
//great video from sebastian lague talking about making a chess ai
// recursive function, depth first search going like a depth of 3 or 4 on all possible moves
//the value of the move is based on piece value
//go on enemys best move on your move and stuff
//ive got no idea how to explain in text form but heres a timestamp of a good explanation https://youtu.be/U4ogK0MIzqk?t=819
function decideBestAiMove(board, team, turnNum){

}