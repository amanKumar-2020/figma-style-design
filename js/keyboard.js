import { state } from "./state.js";
import { clearSelection, selectObject } from "./selection.js";
import { renderLayers } from "./layers.js";
import { clamp } from "./bounds.js";
import { saveProject } from "./storage.js";

const MOVE_STEP = 5; // pixels per key press

export function initKeyboard() {
  window.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(e) {
  // 1. Guard: If no element is selected, do nothing
  const el = state.selectedElement;
  if (!el) return;

  // 2. Guard: If user is typing in the properties panel (Input fields), ignore keys
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

  const key = e.key;

  // --- DELETE FUNCTIONALITY ---
  if (key === "Delete" || key === "Backspace") {
    e.preventDefault();
    deleteSelectedElement(el);
    return;
  }

  // --- MOVEMENT FUNCTIONALITY ---
  if (key.startsWith("Arrow")) {
    e.preventDefault();
    moveSelectedElement(el, key);
  }
}

function deleteSelectedElement(el) {
  // 1. Remove from DOM
  el.remove();

  // 2. Remove from State Array
  state.objects = state.objects.filter((obj) => obj !== el);

  // 3. Clear Selection Overlay & Update UI
  clearSelection();
  renderLayers();

  // 4. Save Changes
  saveProject();
  console.log("🗑️ Element deleted via keyboard");
}

function moveSelectedElement(el, key) {
  const workspace = el.offsetParent;
  if (!workspace) return;

  // 1. Get current position relative to workspace
  const rect = el.getBoundingClientRect();
  const parentRect = workspace.getBoundingClientRect();

  let currentLeft = rect.left - parentRect.left;
  let currentTop = rect.top - parentRect.top;

  // 2. Determine limits (Canvas Boundaries)
  // Max allowed position is Workspace Size minus Object Size
  const maxLeft = workspace.clientWidth - el.offsetWidth;
  const maxTop = workspace.clientHeight - el.offsetHeight;

  // 3. Apply Movement
  switch (key) {
    case "ArrowUp":
      currentTop -= MOVE_STEP;
      break;
    case "ArrowDown":
      currentTop += MOVE_STEP;
      break;
    case "ArrowLeft":
      currentLeft -= MOVE_STEP;
      break;
    case "ArrowRight":
      currentLeft += MOVE_STEP;
      break;
  }

  // 4. Clamp to boundaries
  // This ensures the object never leaves the visible canvas
  const newLeft = clamp(currentLeft, 0, maxLeft);
  const newTop = clamp(currentTop, 0, maxTop);

  // 5. Update DOM
  el.style.left = newLeft + "px";
  el.style.top = newTop + "px";

  // 6. Sync Overlay (Moves the blue selection box with the object)
  selectObject(el, true);

  // Note: We don't need to call saveProject() here because
  // your main.js already has a 'keyup' listener that triggers auto-save.
}
