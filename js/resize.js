import { selectObject } from "./selection.js";

let isResizing = false;
let activeHandle = null;
let activeEl = null;

let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;

export function enableResize(objectEl) {
  const handles = document.querySelectorAll(".handle");

  handles.forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();

      isResizing = true;
      activeHandle = handle.classList[1]; // tl, tr, etc
      activeEl = objectEl;

      const rect = objectEl.getBoundingClientRect();
      const parentRect = objectEl.offsetParent.getBoundingClientRect();

      startX = e.clientX;
      startY = e.clientY;

      startWidth = rect.width;
      startHeight = rect.height;
      startLeft = rect.left - parentRect.left;
      startTop = rect.top - parentRect.top;
    });
  });
}

window.addEventListener("mousemove", (e) => {
  if (!isResizing || !activeEl) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let newWidth = startWidth;
  let newHeight = startHeight;
  let newLeft = startLeft;
  let newTop = startTop;

  if (activeHandle.includes("r")) {
    newWidth = startWidth + dx;
  }
  if (activeHandle.includes("l")) {
    newWidth = startWidth - dx;
    newLeft = startLeft + dx;
  }
  if (activeHandle.includes("b")) {
    newHeight = startHeight + dy;
  }
  if (activeHandle.includes("t")) {
    newHeight = startHeight - dy;
    newTop = startTop + dy;
  }

  activeEl.style.width = `${newWidth}px`;
  activeEl.style.height = `${newHeight}px`;
  activeEl.style.left = `${newLeft}px`;
  activeEl.style.top = `${newTop}px`;

  // sync selection overlay
  selectObject(activeEl);
});

window.addEventListener("mouseup", () => {
  isResizing = false;
  activeHandle = null;
  activeEl = null;
});
