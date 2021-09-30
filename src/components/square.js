import React from 'react';
import { useDrop } from 'react-dnd';


export function Square({props, children}){
    let row = props.row;
    let col = props.col;
    //console.log(props);
    let fill = (row + (col % 2)) % 2 == 1 ? 'rgb(161, 111, 90)' : 'rgb(236, 221, 195)';
    let type = (row + (col % 2)) % 2 == 1 ? "dark" : "light";
    if(props.highlight) fill = type === "dark" ? "rgb(90, 156, 161)" : "rgb(195, 236, 236)";
    if(props.checkHighlight) fill = type === "dark" ? "rgb(178, 71, 71)" : "rgb(243, 178, 154)";

    const [collectedProps, drop] = useDrop(() => ({
        accept:"chessPiece",
        drop:(item) => {
            props.board.movePiece(item.pos, row * 8 + col);
        }
    }))

    return(
        <div
        style={{
            backgroundColor: fill,
            width: 'min(11vh, 11vw)',
            height: 'min(11vh, 11vw)'
        }}
        ref={drop}
        >
        {children}
        </div>
    );
}