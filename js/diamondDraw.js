import { state } from "./state.js";
import { enableDrag } from "./drag.js";
import { selectObject } from "./selection.js";
import { renderToolbar } from "./toolbar.js";
import { clamp } from "./bounds.js"; // 👈 Import clamp

let ghost = null;
let startX = 0;
let startY = 0;
let workspaceRef = null; // Store reference

export function initDiamondDraw(workspace) {
  workspaceRef = workspace;

  // MouseDown stays on workspace
  workspace.addEventListener("mousedown", onMouseDown);

  // Move/Up go to window to handle "leaving" the area
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e) {
  if (state.activeTool !== "diamond") return;
  if (state.isResizing || state.isRotating) return;
  if (e.target.closest(".handle") || e.target.closest(".rotate-handle")) return;
  if (e.button !== 0) return;

  state.isDrawing = true;

  // 1. Calculate Start relative to Workspace (More robust than offsetX)
  const rect = workspaceRef.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;

  ghost = document.createElement("div");
  ghost.className = "canvas-object ghost diamond";
  ghost.style.left = startX + "px";
  ghost.style.top = startY + "px";
  ghost.style.width = "0px";
  ghost.style.height = "0px";
  ghost.style.transform = "rotate(45deg)";
  ghost.dataset.rotation = "45";

  workspaceRef.appendChild(ghost);
}

function onMouseMove(e) {
  if (!state.isDrawing || !ghost) return;

  const rect = workspaceRef.getBoundingClientRect();

  // 2. Calculate Current Mouse Position relative to Workspace
  let currX = e.clientX - rect.left;
  let currY = e.clientY - rect.top;

  // 3. 🔒 CLAMP to Workspace Bounds (Prevents leaving)
  currX = clamp(currX, 0, rect.width);
  currY = clamp(currY, 0, rect.height);

  // 4. Standard Draw Logic
  const x = Math.min(startX, currX);
  const y = Math.min(startY, currY);
  const w = Math.abs(currX - startX);
  const h = Math.abs(currY - startY);

  ghost.style.left = x + "px";
  ghost.style.top = y + "px";
  ghost.style.width = w + "px";
  ghost.style.height = h + "px";
}

function onMouseUp(e) {
  if (!state.isDrawing || !ghost) return;

  ghost.classList.remove("ghost");

  // Apply default styles (White border fix)
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
