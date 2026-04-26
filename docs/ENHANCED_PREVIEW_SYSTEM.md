Goal

Enable a "Preview" environment where React-rendered components can be hovered and visually highlighted. Each DOM node should be traceable back to its source file (via data-* attributes injected during build).

🛠️ Plan
1. Metadata Injection at Build

Use a Babel or Vite esbuild plugin to inject metadata (data-meta) into JSX/TSX elements. We use Vite.

Example:

<Button /> 
→ <button data-meta="src/components/Button.tsx:23:5">...</button>


This ensures every rendered node in the DOM can be traced back to source.

2. Preview Rendering Environment

Your Preview is just a normal React build output rendered in an iframe or container div.

Important: make sure all rendered elements preserve data-meta.

3. Hover Detection

Add a mousemove listener inside the Preview frame.

On hover over any element that has data-meta, highlight it.

Example logic:

document.addEventListener("mousemove", (e) => {
  const target = e.target.closest("[data-meta]");
  if (target) {
    highlightElement(target);
  } else {
    removeHighlight();
  }
});

4. Highlight Overlay

Use a global overlay div (absolute positioned, pointer-events: none) that follows the hovered element’s bounding box.

Example:

function highlightElement(el) {
  const rect = el.getBoundingClientRect();
  overlay.style.top = rect.top + "px";
  overlay.style.left = rect.left + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
  overlay.style.border = "2px solid #ff0000"; 
}


This way, the hovered component gets a visible red (or themed) outline.

5. Metadata Tooltip (Optional)

On hover, show a tooltip near the mouse cursor with data-meta content (like Button.tsx:23:5).

Example:

src/components/Button.tsx:23:5

6. Exit Condition

When the mouse leaves the element (mouseout) or moves to an element without data-meta, remove the overlay and tooltip.

✅ End Result

Hover over any rendered element in Preview → it highlights with an outline.

Optional tooltip shows its source file/line.

This gives the foundation for later steps (click → open quick-edit textarea).