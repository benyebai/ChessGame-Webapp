import React from 'react';
import "./chessPiece.css";
import { useDrag, useDrop } from 'react-dnd';

export function Knight({index}){

    const [collected, drag, dragPreview] = useDrag(() => ({
        type : "chessPiece",
        item: { pos:index }
      }))
    
    return(
        <div ref = {drag}>
            <img src = "/images/knight.png" className = "chessPiece"/>
        </div>
    );
}