import { state } from "./state.js";
import { selectObject } from "./selection.js";
import { enableDrag } from "./drag.js";
import { enableResize } from "./resize.js";
import { enableRotate } from "./rotate.js";

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

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    selectObject(el);
  });

  enableDrag(el);
  enableResize(el);
  enableRotate(el);

  state.objects.push(el);
  document.getElementById("workspace").appendChild(el);

  return el;
}
