import { state } from "./state.js";
import { selectObject } from "./selection.js";

export function renderLayers() {
  const list = document.getElementById("layers-list");
  if (!list) return;

  list.innerHTML = "";

  [...state.objects]
    .slice()
    .reverse()
    .forEach((el) => {
      const li = document.createElement("li");
      li.textContent = el.dataset.id;

      if (el === state.selectedElement) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        selectObject(el);
      });

      list.appendChild(li);
    });
}

export function moveLayer(direction) {
  const el = state.selectedElement;
  if (!el) return;

  let z = Number(el.style.zIndex);

  if (direction === "up") z += 1;
  if (direction === "down") z = Math.max(1, z - 1);

  el.style.zIndex = z;
  renderLayers();
}
