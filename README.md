# Frontend Project (Vanilla JS)

### Sheryians inter batch Showdown ###

The objective of this project is to build a basic visual design editor
similar in spirit to Figma, but implemented entirely using standard
DOM elements. The emphasis is not on advanced rendering or
performance optimizations, but on demonstrating a strong
understanding of DOM manipulation, event handling, coordinate
calculations, and state management using plain JavaScript.

A frontend project built using **HTML, CSS, and Vanilla JavaScript only**.
No frameworks, no libraries.

## Tech Stack

- HTML
- CSS
- JavaScript

❌ No frameworks
❌ No libraries
❌ No canvas rendering
✅ Pure DOM-based editor


### ✨ Features

🧱 Shape Tools

Rectangle
Circle
Line
Arrow
Diamond
Interaction
Select objects
Drag objects
Resize using handles
Rotate using rotation handle
Multi-layer support

🎛 Properties Panel

Stroke color
Fill / background color
Stroke width
Stroke style (solid / dashed / dotted)
Opacity control
Live property sync on selection

🗂 Layers Panel

Shows all elements on canvas
Click layer → select object
Move layer up / down
Z-index synced with UI and state

🧹 Eraser Tool

Click to delete object
Drag-eraser to remove multiple objects
💾 Persistence
Save project state using localStorage
Auto-load on page refresh


❌ No frameworks
❌ No libraries
❌ No canvas rendering
✅ Pure DOM-based editor

### 📁 Folder Structure
.
├── assets/        # Images, icons, fonts
├── css/           # Base styles, layout, components
├── js/            # Core editor logic
│   ├── tools/     # Drawing tools (rect, circle, line, etc.)
│   ├── panels/    # Properties & layers logic
│   ├── state.js   # Central editor state
│   └── main.js    # Application entry point
├── index.html
└── README.md


### 🚀 Entry Point

index.html → Application bootstrap
js/main.js → Editor initialization & wiring