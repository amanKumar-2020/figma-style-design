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
  bindStrokeStyle();
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
  // 1. Update Global State
  state.style.strokeWidth = width;

  const el = state.selectedElement;
  if (!el) return;

  // 2. Apply Width
  el.style.borderWidth = `${width}px`;

  // --- 🟢 NEW LOGIC: Auto-assign White if transparent ---
  const currentColor = el.style.borderColor;
  
  // Check if color is missing, transparent, or rgba(0,0,0,0)
  const isInvisible = !currentColor || 
                      currentColor === "transparent" || 
                      currentColor === "rgba(0, 0, 0, 0)";

  if (isInvisible) {
    // Force White Color
    el.style.borderColor = "#ffffff";
    state.style.stroke = "#ffffff"; // Sync global state

    // Ensure style is solid (in case it was 'none')
    if (!el.style.borderStyle || el.style.borderStyle === "none") {
        el.style.borderStyle = "solid";
        state.style.strokeStyle = "solid";
    }
  }


  // 3. Refresh Selection & UI (This will update the color swatches too)
  selectObject(el, true);
}

function bindStrokeStyle() {
  const section = document.querySelector(
    '.panel-section[data-prop="stroke-style"]',
  );

  if (!section) return;

  section.addEventListener("click", (e) => {
    const btn = e.target.closest(".icon-btn");
    if (!btn) return;

    const value = btn.dataset.value;
    if (!value) return;

    // UI active state
    section
      .querySelectorAll(".icon-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    applyStrokeStyle(value);
  });
}

function applyStrokeStyle(style) {
  // save default
  state.style.strokeStyle = style;

  const el = state.selectedElement;
  if (!el) return;

  switch (style) {
    case "dotted":
      el.style.borderStyle = "dotted";
      break;

    case "dashed":
      el.style.borderStyle = "dashed";
      break;

    default:
      el.style.borderStyle = "solid";
      break;
  }

  // keep overlay in sync
  selectObject(el, true);
}
