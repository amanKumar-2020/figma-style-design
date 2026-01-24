export const state = {
  activeTool: "select",

  selectedElement: null,
  objects: [],

  // interaction flags
  isDrawing: false,
  isResizing: false,
  isRotating: false,
  isErasing: false,

  style: {
    stroke: "#ffffff", // Changed from green to White
    fill: "transparent",
    opacity: 1,
    strokeWidth: 2,
    strokeStyle: "solid",
  },
};
