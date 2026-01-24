import { state } from "./state.js";
import { enableDrag } from "./drag.js";
import { selectObject } from "./selection.js";
import { renderToolbar } from "./toolbar.js";

let ghost = null;
let startX = 0;
let startY = 0;

export function initLineDraw(workspace) {
  workspace.addEventListener("mousedown", onMouseDown);
  workspace.addEventListener("mousemove", onMouseMove);
  workspace.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e) {
  if (state.activeTool !== "line") return;
  if (state.isDrawing || state.isResizing || state.isRotating) return;
  if (e.button !== 0) return;

  state.isDrawing = true;

  startX = e.offsetX;
  startY = e.offsetY;

  ghost = document.createElement("div");
  ghost.className = "canvas-object ghost line";
  ghost.style.left = startX + "px";
  ghost.style.top = startY + "px";
  ghost.style.height = "2px";
  ghost.style.width = "0px";

  workspace.appendChild(ghost);
}

function onMouseMove(e) {
  if (!state.isDrawing || !ghost) return;

  const dx = e.offsetX - startX;
  const dy = e.offsetY - startY;

  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  ghost.style.width = length + "px";
  ghost.style.transform = `rotate(${angle}deg)`;
}

function onMouseUp() {
  if (!state.isDrawing || !ghost) return;

  ghost.classList.remove("ghost");

  ghost.style.backgroundColor = "#ffffff";

  enableDrag(ghost);
  state.objects.push(ghost);

  ghost.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(ghost);
  });

  state.isDrawing = false;
  state.activeTool = "select";
  renderToolbar();
  selectObject(ghost, true);

  ghost = null;
}
