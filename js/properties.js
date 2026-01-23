import { state } from "./state.js";
import { selectObject } from "./selection.js";

/* ===============================
   INIT
================================ */

export function initPropertiesPanel() {
  initColorSwatches();
  bindColorSwatches();
  bindOpacity();
  bindStrokeWidth();
}

/* ===============================
   INITIAL SETUP
================================ */

function initColorSwatches() {
  document.querySelectorAll(".color").forEach((el) => {
    const color = el.dataset.color;
    if (color) {
      el.style.setProperty("--color", color);
    }
  });
}

/* ===============================
   COLOR BINDINGS
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
   OPACITY BINDING
================================ */

function bindOpacity() {
  const opacityInput = document.querySelector(
    '.panel-section[data-prop="opacity"] input[type="range"]',
  );

  if (!opacityInput) return;

  // set initial UI value from state
  opacityInput.value = Math.round(state.style.opacity * 100);

  opacityInput.addEventListener("input", () => {
    const value = Number(opacityInput.value) / 100;

    // save default opacity
    state.style.opacity = value;

    const el = state.selectedElement;
    if (!el) return;

    el.style.opacity = value;

    // keep overlay in sync
    selectObject(el, true);
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
  state.style[prop] = value;

  const el = state.selectedElement;
  if (!el) return;

  switch (prop) {
    case "stroke":
      el.style.border = `2px solid ${value}`;
      break;

    case "fill":
      el.style.background = value;
      break;
  }

  selectObject(el, true);
}

/* ===============================
   STOCK
================================ */
function bindStrokeWidth() {
  const section = document.querySelector(
    '.panel-section[data-prop="stroke-width"]',
  );

  if (!section) return;

  section.addEventListener("click", (e) => {
    const btn = e.target.closest(".icon-btn");
    if (!btn) return;

    const value = Number(btn.dataset.value);
    if (!value) return;

    // UI active state
    section
      .querySelectorAll(".icon-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    applyStrokeWidth(value);
  });
}

function applyStrokeWidth(width) {
  // store default
  state.style.strokeWidth = width;

  const el = state.selectedElement;
  if (!el) return;

  // apply safely
  el.style.borderWidth = `${width}px`;

  // keep overlay in sync
  selectObject(el, true);
}
