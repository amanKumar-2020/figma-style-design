import { renderToolbar } from "./toolbar.js";
import { showPropertiesPanel } from "./panel.js";
import { selectObject, clearSelection } from "./selection.js";
import { enableDrag } from "./drag.js";
import { enableResize } from "./resize.js";
import { enableRotate } from "./rotate.js";


function load(id, file) {
  fetch(file)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load ${file}`);
      }
      return res.text();
    })
    .then((html) => {
      const container = document.getElementById(id);
      if (!container) {
        throw new Error(`Element with id "${id}" not found`);
      }
      container.innerHTML = html;
    })
    .catch((err) => {
      console.error(err.message);
    });
}

// load("toolbar", "components/toolbar.html");
load("sidebar-left", "components/sidebar-left.html");
load("sidebar-right", "components/sidebar-right.html");


fetch("components/toolbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("app-toolbar").innerHTML = html;
    renderToolbar();
  });



  /* TEMP: simulate object selection */
  document.getElementById("workspace").addEventListener("click", () => {
    showPropertiesPanel();
  });


  
  // TEMP UI DEMO)
  const demo = document.getElementById("demo-object");
  const workspace = document.getElementById("workspace");

  demo.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(demo);
  });

  workspace.addEventListener("click", () => {
    clearSelection();
  });

  // // drag Object
  /* selection */
  demo.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(demo);
  });

  /* drag */
  enableDrag(demo);

  /* deselect */
  workspace.addEventListener("click", () => {
    clearSelection();
  });


  // Resize Object

  /* selection */
  demo.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(demo);
  });

  /* drag + resize */
  enableDrag(demo);
  enableResize(demo);

  /* deselect */
  workspace.addEventListener("click", () => {
    clearSelection();
  });

// Rotation

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
