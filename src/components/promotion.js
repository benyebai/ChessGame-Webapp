import React from 'react';
import "./promotion.css";
import { useDrag, DragPreviewImage } from 'react-dnd';

export function Promotion({whichWay, team, promoteFunc}){

    //whichway is the direction that the promotion selection pieces flows
    if(whichWay === "up"){
        return (
        <div style = {{position:"relative", display:"flex", flexDirection:"column", bottom:"300px"}}>
            <ChooseRook promoteFunc = {promoteFunc} team = {team}/>
            <ChooseBishop promoteFunc = {promoteFunc} team = {team}/>
            <ChooseKnight promoteFunc = {promoteFunc} team = {team}/>
            <ChooseQueen promoteFunc = {promoteFunc} team = {team}/>
        </div>
        );
    }
    else{
        return(
            <div style = {{position:"relative", display:"flex", flexDirection:"column"}}>
                <ChooseQueen promoteFunc = {promoteFunc} team = {team}/>
                <ChooseKnight promoteFunc = {promoteFunc} team = {team}/>
                <ChooseBishop promoteFunc = {promoteFunc} team = {team}/>
                <ChooseRook promoteFunc = {promoteFunc} team = {team}/>
            </div>
        );
    }
}

function ChooseQueen({promoteFunc, team}){
    return(
        <button onClick = {() => promoteFunc("queen")} className = "promotionButton" style = {{borderBottom:"0"}}>
            <img src = {`/images/${team}Queen.png`} style = {{width:"min(11vw, 11vh)"}} />
        </button>
    );
}
function ChooseKnight({promoteFunc, team}){
    return(
        <button onClick = {() => promoteFunc("knight")} className = "promotionButton" style = {{borderBottom:"0"}}>
            <img src = {`/images/${team}Knight.png`} style = {{width:"min(11vw, 11vh)"}} />
        </button>
    );
}
function ChooseBishop({promoteFunc, team}){
    return(
        <button onClick = {() => promoteFunc("bishop")} className = "promotionButton" style = {{borderBottom:"0"}}>
            <img src = {`/images/${team}Bishop.png`} style = {{width:"min(11vw, 11vh)"}} />
        </button>
    );
}
function ChooseRook({promoteFunc, team}){
    return(
        <button onClick = {() => promoteFunc("rook")} className = "promotionButton" >
            <img src = {`/images/${team}Rook.png`} style = {{width:"min(11vw, 11vh)"}} />
        </button>
    );
}
