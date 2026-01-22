import { renderToolbar } from "./toolbar.js";
import { selectObject, clearSelection } from "./selection.js";
import { enableDrag } from "./drag.js";
import { enableResize } from "./resize.js";
import { enableRotate } from "./rotate.js";
import { initPanel } from "./panel.js";
import { createObject } from "./objects.js";
import { renderLayers, moveLayer } from "./layers.js";
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



/* ---------- load static UI ---------- */
load("sidebar-left", "components/sidebar-left.html");

load("sidebar-right", "components/sidebar-right.html", initPanel);

/* ---------- toolbar ---------- */
fetch("components/toolbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("app-toolbar").innerHTML = html;
    renderToolbar();
  });

/* ---------- editor demo object ---------- */
const demo = document.getElementById("demo-object");
const workspace = document.getElementById("workspace");

/* selection */
demo.addEventListener("click", (e) => {
  e.stopPropagation();
  selectObject(demo);
});

/* interactions */
enableDrag(demo);
enableResize(demo);
enableRotate(demo);

/* deselect */
workspace.addEventListener("click", () => {
  clearSelection();
});

/* after sidebar loads */
load("sidebar-left", "components/sidebar-left.html");
load("sidebar-right", "components/sidebar-right.html", () => {
  initPanel();
  load("layers-container", "components/layers.html", renderLayers);
});

/* demo objects */
createObject("Rect");
createObject("Rect");

/* layer buttons */
document.addEventListener("click", (e) => {
  if (e.target.id === "layer-up") moveLayer("up");
  if (e.target.id === "layer-down") moveLayer("down");
});
