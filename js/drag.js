import { selectObject } from "./selection.js";

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

  const parentRect = activeEl.offsetParent.getBoundingClientRect();

  const x = e.clientX - parentRect.left - offsetX;
  const y = e.clientY - parentRect.top - offsetY;

  activeEl.style.left = `${x}px`;
  activeEl.style.top = `${y}px`;

  // keep selection overlay synced
  selectObject(activeEl);
});

window.addEventListener("mouseup", () => {
  if (!activeEl) return;

  activeEl.classList.remove("dragging");
  isDragging = false;
  activeEl = null;
});
