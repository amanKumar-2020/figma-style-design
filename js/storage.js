import { state } from "./state.js";
import { enableDrag } from "./drag.js";
import { selectObject } from "./selection.js";
import { renderLayers } from "./layers.js";

const STORAGE_KEY = "canvas_project_v1";
const WORKSPACE_ID = "workspace";

/**
 * Saves the current state.objects to localStorage
 */
export function saveProject() {
  const serializedObjects = state.objects.map((el) => {
    // 1. Determine Type
    let type = "rect";
    if (el.classList.contains("circle")) type = "circle";
    else if (el.classList.contains("line")) type = "line";
    else if (el.classList.contains("arrow")) type = "arrow";
    // Note: Rectangle has no specific class in your code, so it defaults to "rect"

    // 2. Extract Styles
    const styles = {
      stroke: el.style.borderColor || "transparent",
      strokeWidth: parseFloat(el.style.borderWidth) || 0,
      strokeStyle: el.style.borderStyle || "solid",
      fill: el.style.backgroundColor || "transparent",
      opacity: el.style.opacity ? parseFloat(el.style.opacity) : 1,
    };

    // 3. Extract Rotation
    // Your rotate.js saves rotation to dataset, which is reliable
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

  const data = {
    objects: serializedObjects,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // console.log("💾 Saved", data); // Uncomment for debugging
}

/**
 * Loads data from localStorage and rebuilds the DOM
 */
/**
 * Loads data from localStorage and rebuilds the DOM elements.
 */
export function loadProject() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;

  const data = JSON.parse(json);
  const workspace = document.getElementById(WORKSPACE_ID);

  // 1. Cleanup: Remove existing canvas objects
  const existingObjects = workspace.querySelectorAll(".canvas-object:not(.ghost)");
  existingObjects.forEach((el) => el.remove());
  state.objects = []; 

  // 2. Reconstruct objects
  data.objects.forEach((objData) => {
    const el = document.createElement("div");
    
    // Basic Classes
    el.className = "canvas-object";
    if (objData.type && objData.type !== "rect") {
        el.classList.add(objData.type);
    }

    // ID
    el.dataset.id = objData.id;

    // Position & Size
    el.style.left = objData.x + "px";
    el.style.top = objData.y + "px";
    el.style.width = objData.width + "px";
    el.style.height = objData.height + "px";
    el.style.zIndex = objData.zIndex;

    // Rotation
    if (objData.rotation) {
      el.dataset.rotation = objData.rotation;
      el.style.transform = `rotate(${objData.rotation}deg)`;
    }

    // Styles
    if (objData.styles) {
      el.style.backgroundColor = objData.styles.fill || "transparent";
      el.style.borderColor = objData.styles.stroke || "transparent";
      el.style.borderWidth = (objData.styles.strokeWidth || 0) + "px";
      el.style.borderStyle = objData.styles.strokeStyle || "solid";
      el.style.opacity = objData.styles.opacity;
    }

    // 1. Check if background is transparent
    const isBgTransparent = !el.style.backgroundColor || 
                            el.style.backgroundColor === "transparent" || 
                            el.style.backgroundColor === "rgba(0, 0, 0, 0)";

    // 2. Check if border is invisible (width 0 or transparent)
    const isBorderInvisible = !el.style.borderColor || 
                              el.style.borderColor === "transparent" || 
                              parseFloat(el.style.borderWidth) === 0;

    // 3. If BOTH are invisible, force a white border
    if (isBgTransparent && isBorderInvisible) {
        el.style.border = "2px solid #ffffff";
    }
    // ---------------------------------

    // Specific Fixes for shapes
    if (objData.type === 'circle') {
        el.style.borderRadius = "50%";
    }

    // 3. Re-attach Interactivity
    enableDrag(el);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectObject(el);
    });

    // 4. Add to DOM and State
    workspace.appendChild(el);
    state.objects.push(el);
  });

  // Update Layers
  renderLayers();
  console.log("📂 Project Loaded with visibility fix");
}