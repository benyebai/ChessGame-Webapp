import React from 'react';
import "./chessPiece.css";
import { useDrag, DragPreviewImage } from 'react-dnd';

export function Knight({index, team}){

    let imgRef = team + "Knight.png";

    const [{isDragging}, drag, preview] = useDrag(() => ({
        type : "chessPiece",
        item: { pos:index },
        collect: (monitor) => ({
            isDragging : !!monitor.isDragging()
        })
      }))
    
    return(
        <>
        <DragPreviewImage connect={preview} src = {`/images/${imgRef}`} />
        <div ref = {drag}>
            <img src = {`/images/${imgRef}`} className = "chessPiece" style = {{width:"100px", opacity: isDragging ? 0 : 1}}/>
        </div>
        </>
    );
}