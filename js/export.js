import { getSerializedData } from "./storage.js";

/**
 * Export as JSON file (No changes here, just for reference)
 */
export function exportToJSON() {
  const data = getSerializedData();
  console.log(`📤 Exporting JSON: ${data.objects.length} items`);

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  triggerDownload(blob, "design-export.json");
}

/**
 * Export as HTML file
 * FIX: Now uses 100% width/height to prevent cutting off objects
 */
export function exportToHTML() {
  const data = getSerializedData();
  console.log(`📤 Exporting HTML: ${data.objects.length} items`);

  // 1. Generate CSS
  // We used '100vw' and '100vh' to ensure the canvas covers the whole screen
  const styleBlock = `
    <style>
      body { margin: 0; padding: 0; background: #1e1e1e; overflow: hidden; font-family: sans-serif; }
      
      .canvas { 
        position: relative; 
        width: 100vw; 
        height: 100vh; 
        background: white; 
        overflow: auto; /* Allow scrolling if needed */
      }

      .object { 
        position: absolute; 
        box-sizing: border-box; 
        transform-origin: center center; /* Ensure rotation happens from center */
      }

      .circle { border-radius: 50%; }
      .diamond { transform: rotate(45deg); }
      
      /* Helper for Line visibility if height is small */
      .line { transform-origin: left center; } 
    </style>
  `;

  // 2. Generate Object Tags
  const objectsHTML = data.objects
    .map((obj) => {
      const s = obj.styles || {};

      // Safety check for styles
      const bg = s.fill || "transparent";
      const border = `${s.strokeWidth || 0}px ${s.strokeStyle || "solid"} ${s.stroke || "transparent"}`;

      // We construct the style string carefully
      const inlineStyle = `
        left: ${obj.x}px; 
        top: ${obj.y}px; 
        width: ${obj.width}px; 
        height: ${obj.height}px; 
        z-index: ${obj.zIndex}; 
        transform: rotate(${obj.rotation}deg);
        background-color: ${bg};
        border: ${border};
        opacity: ${s.opacity};
    `.replace(/\n/g, " "); // Replace newlines with spaces to avoid breaking HTML attributes

      let className = "object";
      if (obj.type && obj.type !== "rect") className += ` ${obj.type}`;

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
