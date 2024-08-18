import { createContext } from "react";
import { TOOL_ACTION_TYPES } from "../constants";

const boardContext = createContext({
  activeToolItem: "",
  toolActionType: TOOL_ACTION_TYPES.NONE,
  history: [[]],
  index: 0,
  elements: [],
  boardMouseDownHandler: () => {},
  changeToolHandler: () => {},
  boardMouseMoveHandler: () => {},
  boardMouseUpHandler:() =>{},
});

export default boardContext;