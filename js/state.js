export const state = {
  activeTool: "select",

  selectedElement: null,
  objects: [],

  // interaction flags
  isDrawing: false,
  isResizing: false,
  isRotating: false,
  isErasing: false,

  // 🎨 DEFAULT STYLES
  style: {
    stroke: "#2ecc71", // green
    fill: "transparent",
  },
};
