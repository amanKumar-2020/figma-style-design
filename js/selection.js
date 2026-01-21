export function selectObject(objectEl) {
  const overlay = document.getElementById("selection-overlay");

  const rect = objectEl.getBoundingClientRect();
  const parentRect = objectEl.offsetParent.getBoundingClientRect();

  overlay.style.top = rect.top - parentRect.top + "px";
  overlay.style.left = rect.left - parentRect.left + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";

  overlay.classList.remove("hidden");
}

export function clearSelection() {
  document.getElementById("selection-overlay").classList.add("hidden");
}
