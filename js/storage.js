import { state } from "./state.js";
import { enableDrag } from "./drag.js";
import { selectObject } from "./selection.js";
import { renderLayers } from "./layers.js";

const STORAGE_KEY = "canvas_project_v1";
const WORKSPACE_ID = "workspace";

/**
 * HELPER: serialized state.objects into JSON-ready format.
 * We export this so the Export module can use it too!
 */
export function getSerializedData() {
  const serializedObjects = state.objects.map((el) => {
    // 1. Determine Type
    let type = "rect";
    if (el.classList.contains("circle")) type = "circle";
    else if (el.classList.contains("line")) type = "line";
    else if (el.classList.contains("arrow")) type = "arrow";
    else if (el.classList.contains("diamond")) type = "diamond";

    // 2. Extract Styles
    const styles = {
      stroke: el.style.borderColor || "transparent",
      strokeWidth: parseFloat(el.style.borderWidth) || 0,
      strokeStyle: el.style.borderStyle || "solid",
      fill: el.style.backgroundColor || "transparent",
      opacity: el.style.opacity ? parseFloat(el.style.opacity) : 1,
    };

    // 3. Extract Rotation
    const rotation = parseFloat(el.dataset.rotation) || 0;

    return {
      id: el.dataset.id || `obj-${Date.now()}-${Math.random()}`,
      type: type,
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top) || 0,
      width: parseFloat(el.style.width) || 0,
      height: parseFloat(el.style.height) || 0,
      rotation: rotation,
      zIndex: parseInt(el.style.zIndex) || 1,
      styles: styles,
    };
  });

  return { objects: serializedObjects };
}

/**
 * Saves to LocalStorage (Auto-save)
 */
export function saveProject() {
  const data = getSerializedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Loads from LocalStorage
 */
export function loadProject() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;

  const data = JSON.parse(json);
  const workspace = document.getElementById(WORKSPACE_ID);

  // Clear existing
  const existingObjects = workspace.querySelectorAll(
    ".canvas-object:not(.ghost)",
  );
  existingObjects.forEach((el) => el.remove());
  state.objects = [];

  // Rebuild
  data.objects.forEach((objData) => {
    const el = document.createElement("div");
    el.className = "canvas-object";
    if (objData.type !== "rect") el.classList.add(objData.type);

    el.dataset.id = objData.id;
    el.style.left = objData.x + "px";
    el.style.top = objData.y + "px";
    el.style.width = objData.width + "px";
    el.style.height = objData.height + "px";
    el.style.zIndex = objData.zIndex;

    if (objData.rotation) {
      el.dataset.rotation = objData.rotation;
      el.style.transform = `rotate(${objData.rotation}deg)`;
    }

    if (objData.styles) {
      el.style.backgroundColor = objData.styles.fill || "transparent";
      el.style.borderColor = objData.styles.stroke || "transparent";
      el.style.borderWidth = (objData.styles.strokeWidth || 0) + "px";
      el.style.borderStyle = objData.styles.strokeStyle || "solid";
      el.style.opacity = objData.styles.opacity;
    }

    // Visibility Fix (from previous step)
    const isBgTransparent =
      !el.style.backgroundColor ||
      el.style.backgroundColor === "transparent" ||
      el.style.backgroundColor === "rgba(0,0,0,0)";
    const isBorderInvisible =
      !el.style.borderColor ||
      el.style.borderColor === "transparent" ||
      parseFloat(el.style.borderWidth) === 0;

    if (isBgTransparent && isBorderInvisible) {
      el.style.border = "2px solid #ffffff";
    }

    if (objData.type === "circle") el.style.borderRadius = "50%";

    enableDrag(el);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectObject(el);
    });

    workspace.appendChild(el);
    state.objects.push(el);
  });

  renderLayers();
  console.log("📂 Project Loaded");
}
