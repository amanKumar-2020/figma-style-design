import { state } from "./state.js";
import { selectObject } from "./selection.js";

let isRotating = false;
let startAngle = 0;
let centerX = 0;
let centerY = 0;

export function enableRotate() {
  const overlay = document.getElementById("selection-overlay");
  if (!overlay) return;

  const rotateHandle = overlay.querySelector(".rotate-handle");
  if (!rotateHandle) return;

  rotateHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!state.selectedElement) return;
    state.isRotating = true; 
    isRotating = true;
    const el = state.selectedElement;
    if (!el) return;

    isRotating = true;

    const rect = el.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;

    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  });
}

window.addEventListener("mousemove", (e) => {
  if (!isRotating) return;

  const el = state.selectedElement;
  if (!el) return;

  const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

  const angleDeg = (currentAngle - startAngle) * (180 / Math.PI);

  el.dataset.rotation = angleDeg;
  el.style.transform = `rotate(${angleDeg}deg)`;

  // keep overlay in sync
  selectObject(el);
});

window.addEventListener("mouseup", () => {
  isRotating = false;
  state.isRotating = false;
});
