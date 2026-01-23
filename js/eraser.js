import { state } from "./state.js";
import { clearSelection } from "./selection.js";
import { renderLayers } from "./layers.js";

export function initEraser(workspace) {
  workspace.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e) {
  if (state.activeTool !== "eraser") return;
  if (e.button !== 0) return;

  state.isErasing = true;

  // prevent selection / drag
  e.preventDefault();
  e.stopPropagation();

  eraseAtPoint(e.clientX, e.clientY);
}

function onMouseMove(e) {
  if (!state.isErasing) return;

  eraseAtPoint(e.clientX, e.clientY);
}

function onMouseUp() {
  if (!state.isErasing) return;

  state.isErasing = false;
}

function eraseAtPoint(x, y) {
  const elements = document.elementsFromPoint(x, y);

  for (const el of elements) {
    if (el.classList?.contains("canvas-object") || el instanceof SVGElement) {
      // remove element
      el.remove();

      state.objects = state.objects.filter((o) => o !== el);

      if (state.selectedElement === el) {
        clearSelection();
      }

      renderLayers();

      break; // erase ONE per frame (important)
    }
  }
}
