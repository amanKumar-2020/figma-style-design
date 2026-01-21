import { state } from "./state.js";
import { tools } from "./tools.config.js";

export function renderToolbar() {
  const toolbar = document.querySelector(".toolbar"); // class, not id
  toolbar.innerHTML = "";

  tools.forEach((tool) => {
    const btn = document.createElement("button");
    btn.className = "tool-btn";
    btn.textContent = tool.icon;
    btn.title = tool.label;

    if (tool.id === state.activeTool) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      state.activeTool = tool.id;
      renderToolbar();
    });

    toolbar.appendChild(btn);
  });
}
