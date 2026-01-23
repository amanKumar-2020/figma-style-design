import { state } from "./state.js";
import { enableDrag } from "./drag.js";
import { enableResize } from "./resize.js";
import { enableRotate } from "./rotate.js";
import { selectObject } from "./selection.js";
import { renderToolbar } from "./toolbar.js";

let ghost = null;
let startX = 0;
let startY = 0;

export function initRectangleDraw(workspace) {
  workspace.addEventListener("mousedown", onMouseDown);
  workspace.addEventListener("mousemove", onMouseMove);
  workspace.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e) {
  if (state.activeTool !== "rect") return;
  if (state.isResizing || state.isRotating) return;

  if (e.target.closest(".handle") || e.target.closest(".rotate-handle")) return;

  if (e.button !== 0) return;

  state.isDrawing = true;

  startX = e.offsetX;
  startY = e.offsetY;

  ghost = document.createElement("div");
  ghost.className = "canvas-object ghost";
  ghost.style.left = startX + "px";
  ghost.style.top = startY + "px";
  ghost.style.width = "0px";
  ghost.style.height = "0px";

  workspace.appendChild(ghost);
}

function onMouseMove(e) {
  console.log("active tool:", state.activeTool);
  if (!state.isDrawing || !ghost) return;

  const x = Math.min(startX, e.offsetX);
  const y = Math.min(startY, e.offsetY);
  const w = Math.abs(e.offsetX - startX);
  const h = Math.abs(e.offsetY - startY);

  ghost.style.left = x + "px";
  ghost.style.top = y + "px";
  ghost.style.width = w + "px";  
  ghost.style.height = h + "px";
}

function onMouseUp(e) {
  if (!state.isDrawing || !ghost) return;

  ghost.classList.remove("ghost");

  enableDrag(ghost);

  state.objects.push(ghost);

  ghost.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(ghost);
  });

  //  IMPORTANT: mark drawing finished BEFORE selecting
  state.isDrawing = false;
  state.activeTool = "select";
  renderToolbar(); //  sync UI
  //  AUTO-SELECT AFTER DRAW
  selectObject(ghost ,true);

  ghost = null;
}

