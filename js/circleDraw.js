import { state } from "./state.js";
import { enableDrag } from "./drag.js";
import { selectObject } from "./selection.js";
import { renderToolbar } from "./toolbar.js";

let ghost = null;
let startX = 0;
let startY = 0;

export function initCircleDraw(workspace) {
  workspace.addEventListener("mousedown", onMouseDown);
  workspace.addEventListener("mousemove", onMouseMove);
  workspace.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e) {
  if (state.activeTool !== "circle") return;
  if (state.isResizing || state.isRotating) return;
  if (e.button !== 0) return;

  state.isDrawing = true;

  startX = e.offsetX;
  startY = e.offsetY;

  ghost = document.createElement("div");
  ghost.className = "canvas-object ghost circle";
  ghost.style.left = startX + "px";
  ghost.style.top = startY + "px";
  ghost.style.width = "0px";
  ghost.style.height = "0px";
  ghost.style.borderRadius = "50%";

  workspace.appendChild(ghost);
}

function onMouseMove(e) {
  if (!state.isDrawing || !ghost) return;

  const dx = e.offsetX - startX;
  const dy = e.offsetY - startY;
  const size = Math.max(Math.abs(dx), Math.abs(dy));

  ghost.style.width = size + "px";
  ghost.style.height = size + "px";
  ghost.style.left = (dx < 0 ? startX - size : startX) + "px";
  ghost.style.top = (dy < 0 ? startY - size : startY) + "px";
}

function onMouseUp() {
  if (!state.isDrawing || !ghost) return;

  ghost.classList.remove("ghost");

  ghost.style.border = "2px solid #ffffff";
  ghost.style.backgroundColor = "transparent";

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
