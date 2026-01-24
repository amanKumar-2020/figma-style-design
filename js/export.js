import { getSerializedData } from "./storage.js";

/**
 * Export as JSON file
 */
export function exportToJSON() {
  const data = getSerializedData();
  const jsonString = JSON.stringify(data, null, 2); // Pretty print
  const blob = new Blob([jsonString], { type: "application/json" });

  triggerDownload(blob, "design-export.json");
}

/**
 * Export as HTML file
 */
export function exportToHTML() {
  const data = getSerializedData();

  // 1. Generate CSS for shapes
  // We include basic CSS so the shapes look right without external files
  const styleBlock = `
    <style>
      body { margin: 0; padding: 0; background: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
      .canvas { position: relative; width: 800px; height: 600px; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; }
      .object { position: absolute; box-sizing: border-box; }
      .circle { border-radius: 50%; }
      .diamond { transform: rotate(45deg); } /* Default diamond rotation */
    </style>
  `;

  // 2. Generate Object Tags
  const objectsHTML = data.objects
    .map((obj) => {
      const s = obj.styles;
      // We convert the internal styles to inline CSS string
      const inlineStyle = `
        left: ${obj.x}px; 
        top: ${obj.y}px; 
        width: ${obj.width}px; 
        height: ${obj.height}px; 
        z-index: ${obj.zIndex}; 
        transform: rotate(${obj.rotation}deg);
        background-color: ${s.fill};
        border: ${s.strokeWidth}px ${s.strokeStyle} ${s.stroke};
        opacity: ${s.opacity};
    `.replace(/\n/g, ""); // Remove newlines for cleaner HTML

      // Add specific classes
      let className = "object";
      if (obj.type !== "rect") className += ` ${obj.type}`;

      return `<div class="${className}" style="${inlineStyle}"></div>`;
    })
    .join("\n      ");

  // 3. Construct Final HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Design</title>
    ${styleBlock}
</head>
<body>
    <div class="canvas">
      ${objectsHTML}
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  triggerDownload(blob, "design-export.html");
}

/**
 * Helper to trigger browser download
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
