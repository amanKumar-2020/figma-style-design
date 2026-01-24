import { renderToolbar } from "./toolbar.js";
import { selectObject, clearSelection } from "./selection.js";
import { enableDrag } from "./drag.js";
import { enableRotate } from "./rotate.js";
import { initPanel } from "./panel.js";
import { createObject } from "./objects.js";
import { renderLayers, moveLayer } from "./layers.js";
import { initRectangleDraw } from "./rectangleDraw.js";
import { state } from "./state.js";
import { enableResize } from "./resize.js";
import { initCircleDraw } from "./circleDraw.js";
import { initLineDraw } from "./lineDraw.js";
import { initArrowDraw } from "./arrowDraw.js";
import { initEraser } from "./eraser.js";
import { initPropertiesPanel } from "./properties.js";
import { initDiamondDraw } from "./diamondDraw.js";
import { exportToJSON, exportToHTML } from "./export.js";
import { initKeyboard } from "./keyboard.js";

// ✅ IMPORT STORAGE
import { saveProject, loadProject } from "./storage.js";

enableRotate();
enableResize();

/* ---------- load helpers ---------- */
function load(id, file, callback) {
  fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    })
    .then((html) => {
      const container = document.getElementById(id);
      if (!container) throw new Error(`Element with id "${id}" not found`);
      container.innerHTML = html;

      if (callback) callback();
    })
    .catch((err) => console.error(err.message));
}

//  ---------- toolbar ----------
fetch("components/toolbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("app-toolbar").innerHTML = html;
    renderToolbar();
  });

/* ---------- workspace init ---------- */
const workspace = document.getElementById("workspace");

// ✅ LOAD DATA ON START
window.addEventListener("DOMContentLoaded", () => {
  loadProject();
});

window.addEventListener("mouseup", () => setTimeout(saveProject, 100));
window.addEventListener("keyup", () => setTimeout(saveProject, 100));

/* ---------- Interaction Logic ---------- */
workspace.addEventListener("click", (e) => {
  if (state.isDrawing) return;
  if (state.isRotating || state.isResizing) return;
  if (e.target !== workspace) return;

  clearSelection();
});

/* after sidebar loads */
load("sidebar-left", "components/sidebar-left.html", () => {
  initPropertiesPanel();
});

load("sidebar-right", "components/sidebar-right.html", () => {
  initPanel();
  load("layers-container", "components/layers.html", renderLayers);
});

document.addEventListener("click", (e) => {
  if (e.target.id === "layer-up") moveLayer("up");
  if (e.target.id === "layer-down") moveLayer("down");
});


// Init Export Buttons (Quick UI)
function initExportUI() {
    const container = document.createElement("div");
    Object.assign(container.style, {
        position: "fixed",
        bottom: "10px",
        left: "10px",
        display: "flex",
        gap: "8px",
        zIndex: "9999"
    });

    const btnJson = createBtn("📥 Export JSON", "#339af0");
    btnJson.onclick = exportToJSON;

    const btnHtml = createBtn("🌐 Export HTML", "#f06595");
    btnHtml.onclick = exportToHTML;

    container.appendChild(btnJson);
    container.appendChild(btnHtml);
    document.body.appendChild(container);
}

function createBtn(text, color) {
    const btn = document.createElement("button");
    btn.textContent = text;
    Object.assign(btn.style, {
        padding: "8px 12px",
        background: color,
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontWeight: "bold"
    });
    return btn;
}


// Init Tools
initRectangleDraw(workspace);
initCircleDraw(workspace);
initLineDraw(workspace);
initArrowDraw(workspace);
initEraser(workspace);
initDiamondDraw(workspace);
initExportUI();
initKeyboard();