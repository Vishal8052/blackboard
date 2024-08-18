import React, { useContext, useLayoutEffect } from "react";
import { useEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import classes from "./index.module.css";

function Board() {
  const canvaRef = useRef();
  const textAreaRef = useRef();

  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
  } = useContext(boardContext);

  const { toolboxState } = useContext(toolboxContext);

  useEffect(() => {
    const canvas = canvaRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

   useEffect(() => {
    function handleKeyDown(event){
      if (event.ctrlKey && (event.key == "z" || event.key == "Z")) {
        undo();
      } else if (event.ctrlKey && (event.key == "y" || event.key == "Y")) {
        redo();
      }
    }
     document.addEventListener("keydown",handleKeyDown);
     return ()=>{
      document.removeEventListener("keydown",handleKeyDown);
     }
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvaRef.current;
    const context = canvas.getContext("2d");
    context.save();
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW: {
          roughCanvas.draw(element.roughEle);
          break;
        }

        case TOOL_ITEMS.BRUSH: {
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        }

        case TOOL_ITEMS.TEXT: {
           context.textBaseline = "top";
           context.font = `${element.size}px Caveat`;
           context.fillStyle = element.stroke;
           context.fillText(element.text, element.x1,element.y1);
          //  const textWidth = context.measureText(element.text).width;
          //  const textHeight = parseInt(element.size);
           context.restore();
          break;
        }

        default:
          throw new Error("Type not recognized!!");
      }
    });

    //cleanup function --clears the canvas
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = () => {
    boardMouseUpHandler();
  };

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvaRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
