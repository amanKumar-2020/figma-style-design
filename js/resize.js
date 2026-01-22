import { state } from "./state.js";
import { selectObject } from "./selection.js";
import { clamp } from "./bounds.js";

const MIN_SIZE = 30;

let isResizing = false;
let activeHandle = null;

let startX = 0;
let startY = 0;
let startW = 0;
let startH = 0;
let startL = 0;
let startT = 0;

export function enableResize() {
  const overlay = document.getElementById("selection-overlay");
  if (!overlay) return;

  overlay.addEventListener("mousedown", (e) => {
    const handle = e.target.closest(".handle");
    if (!handle) return;

    const el = state.selectedElement;
    if (!el) return;

    e.stopPropagation();
    e.preventDefault();

    isResizing = true;
    state.isResizing = true;
    activeHandle = handle.dataset.handle;

    const rect = el.getBoundingClientRect();
    const parentRect = el.offsetParent.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;
    startL = rect.left - parentRect.left;
    startT = rect.top - parentRect.top;
  });
}

window.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  const el = state.selectedElement;
  if (!el) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const workspace = el.offsetParent;

  let w = startW;
  let h = startH;
  let l = startL;
  let t = startT;

  if (activeHandle.includes("r")) w = startW + dx;
  if (activeHandle.includes("l")) {
    w = startW - dx;
    l = startL + dx;
  }
  if (activeHandle.includes("b")) h = startH + dy;
  if (activeHandle.includes("t")) {
    h = startH - dy;
    t = startT + dy;
  }

  w = clamp(w, MIN_SIZE, workspace.clientWidth - l);
  h = clamp(h, MIN_SIZE, workspace.clientHeight - t);
  l = clamp(l, 0, workspace.clientWidth - w);
  t = clamp(t, 0, workspace.clientHeight - h);

  el.style.width = w + "px";
  el.style.height = h + "px";
  el.style.left = l + "px";
  el.style.top = t + "px";

  selectObject(el);
});

window.addEventListener("mouseup", () => {
  isResizing = false;
  state.isResizing = false;
  activeHandle = null;
});
