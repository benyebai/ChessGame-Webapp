import React, { Children } from 'react'
import reactDom from 'react-dom'

export class Square extends React.Component{

  render(){
    //adds offset of 1 if row is not even, so row 1 3 5 7
    //this way it looks like a chessboard

    let black = "rgb(161, 111, 90)";
    let white = "rgb(246, 221, 195)";
    const fill = (this.props.col + (this.props.row % 2)) % 2 == 1 ? black : white;
    return (
      <div style={{ backgroundColor: fill, width:"100px", height:"100px" }}>
        {this.props.children}
      </div>
    );
  }

}