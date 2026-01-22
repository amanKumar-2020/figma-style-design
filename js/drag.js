import { selectObject } from "./selection.js";
import { clamp } from "./bounds.js";

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let activeEl = null;

export function enableDrag(objectEl) {
  objectEl.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    activeEl = objectEl;

    const rect = objectEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    objectEl.classList.add("dragging");
    selectObject(objectEl);
  });
}

window.addEventListener("mousemove", (e) => {
  if (!isDragging || !activeEl) return;

  const workspace = activeEl.offsetParent;
  const parentRect = workspace.getBoundingClientRect();

  const elWidth = activeEl.offsetWidth;
  const elHeight = activeEl.offsetHeight;

  let x = e.clientX - parentRect.left - offsetX;
  let y = e.clientY - parentRect.top - offsetY;

  // 🔒 CLAMP
  x = clamp(x, 0, workspace.clientWidth - elWidth);
  y = clamp(y, 0, workspace.clientHeight - elHeight);

  activeEl.style.left = x + "px";
  activeEl.style.top = y + "px";

  selectObject(activeEl);
});

window.addEventListener("mouseup", () => {
  if (!activeEl) return;
  activeEl.classList.remove("dragging");
  isDragging = false;
  activeEl = null;
});
