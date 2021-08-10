import React from 'react';
import "./chessPiece.css";
import { useDrag, DragPreviewImage } from 'react-dnd';

export function Knight({index, team}){

    let imgRef = team + "Knight.png";

    const [collected, drag, preview] = useDrag(() => ({
        type : "chessPiece",
        item: { pos:index }
      }))
    
    return(
        <>
        <DragPreviewImage connect={preview} src = {`/images/${imgRef}`} />
        <div ref = {drag}>
            <img src = {`/images/${imgRef}`} className = "chessPiece" style = {{width:"100px", opacity:1}}/>
        </div>
        </>
    );
}