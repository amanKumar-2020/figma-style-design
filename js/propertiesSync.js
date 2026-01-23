import { state } from "./state.js";

export function syncPropertiesPanel(el) {
  if (!el) return;

  syncStroke(el);
  syncFill(el);
  syncStrokeWidth(el);
  syncStrokeStyle(el);
  syncOpacity(el);
}

/* ===============================
   STROKE COLOR
================================ */

function syncStroke(el) {
  const section = document.querySelector('.panel-section[data-prop="stroke"]');
  if (!section) return;

  const color = el.style.borderColor || state.style.stroke;

  section.querySelectorAll(".color").forEach((swatch) => {
    swatch.classList.toggle("active", swatch.dataset.color === color);
  });
}

/* ===============================
   FILL / BACKGROUND
================================ */

function syncFill(el) {
  const section = document.querySelector('.panel-section[data-prop="fill"]');
  if (!section) return;

  const bg = el.style.background || state.style.fill;

  section.querySelectorAll(".color").forEach((swatch) => {
    swatch.classList.toggle("active", swatch.dataset.color === bg);
  });
}

/* ===============================
   STROKE WIDTH
================================ */

function syncStrokeWidth(el) {
  const section = document.querySelector(
    '.panel-section[data-prop="stroke-width"]',
  );
  if (!section) return;

  const width = parseInt(el.style.borderWidth) || state.style.strokeWidth;

  section.querySelectorAll(".icon-btn").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.value) === width);
  });
}

/* ===============================
   STROKE STYLE
================================ */

function syncStrokeStyle(el) {
  const section = document.querySelector(
    '.panel-section[data-prop="stroke-style"]',
  );
  if (!section) return;

  const style = el.style.borderStyle || state.style.strokeStyle || "solid";

  section.querySelectorAll(".icon-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === style);
  });
}

/* ===============================
   OPACITY
================================ */

function syncOpacity(el) {
  const input = document.querySelector(
    '.panel-section[data-prop="opacity"] input[type="range"]',
  );
  if (!input) return;

  const opacity =
    el.style.opacity !== ""
      ? parseFloat(el.style.opacity)
      : state.style.opacity;

  input.value = Math.round(opacity * 100);
}
