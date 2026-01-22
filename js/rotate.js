import { selectObject } from "./selection.js";

let isRotating = false;
let activeEl = null;
let startAngle = 0;
let centerX = 0;
let centerY = 0;

export function enableRotate(objectEl) {
  const rotateHandle = document.querySelector(".rotate-handle");

  rotateHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();

    isRotating = true;
    activeEl = objectEl;

    const rect = objectEl.getBoundingClientRect();

    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;

    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  });
}

window.addEventListener("mousemove", (e) => {
  if (!isRotating || !activeEl) return;

  const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

  const angleDeg = (currentAngle - startAngle) * (180 / Math.PI);

  activeEl.style.transform = `rotate(${angleDeg}deg)`;

  // sync selection overlay
  selectObject(activeEl);

  activeEl.dataset.rotation = Math.round(angleDeg);
  activeEl.style.transform = `rotate(${angleDeg}deg)`;

});

window.addEventListener("mouseup", () => {
  isRotating = false;
  activeEl = null;
});

