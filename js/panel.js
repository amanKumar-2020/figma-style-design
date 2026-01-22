import { state } from "./state.js";
import { selectObject } from "./selection.js";
import { clamp } from "./bounds.js";
let panel;
let xInput, yInput, wInput, hInput, rInput;

/* called AFTER sidebar-right.html is loaded */
export function initPanel() {
  panel = document.getElementById("properties-panel");

  xInput = document.getElementById("prop-x");
  yInput = document.getElementById("prop-y");
  wInput = document.getElementById("prop-w");
  hInput = document.getElementById("prop-h");
  rInput = document.getElementById("prop-r");

  if (!panel || !xInput || !yInput || !wInput || !hInput || !rInput) {
    console.error("Panel elements not found");
    return;
  }

  [xInput, yInput, wInput, hInput, rInput].forEach((input) => {
    input.addEventListener("input", handleInputChange);
  });
}


function handleInputChange() {
  const el = state.selectedElement;
  if (!el) return;

  const workspace = el.offsetParent;

  let x = Number(xInput.value);
  let y = Number(yInput.value);
  let w = Number(wInput.value);
  let h = Number(hInput.value);

  w = Math.max(30, w);
  h = Math.max(30, h);

  x = clamp(x, 0, workspace.clientWidth - w);
  y = clamp(y, 0, workspace.clientHeight - h);

  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = w + "px";
  el.style.height = h + "px";

  const r = rInput.value || 0;
  el.dataset.rotation = r;
  el.style.transform = `rotate(${r}deg)`;

  selectObject(el);
}


export function showPanel() {
  panel?.classList.remove("hidden");
}

export function hidePanel() {
  panel?.classList.add("hidden");
}

export function syncPanel() {
  const el = state.selectedElement;
  if (!el || !panel) return;

  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent.getBoundingClientRect();

  xInput.value = Math.round(rect.left - parentRect.left);
  yInput.value = Math.round(rect.top - parentRect.top);
  wInput.value = Math.round(rect.width);
  hInput.value = Math.round(rect.height);
  rInput.value = el.dataset.rotation || 0;
}
