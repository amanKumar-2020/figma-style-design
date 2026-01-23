import { state } from "./state.js";
import { clearSelection } from "./selection.js";
import { renderLayers } from "./layers.js";

export function initEraser(workspace) {
  workspace.addEventListener("click", onEraserClick, true); // capture
}

function onEraserClick(e) {
  if (state.activeTool !== "eraser") return;

  const target = e.target;

  // 🔥 stop everything else
  e.preventDefault();
  e.stopPropagation();

  // erase only real objects
  if (
    target.classList?.contains("canvas-object") ||
    target instanceof SVGElement
  ) {
    target.remove();
    state.objects = state.objects.filter((o) => o !== target);

    if (state.selectedElement === target) {
      clearSelection();
    }

    renderLayers();
  }
}
