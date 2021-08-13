import React from 'react';
import { useDrop } from 'react-dnd';


export function Square({props, children}){
    let row = props.row;
    let col = props.col;
    //console.log(props);
    const fill = (row + (col % 2)) % 2 == 1 ? 'rgb(161, 111, 90)' : 'rgb(236, 221, 195)';

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
            width: '100px',
            height: '100px'
        }}
        ref={drop}
        >
        {children}
        </div>
    );
}