import React from 'react';
import { useDrop } from 'react-dnd';


export function Square({props, children}){
    let row = props.row;
    let col = props.col;
    //console.log(props);
    const fill = (row + (col % 2)) % 2 == 0 ? 'rgb(161, 111, 90)' : 'rgb(236, 221, 195)';

    const [collectedProps, drop] = useDrop(() => ({
        accept:"chessPiece",
        drop:(item) => {
            let fakeBoard = props.board.state.board;
            let pieceMove = fakeBoard[item.pos];
            console.log(item.pos);
            console.log(row * 8 + col);

            fakeBoard[item.pos] = "em";
            fakeBoard[row * 8 + col] = pieceMove;

            props.board.setState({"board": fakeBoard});
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