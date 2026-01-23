import { state } from "./state.js";
import { tools } from "./tools.config.js";

export function renderToolbar() {
  const toolbar = document.querySelector(".toolbar");
  toolbar.innerHTML = "";

  tools.forEach((tool) => {
    const btn = document.createElement("button");
    btn.className = "tool-btn";
    btn.textContent = tool.icon;
    btn.title = tool.label;
    btn.dataset.tool = tool.id;

    if (tool.id === state.activeTool) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      state.activeTool = tool.id;
      updateToolbarActiveState();
    });

    toolbar.appendChild(btn);
  });
}

/* 🔥 NEW: update ONLY classes, not DOM */
function updateToolbarActiveState() {
  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === state.activeTool);
  });
}
const workspace = document.getElementById("workspace");
workspace.classList.toggle("eraser", state.activeTool === "eraser");
