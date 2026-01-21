import { renderToolbar } from "./toolbar.js";
import { showPropertiesPanel } from "./panel.js";


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
