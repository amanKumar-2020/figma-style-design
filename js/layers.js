import { state } from "./state.js";
import { selectObject } from "./selection.js";

/* ===============================
   RENDER
================================ */

export function renderLayers() {
  const list = document.getElementById("layers-list");
  if (!list) return;

  list.innerHTML = "";

  // topmost first → highest z-index last in array
  [...state.objects]
    .slice()
    .reverse()
    .forEach((el) => {
      const li = document.createElement("li");
      li.textContent = el.dataset.id || "Layer";

      if (el === state.selectedElement) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        selectObject(el, true);
      });

      list.appendChild(li);
    });
}

/* ===============================
   MOVE LAYER
================================ */

export function moveLayer(direction) {
  const el = state.selectedElement;
  if (!el) return;

  const index = state.objects.indexOf(el);
  if (index === -1) return;

  let newIndex = index;

  if (direction === "up" && index < state.objects.length - 1) {
    newIndex = index + 1;
  }

  if (direction === "down" && index > 0) {
    newIndex = index - 1;
  }

  if (newIndex === index) return;

  // swap in array
  const temp = state.objects[newIndex];
  state.objects[newIndex] = el;
  state.objects[index] = temp;

  // reassign z-indexes
  state.objects.forEach((obj, i) => {
    obj.style.zIndex = i + 1;
  });

  renderLayers();
}
