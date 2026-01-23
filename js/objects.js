import { state } from "./state.js";
import { selectObject } from "./selection.js";
import { enableDrag } from "./drag.js";

let idCounter = 1;

export function createObject(type = "rect") {
  const el = document.createElement("div");
  const id = `obj-${idCounter++}`;

  el.className = "canvas-object";
  el.dataset.id = id;
  el.textContent = type;

  el.style.left = "100px";
  el.style.top = "100px";
  el.style.width = "160px";
  el.style.height = "100px";
  el.style.zIndex = state.objects.length + 1;

  el.style.border = `2px solid ${state.style.stroke}`;
  el.style.background = state.style.fill;

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(el);
  });

  enableDrag(el);

  state.objects.push(el);
  document.getElementById("workspace").appendChild(el);

  return el;
}
