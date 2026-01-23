import { state } from "./state.js";
import { syncPanel, showPanel, hidePanel } from "./panel.js";
import { renderLayers } from "./layers.js";

export function selectObject(el) {
  if (state.activeTool !== "select") return;
  if (!el || !el.isConnected) return;

  const overlay = document.getElementById("selection-overlay");
  if (!overlay) return;
  state.selectedElement = el;

  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent.getBoundingClientRect();

  overlay.style.left = rect.left - parentRect.left + "px";
  overlay.style.top = rect.top - parentRect.top + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";

  overlay.style.transform = el.style.transform;

  overlay.classList.remove("hidden");

  const opacityInput = document.querySelector(
    '.panel-section[data-prop="opacity"] input[type="range"]',
  );

  if (opacityInput && el.style.opacity !== "") {
    opacityInput.value = Math.round((parseFloat(el.style.opacity) || 1) * 100);
  }

  // sync stroke width UI
  const strokeSection = document.querySelector(
    '.panel-section[data-prop="stroke-width"]',
  );

  if (strokeSection) {
    const width =
      parseInt(state.selectedElement.style.borderWidth) ||
      state.style.strokeWidth;

    strokeSection.querySelectorAll(".icon-btn").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.value) === width);
    });
  }

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
