import { state } from "./state.js";
import { tools } from "./tools.config.js";

export function renderToolbar() {
  const toolbar = document.querySelector(".toolbar");
  toolbar.innerHTML = "";

  // 1. Create Logo (Left Side)
  const logo = document.createElement("div");
  logo.className = "app-logo";
  // "Layout" in white, "Lab" in your neon blue accent
  logo.innerHTML = `Layout<span style="color: var(--accent);">Lab</span>`;
  toolbar.appendChild(logo);

  // 2. Create Tools Wrapper (To keep buttons centered)
  const toolsWrapper = document.createElement("div");
  toolsWrapper.className = "tools-wrapper";
  toolbar.appendChild(toolsWrapper);

  // 3. Render Buttons inside the wrapper
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

    toolsWrapper.appendChild(btn); // Append to wrapper, not main toolbar
  });
}

function updateToolbarActiveState() {
  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === state.activeTool);
  });
}

// Eraser cursor toggle logic
const workspace = document.getElementById("workspace");
// We can move this check inside the update function if needed,
// but for now, we just ensure it runs when clicked.
// (You might want to ensure this toggle logic is inside updateToolbarActiveState for consistency)
