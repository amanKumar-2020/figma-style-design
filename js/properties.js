import { state } from "./state.js";
import { selectObject } from "./selection.js";

/* ===============================
   INIT
================================ */

export function initPropertiesPanel() {
  initColorSwatches();
  bindColorSwatches();
}

/* ===============================
   INITIAL SETUP
================================ */

function initColorSwatches() {
  // ensure UI colors are visible (CSS uses --color)
  document.querySelectorAll(".color").forEach((el) => {
    const color = el.dataset.color;
    if (color) {
      el.style.setProperty("--color", color);
    }
  });
}

/* ===============================
   EVENT BINDINGS
================================ */

function bindColorSwatches() {
  document.querySelectorAll(".panel-section[data-prop]").forEach((section) => {
    const prop = section.dataset.prop;

    section.addEventListener("click", (e) => {
      const swatch = e.target.closest(".color");
      if (!swatch) return;

      const value = swatch.dataset.color;
      if (value == null) return;

      setActiveSwatch(section, swatch);
      applyProperty(prop, value);
    });
  });
}

/* ===============================
   UI HELPERS
================================ */

function setActiveSwatch(section, activeEl) {
  section.querySelectorAll(".color").forEach((el) => {
    el.classList.remove("active");
  });
  activeEl.classList.add("active");
}

/* ===============================
   PROPERTY APPLICATION
================================ */

function applyProperty(prop, value) {
  // store as default style for new objects
  state.style[prop] = value;

  const el = state.selectedElement;
  if (!el) return;

  switch (prop) {
    case "stroke":
      // always apply full border (not just color)
      el.style.border = `2px solid ${value}`;
      break;

    case "fill":
      el.style.background = value;
      break;

    default:
      // future props: stroke-width, opacity, dash, etc.
      break;
  }

  // re-sync selection overlay safely
  selectObject(el, true);
}
