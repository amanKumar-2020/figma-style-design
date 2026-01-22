import { state } from "./state.js";
import { syncPanel, showPanel, hidePanel } from "./panel.js";
import { renderLayers } from "./layers.js";

export function selectObject(el) {
  state.selectedElement = el;

  const overlay = document.getElementById("selection-overlay");
  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent.getBoundingClientRect();

  overlay.style.left = rect.left - parentRect.left + "px";
  overlay.style.top = rect.top - parentRect.top + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";

  overlay.style.transform = el.style.transform;

  overlay.classList.remove("hidden");

  showPanel();
  syncPanel();
  renderLayers();
}

export function clearSelection() {
  state.selectedElement = null;
  document.getElementById("selection-overlay").classList.add("hidden");
  hidePanel();
  renderLayers();
}
