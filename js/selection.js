import { state } from "./state.js";
import { syncPanel, showPanel, hidePanel } from "./panel.js";
import { renderLayers } from "./layers.js";
import { syncPropertiesPanel } from "./propertiesSync.js";

/* ===============================
   SELECT
================================ */

export function selectObject(el, force = false) {
  // tool guard (allow system-forced selection)
  if (!force && state.activeTool !== "select") return;
  if (!el || !el.isConnected) return;

  const overlay = document.getElementById("selection-overlay");
  if (!overlay) return;

  state.selectedElement = el;

  /* ---------- position overlay ---------- */
  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent.getBoundingClientRect();

  overlay.style.left = rect.left - parentRect.left + "px";
  overlay.style.top = rect.top - parentRect.top + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
  overlay.style.transform = el.style.transform || "";

  overlay.classList.remove("hidden");

  /* ---------- sync UI ---------- */
  syncPropertiesPanel(el); // 🔥 ONE unified call

  /* ---------- panels ---------- */
  showPanel();
  syncPanel();
  renderLayers();
}

/* ===============================
   CLEAR
================================ */

export function clearSelection() {
  state.selectedElement = null;

  const overlay = document.getElementById("selection-overlay");
  if (overlay) overlay.classList.add("hidden");

  hidePanel();
  renderLayers();
}
