# Canvas Architecture — CRITICAL

This is the most important technical decision in the project.
Get this wrong and the entire print pipeline breaks silently.

## The Rule

**Never store Fabric.js pixel coordinates. Always convert to real-world centimetres before saving.**

The browser canvas runs at ~1:5 scale of the true print size (for performance).
The server re-renders at full 300dpi for print. The bridge between them is
cm coordinates that work at any resolution.

## Scale Factor Table

| Tier | Max W (cm) | Max H (cm) | Export px @ 300dpi | Canvas display px |
|---|---|---|---|---|
| 3×4 in | 7.62 | 10.16 | 900 × 1200 | 180 × 240 |
| A5 | 14.8 | 21.0 | 1748 × 2480 | 350 × 496 |
| A4 | 21.0 | 29.7 | 2480 × 3508 | 496 × 702 |
| A3 | 29.7 | 42.0 | 3508 × 4961 | 702 × 992 |
| A2 | 42.0 | 59.4 | 4961 × 7016 | 992 × 1403 |

## Coordinate Serialiser — `/lib/canvas-serialiser.ts`

```typescript
// scale = print_area_w_cm / canvas_display_width_px
const scale = print_area_w_cm / canvas_display_width_px;

// Per Fabric.js object:
const saved: CanvasObject = {
  type: obj.type,                               // 'image' | 'textbox'
  x_cm: (obj.left - printArea.left) * scale,   // relative to print area origin
  y_cm: (obj.top  - printArea.top)  * scale,
  w_cm: obj.width  * obj.scaleX * scale,
  h_cm: obj.height * obj.scaleY * scale,
  angle: obj.angle,                             // degrees — scale-independent
  asset_url: obj.getSrc?.(),                    // Supabase storage URL
  // text-specific:
  text: obj.text,
  font_family: obj.fontFamily,
  font_size_pt: obj.fontSize * scale * 2.835,
  font_weight: obj.fontWeight,
  fill: obj.fill,
};
```

## AABB Calculator (used for pricing)

```typescript
// Use rotated bounding box — accounts for angle
function getRotatedAABB(obj: CanvasObject) {
  const rad = (obj.angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  return {
    w_cm: obj.w_cm * cos + obj.h_cm * sin,
    h_cm: obj.w_cm * sin + obj.h_cm * cos,
  };
}

function calculateAABB(objects: CanvasObject[]) {
  // Returns { w_cm, h_cm } — bounding box of all objects combined
  // Used to determine print tier
}
```

## Server-Side Export — `/lib/print.ts`

```typescript
const DPI = 300;
const CM_PER_INCH = 2.54;
const cmToPx = (cm: number) => (cm / CM_PER_INCH) * DPI;

// Re-render each saved CanvasObject at full resolution
// ctx.drawImage(asset, cmToPx(obj.x_cm), cmToPx(obj.y_cm), ...)
// Output: transparent PNG at tier dimensions
```
