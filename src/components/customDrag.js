import { useDragLayer } from 'react-dnd';
import './chessPiece.css';


const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
  };

function getItemStyles(currentOffset) {
  if (!currentOffset) {
    return {
      display: "none"
    };
  }
  let { x, y } = currentOffset;

  const transform = `translate(${x - 50}px, ${y - 50}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

export const CustomDragLayer = (props) => {
  const {
    item,
    isDragging,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item : monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  /*
  function renderItem() {
    switch (itemType) {
      case "chessPiece":
        return (
            <div style = {{width:"100px", height:"20px", backgroundColor:"red"}}>
            </div>
        );
      default:
        return null;
    }
  }
  */

  if (!isDragging) {
    return null;
  }

  let imgRef = item.team + item.piece + ".png";

  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(currentOffset)}
      >
            <img src = {`/images/${imgRef}`} className = "chessPiece" style = {{width:"100px"}}/>
      </div>
    </div>
  );
};

