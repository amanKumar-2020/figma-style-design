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

      if (callback) callback(); // ✅ DOM is ready here
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

/* ---------- editor demo object ---------- */
const workspace = document.getElementById("workspace");
initRectangleDraw(workspace);

workspace.addEventListener("click", (e) => {
  //  DO NOT clear selection right after drawing
  if (state.isDrawing) return;

  if (state.isRotating || state.isResizing) return;
  if (e.target !== workspace) return;

  clearSelection();
});


/* after sidebar loads */
load("sidebar-left", "components/sidebar-left.html");
load("sidebar-right", "components/sidebar-right.html", () => {
  initPanel();
  load("layers-container", "components/layers.html", renderLayers);
});

document.addEventListener("click", (e) => {
  if (e.target.id === "layer-up") moveLayer("up");
  if (e.target.id === "layer-down") moveLayer("down");
});

// Circle draw
initRectangleDraw(workspace);
initCircleDraw(workspace);

// line and arrow 

initRectangleDraw(workspace);
initCircleDraw(workspace);
initLineDraw(workspace);
initArrowDraw(workspace);

initEraser(workspace);


load("sidebar-left", "components/sidebar-left.html", () => {
  initPropertiesPanel();
});


document.addEventListener("click", (e) => {
  if (e.target.id === "layer-up") moveLayer("up");
  if (e.target.id === "layer-down") moveLayer("down");
});
