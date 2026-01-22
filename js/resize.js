import { selectObject } from "./selection.js";
import { clamp } from "./bounds.js";

const MIN_SIZE = 30;

let isResizing = false;
let activeHandle = null;
let activeEl = null;

let startX, startY;
let startW, startH, startL, startT;

export function enableResize(objectEl) {
  document.querySelectorAll(".handle").forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();

      isResizing = true;
      activeHandle = handle.classList[1];
      activeEl = objectEl;

      const rect = objectEl.getBoundingClientRect();
      const parentRect = objectEl.offsetParent.getBoundingClientRect();

      startX = e.clientX;
      startY = e.clientY;

      startW = rect.width;
      startH = rect.height;
      startL = rect.left - parentRect.left;
      startT = rect.top - parentRect.top;
    });
  });
}

window.addEventListener("mousemove", (e) => {
  if (!isResizing || !activeEl) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  const workspace = activeEl.offsetParent;

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

  // 🔒 CLAMP
  w = clamp(w, MIN_SIZE, workspace.clientWidth - l);
  h = clamp(h, MIN_SIZE, workspace.clientHeight - t);
  l = clamp(l, 0, workspace.clientWidth - w);
  t = clamp(t, 0, workspace.clientHeight - h);

  activeEl.style.width = w + "px";
  activeEl.style.height = h + "px";
  activeEl.style.left = l + "px";
  activeEl.style.top = t + "px";

  selectObject(activeEl);
});

window.addEventListener("mouseup", () => {
  isResizing = false;
  activeHandle = null;
  activeEl = null;
});
