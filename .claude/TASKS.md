# PimSuea — Task List

## How to Use
- Start every Claude Code session with: "Read CLAUDE.md and TASKS.md. I am working on the current task. Complete it, then stop."
- When a task is done, change `- [ ]` to `- [x]`
- The task marked **← CURRENT** is what Claude Code works on next
- Do not skip ahead. Each task depends on the previous group being verified.

## Progress
- [x] T01 — Scaffold project
- [x] T02 — Configure Supabase
- [x] T03 — Database schema
- [x] T04 — Seed data
- [x] T05 — Signup page
- [x] T06 — Login page
- [x] T07 — Route protection middleware
- [x] T08 — Header component
- [x] T09 — Catalog list page
- [x] T10 — Catalog detail page
- [ ] T11 — Canvas: base setup ← CURRENT
- [ ] T11 — Canvas: base setup
- [ ] T12 — Canvas: upload + text tools
- [ ] T13 — Canvas: controls + constraints
- [ ] T14 — Canvas: face switcher
- [ ] T15 — Canvas: coordinate serialiser
- [ ] T16 — Pricing engine
- [ ] T17 — Pricing wired to canvas sidebar
- [ ] T18 — Cart
- [ ] T19 — Checkout + PromptPay QR
- [ ] T20 — Order status pages
- [ ] T21 — Print file generation (300dpi)
- [ ] T22 — Auto-trigger print on confirm
- [ ] T23 — Admin layout + route guard
- [ ] T24 — Admin: order management
- [ ] T25 — Admin: products + pricing CRUD
- [ ] T26 — Admin: PO generation
- [ ] T27 — LINE notifications
- [ ] T28 — Security hardening

---

## Verification Checkpoints
Do not start the next group until the current group passes its checkpoint.

| After | Verify before continuing |
|---|---|
| T01–T02 | App runs locally on localhost:3000. Supabase env vars connected. |
| T03–T04 | All tables visible in Supabase Table Editor. Seed data present. Run verification queries from pimsua_setup.sql Section 8. |
| T05–T08 | Can sign up, log in, log out. /cart redirects to /login when logged out. Header shows correct logged-in state: My Designs, My Orders, cart icon, name, logout. |
| T09–T10 | Both products visible in catalog. Detail page loads. |
| T11–T15 | Can place image + text on canvas. Save design → check designs table has canvas_json with x_cm/y_cm values (NOT pixels). |
| T16–T17 | Live price updates as objects are moved/resized. Price changes when quantity stepper is used. |
| T18–T20 | Full flow: design → cart → checkout → order appears in orders table with status pending_payment. |
| T21–T22 | After admin marks confirmed: print file PNG appears in Supabase print-files bucket. |
| T23–T26 | Admin can view orders, change status, edit pricing, generate PO PDF + Excel. |
| T27–T28 | LINE notify fires on status change. Zod rejects malformed API requests. |

---

## Group A — Project Foundation

### T01 — Scaffold project (S) — depends on: nothing
Scaffold a Next.js 14 project with App Router, TypeScript strict
mode, Tailwind CSS, and ESLint.

Set up path aliases: `@/` = `src/`.

Create folder structure:
```
/app
/components/ui
/components/canvas
/lib
/types
/utils
/hooks
```

Install packages:
```
fabric
@supabase/supabase-js
@supabase/ssr
zod
promptpay-qr
```

---

### T02 — Configure Supabase (S) — depends on: T01
Create the following Supabase client files:
- `/lib/supabase/client.ts` — browser client
- `/lib/supabase/server.ts` — server component client
- `/lib/supabase/middleware.ts` — session refresh

Add all required env variables to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_PROMPTPAY_ID
LINE_CHANNEL_ACCESS_TOKEN
LINE_CHANNEL_SECRET
```

Set up Supabase Storage with 3 buckets (create manually in Supabase Dashboard):
- `uploads` — public. Allowed: image/png, image/jpeg, image/svg+xml. Max 10MB.
- `print-files` — private. Allowed: image/png. Max 50MB.
- `products` — public. Allowed: image/png, image/jpeg. Max 10MB.

---

### T03 — Database schema (M) — depends on: T02
The database SQL has already been written. Run `pimsua_setup.sql`
in the Supabase SQL Editor (paste full file, click Run).

The SQL creates: profiles, products, product_variants,
product_templates, shirt_pricing, print_pricing, designs,
cart_items, orders, order_items, order_status_log,
group_orders, group_order_submissions, admin_settings.

Then run `pimsua_pricing_v2.sql` to create the two pricing tables
with correct structure (replaces old pricing_rules and printing_types).

RLS is enabled on all tables with policies already written in the SQL.

After running, verify in Table Editor that all tables exist.
Run the verification queries at the bottom of pimsua_setup.sql.

---

### T04 — Seed data (S) — depends on: T03
Seed data is already included in `pimsua_setup.sql` (Section 6) and
`pimsua_pricing_v2.sql` (Section 6). If you ran those files in T03,
seed data is already present.

Verify:
- 2 products exist (Regular T-Shirt, Oversize T-Shirt)
- 20 product_variants exist (10 per product)
- 2 product_templates exist (front face per product)
- 60 shirt_pricing rows (2 products × 2 colors × 5 sizes × 3 qty brackets)
- 45 print_pricing rows (30 DTG + 15 DTF)

If seed data is missing, re-run Section 6 of the relevant SQL files.

---

## Group B — Auth

### T05 — Signup page (M) — depends on: T02
Build `/app/(auth)/signup/page.tsx`.

Fields: email, password, full_name, phone.

On submit:
1. Validate with Zod (email format, password min 8 chars, phone Thai format)
2. Call `supabase.auth.signUp()`
3. Upsert into profiles table (full_name, phone)
4. Redirect to `/catalog` on success
5. Show inline field-level errors on failure

Styling: brand green `#08636D` for headings/borders,
orange `#F05A25` for submit button.

---

### T06 — Login page (S) — depends on: T05
Build `/app/(auth)/login/page.tsx`.

Fields: email, password.

On submit: `supabase.auth.signInWithPassword()`.
Redirect to `/catalog` on success.
Show error message on failure.
Link to `/signup` at bottom.

---

### T07 — Route protection middleware (S) — depends on: T06
Configure `middleware.ts` to protect routes using Supabase
server session check.

Rules:
- `/design/*`, `/cart`, `/checkout`, `/orders/*` → require auth → redirect `/login`
- `/admin/*` → require auth AND `profiles.role = 'admin'` → redirect `/` for non-admins
- `/group/*` → public, no auth required

---

### T08 — Header component (S) — depends on: T07
Build shared `Header` server component.

Logo: SVG `/logo.svg`, links to `/catalog`.

When logged out: Login button + Sign Up button.

When logged in:
- My Designs link → `/designs` (user's saved design drafts)
- My Orders link → `/orders` (order tracking)
- Cart icon with item count badge (count from cart_items table)
- User's full_name
- Logout button

Use Supabase server component session for auth state.

---

## Group C — Catalog

### T09 — Catalog list page (M) — depends on: T04
Build `/app/catalog/page.tsx`.

Fetch all active products from Supabase (server component).

Display as product cards:
- Product showcase image (from products.catalog_image_url)
- Product name
- "from ฿X" starting price
- Printing type badges (DTG / DTF)

Filter bar: DTG | DTF | All.

Each card links to `/catalog/[productId]`.
Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop.

---

### T10 — Catalog detail page (M) — depends on: T09
Build `/app/catalog/[productId]/page.tsx` as a server component.

Show: name, description, care instructions, size guide image,
color swatches (from product_variants), printing type badges.

Starting price: fetch lowest price from `shirt_pricing` WHERE
product_id = this product AND color_name = 'White' AND size = 'S'
AND min_qty = 1. Display as "from ฿X".

"Start Designing" button → `/design/[productId]`.

---

## Group D — Design Canvas (Most Complex)

### T11 — Canvas: base setup (L) — depends on: T04
Build `/app/design/[productId]/page.tsx`.

Fetch `product_templates` for this product from Supabase.

Create `CanvasEditor` as a client component using Fabric.js.

Setup:
- Render mockup image as locked, non-selectable background layer
- Draw dashed rectangle showing the max printable area (A2 bounds from product_templates)
- Set canvas display size using 1:5 scale factor (see Section 2.2 of plan)
- Canvas must be responsive — recalculate scale on window resize

Scale factor reference:
- A2 display: 992 × 1403 px
- A3 display: 702 × 992 px
- A4 display: 496 × 702 px
- A5 display: 350 × 496 px
- 3×4in display: 180 × 240 px

---

### T12 — Canvas: upload + text tools (L) — depends on: T11
Add two tools to the canvas toolbar:

**Image upload tool:**
- Accept SVG, PNG, JPG
- For PNG/JPG: validate minimum 150dpi (check pixel dimensions vs intended print size)
- Upload immediately to Supabase `uploads` bucket at path `/uploads/[userId]/[filename]`
- Add to canvas via `fabric.Image.fromURL()` using the returned Supabase URL
- Never use local blob URLs — always use the Supabase storage URL

**Text tool:**
- Add a `fabric.Textbox` to canvas
- Font selector: load top 20 Google Fonts including Thai-compatible fonts:
  Sarabun, Kanit, Prompt, Mitr, Bai Jamjuree
- Controls: font size, text color, bold, italic

---

### T13 — Canvas: controls + constraints (M) — depends on: T12
Add object interaction controls:
- Select, move, resize, rotate, delete (keyboard Delete key)
- Layer panel: list all canvas objects, allow reorder
  (bring forward / send back)

Boundary constraint system:
- On `object:moving` and `object:scaling` events, clamp the
  object within the printable area rectangle
- Objects cannot be moved or resized outside the print boundary
- Snap back to boundary if user attempts to drag outside

---

### T14 — Canvas: face switcher (S) — depends on: T13
If the product has both front and back templates, show
"Front / Back" tab buttons above the canvas.

Switching faces:
- Saves the current face's Fabric.js canvas state to React state
- Loads the other face's state onto the canvas
- Both faces' states are preserved independently in React state
- Front and back are saved separately in canvas_json:
  `{ front: [...objects], back: [...objects] }`

---

### T15 — Canvas: coordinate serialiser (M) — depends on: T14
Implement the coordinate serialiser in `/lib/canvas-serialiser.ts`.

This is the most critical part of the canvas. See Section 2.2 of
the planning document for the full logic.

On "Save Design" click:
1. For each Fabric.js object, convert position and size from
   canvas pixels to cm using the scale factor:
   `scale = print_area_w_cm / canvas_display_width_px`
   `x_cm = (obj.left - printArea.left) * scale`
   `y_cm = (obj.top - printArea.top) * scale`
   `w_cm = obj.width * obj.scaleX * scale`
   `h_cm = obj.height * obj.scaleY * scale`

2. Calculate rotated AABB in cm (must account for rotation):
   ```
   rad = angle * PI / 180
   aabb_w = w_cm * |cos(rad)| + h_cm * |sin(rad)|
   aabb_h = w_cm * |sin(rad)| + h_cm * |cos(rad)|
   ```

3. Determine print tier from AABB:
   - 3×4in: w ≤ 7.62 AND h ≤ 10.16
   - A5: w ≤ 14.8 AND h ≤ 21.0
   - A4: w ≤ 21.0 AND h ≤ 29.7
   - A3: w ≤ 29.7 AND h ≤ 42.0
   - A2: anything larger

4. Capture thumbnail via `fabric.Canvas.toDataURL()` at display
   resolution. Upload to `uploads` bucket as preview.

5. Upsert to `designs` table with canvas_json (cm coords),
   aabb_w_cm, aabb_h_cm, print_tier, preview_url, status='draft'.

After saving, console.log the canvas_json. Verify x_cm and y_cm
are in centimetres (small numbers like 3.2, 14.5) NOT pixels
(large numbers like 156, 432). Do not proceed if they are pixels.

---

## Group E — Pricing Engine

### T16 — Pricing engine (L) — depends on: T04
Create `/lib/pricing.ts`.

Export async function:
```typescript
calculatePrice({
  printingType,  // 'DTG' | 'DTF'
  aabb_w_cm,
  aabb_h_cm,
  quantity,
  productId,
  color_name,    // 'White' | 'Black'
  size,          // 'S' | 'M' | 'L' | 'XL' | 'XXL'
})
```

Logic:
1. Determine print tier from AABB (getPrintTier function)
2. Query `shirt_pricing` WHERE product_id = productId
   AND color_name = color_name AND size = size
   AND min_qty <= quantity
   AND (max_qty IS NULL OR max_qty >= quantity)
3. Query `print_pricing` WHERE type_code = printingType
   AND size_tier = tier
   AND color_name = (color_name if DTG, NULL if DTF)
   AND min_qty <= quantity
   AND (max_qty IS NULL OR max_qty >= quantity)
4. total_per_unit = shirt_price + print_price
   total = total_per_unit × quantity
5. Return: `{ tier, shirt_per_unit, print_per_unit, total_per_unit, total, quantity }`

This function is called from both the frontend canvas sidebar
AND server-side API routes. Never trust client-side price —
always recalculate server-side at checkout.

---

### T17 — Pricing wired to canvas sidebar (M) — depends on: T15, T16
Wire the pricing engine to the canvas right sidebar.

Trigger recalculation on:
- `canvas:modified` (object moved, resized, rotated)
- `object:added`
- `object:removed`
- Quantity stepper change

Display in sidebar:
- Print tier badge (e.g. "A4")
- Printing type selector (DTG / DTF) — changing this triggers recalc
- Color selector (White / Black) — drives both shirt and DTG print price
- Size selector (S / M / L / XL / XXL) — drives shirt price
- Quantity stepper (min 1)
- Shirt price per unit: ฿X
- Print price per unit: ฿X
- Total per unit: ฿X
- Total (per unit × qty): ฿X
- Loading spinner during fetch

"Add to Cart" button below pricing. Disabled until design is saved.

---

## Group F — Cart & Checkout

### T18 — Cart (M) — depends on: T17
"Add to Cart" flow on canvas sidebar:
- User selects size + color variant
- Clicks "Add to Cart"
- Inserts row into `cart_items` (user_id, design_id, variant_id, quantity)
- Updates cart icon badge count in Header

Build `/app/cart/page.tsx`:
- Fetch user's cart_items joined with designs (preview_url, print_tier,
  printing_type) and product_variants (color_name, size, sku)
- Show each item: thumbnail, product name, color, size, qty, price
- Allow quantity edit (updates cart_items row)
- Allow remove (deletes cart_items row)
- Show order subtotal
- "Proceed to Checkout" button → `/checkout`

---

### T19 — Checkout + PromptPay QR (M) — depends on: T18
Build `/app/checkout/page.tsx`.

Show order summary from cart. Pre-fill customer name, phone
from profiles table.

"Place Order" button:
1. Server-side: recalculate all prices from scratch using
   calculatePrice() — never trust cart prices
2. Create `orders` record:
   - status = 'pending_payment'
   - total_thb = recalculated total
   - payment_method = 'promptpay'
   - order_number = 'PS-YYYY-XXXX' (sequential)
3. Create `order_items` rows from cart (snapshot prices,
   print_tier, printing_type at this moment)
4. Delete all cart_items for this user
5. Update designs.status = 'ordered' for each design in the order
6. Generate PromptPay QR using `promptpay-qr` package with
   NEXT_PUBLIC_PROMPTPAY_ID and total amount
7. Display QR code image + amount + LINE OA instructions for payment
8. Redirect to `/orders/[orderId]`

---

### T20 — Account pages: orders + designs (S) — depends on: T19
Build `/app/orders/[orderId]/page.tsx`:
- Order number, created date
- Status badge with colour coding:
  pending_payment=yellow, confirmed=blue, in_production=purple,
  shipped=orange, delivered=green, cancelled=red
- Itemised list: design thumbnail, product name, color, size,
  qty, unit price, subtotal
- Order total
- While status = 'pending_payment': show PromptPay QR + instructions
- Poll order status every 30 seconds while pending_payment

Build `/app/orders/page.tsx` (My Orders):
- Simple list of user's orders
- Columns: order number, date, status badge, total
- Each row links to `/orders/[orderId]`

Build `/app/designs/page.tsx` (My Designs):
- List of user's saved designs with status = 'draft'
- Show: design preview thumbnail (preview_url), design name,
  print tier badge, created date
- Each card links to `/design/[productId]` to re-open the canvas
- Empty state: "ยังไม่มีดีไซน์ เริ่มออกแบบเลย →" with link to /catalog

---

## Group G — Print File Generation

### T21 — Print file generation (L) — depends on: T19
Build API route `POST /api/orders/[orderId]/generate-print-file`.

This route is server-only. Uses node-canvas (install: `canvas` npm).

Steps:
1. Load order from DB, get associated design.canvas_json
2. Determine canvas dimensions from print_tier:
   - 3×4in: 900 × 1200 px
   - A5: 1748 × 2480 px
   - A4: 2480 × 3508 px
   - A3: 3508 × 4961 px
   - A2: 4961 × 7016 px
3. Create node-canvas at those dimensions (transparent background)
4. For each object in canvas_json, convert cm → px:
   `px = (cm / 2.54) * 300`
5. Draw images: `ctx.drawImage(asset, x, y, w, h)`
   Download asset from Supabase storage URL at full resolution.
6. Draw text: load Google Font server-side, `ctx.fillText()`
   with matching font-family, size (pt → px), color, weight.
7. Export as transparent PNG buffer
8. Upload to Supabase `print-files` bucket at `/print-files/[orderId].png`
9. Update `orders.print_file_url` with the storage URL

Font loading note: pre-load all Google Fonts used in the design
server-side before rendering. If a font is missing, text will
fall back to system default and look wrong.

---

### T22 — Auto-trigger print on confirm (S) — depends on: T21
Modify the admin order status update API route.

When admin changes order status to 'confirmed':
1. Automatically call `/api/orders/[orderId]/generate-print-file`
2. If print file generation succeeds: continue normally
3. If it fails:
   - Add `print_file_error: true` flag to the order record
   - Log the error server-side (admin can see it in the order detail page)
   - Do NOT block the status update — order is still confirmed

On order detail page in admin: show "Retry print file" button
if print_file_error is true.

---

## Group H — Admin Panel

### T23 — Admin layout + route guard (S) — depends on: T07
Create `/app/admin/` route group with shared layout.

Layout includes:
- Sidebar nav: Orders | Products | Pricing | PO Generation
- PimSuea logo/header in brand green
- Active nav item highlight

Server-side route guard: check `profiles.role = 'admin'`
for the current session. Redirect to `/` if not admin.

---

### T24 — Admin: order management (M) — depends on: T23
Build `/app/admin/orders`:
- Table: order number, customer name, printing type, status
  (colour badge), total, created date
- Filter by status (All / pending_payment / confirmed / etc.)
- Click row → `/app/admin/orders/[orderId]`

Build `/app/admin/orders/[orderId]`:
- Order details: all order_items with design preview thumbnails
- Print file download link (if generated)
- Status dropdown: select new status → updates orders table,
  writes to order_status_log
- Shipping tracking number input field (shown when status = shipped)
- "Retry print file" button (shown if print_file_error = true)

---

### T25 — Admin: products + pricing CRUD (M) — depends on: T23
Build `/app/admin/products`:
- List all products with is_active toggle
- Click product → edit form: name, description, base_price_thb,
  care_instructions, supported_printing_types
- Variant management: list variants, toggle is_available per variant

Build `/app/admin/pricing`:
- Two sections: Shirt Pricing and Print Pricing

Shirt Pricing table: editable grid of
product × color × size × qty bracket → price.
Display as a matrix grouped by product + color.
Edit price inline, save on blur.

Print Pricing table: editable grid of
type × tier × color × qty bracket → price.
Separate sections for DTG (with color column) and DTF (no color column).
Edit price inline, save on blur.

All changes save immediately to DB on blur/change.

---

### T26 — Admin: PO generation (L) — depends on: T24
Build `/app/admin/po`.

Show a multi-select table of orders with status = 'confirmed',
grouped by printing type (DTG / DTF).

Each row: order number, customer, design thumbnail, SKUs, qty.

"Generate PO" button → `POST /api/admin/generate-po` with
selected order IDs.

API generates two files:

**PDF (pdfkit):**
- PimSuea header with logo + date
- Table of selected orders
- Design thumbnails (fetch preview_url)
- Qty breakdown per SKU

**Excel (exceljs):**
- Supplier production list format
- Columns: Order Name / Order Date / Package / Pattern /
  Total Amount / SKU ID / Gr / Fil / L
- One row per order_item

Return both files as downloads. Trigger both file downloads
on the client when the API responds.

---

## Group I — Notifications & Security

### T27 — LINE notifications (S) — depends on: T22
Create `/lib/line.ts` with one function:

`sendCustomerMessage(lineUserId: string, message: string)`:
- Calls LINE Messaging API
- Credentials from `admin_settings` table

Wire notifications to order events:
- Status → confirmed → customer:
  "✅ ออเดอร์ [order_number] ของคุณได้รับการยืนยันแล้ว กำลังเตรียมการผลิต"
- Status → shipped → customer:
  "🚚 ออเดอร์ [order_number] ถูกจัดส่งแล้ว เลขพัสดุ: [tracking]"
- Status → delivered → customer:
  "📦 ออเดอร์ [order_number] ส่งถึงแล้ว ขอบคุณที่ใช้บริการ PimSuea 🙏"

Update `order_status_log.notification_sent = true` after each
successful notification.

---

### T28 — Security hardening (S) — depends on: T27
Four tasks in one:

**1. Zod validation on all API routes:**
Define Zod schemas for every API route request body.
Reject requests with unknown fields (`strict()` mode).
Return 400 with field-level errors on validation failure.

**2. Rate limiting:**
- `/api/orders/*` → 10 requests/min per IP
- `/api/pricing` → 30 requests/min per IP
- Auth routes → 5 requests/min per IP
Use `@upstash/ratelimit` + `@upstash/redis` if available,
otherwise use in-memory Map with timestamp cleanup.

**3. Service role key audit:**
Search all files for `SUPABASE_SERVICE_ROLE_KEY`.
It must only appear in server-side files (API routes, server
components). Must never appear in any client component or
any file without `'use server'` / inside `/app/api/`.

**4. Input sanitisation:**
Sanitise all free-text inputs (customer_note, design name,
group order title) before saving to DB.
Strip HTML tags, limit lengths (customer_note max 500 chars,
design name max 100 chars).

---

## Phase 2 Tasks (after MVP is live)
These are NOT part of the current build. Do not implement until
all T01–T28 are complete and the first real order has been placed.

- Group Order Coordinator (shareable link, per-member payment QR)
- AI Order Summary (Claude API, Thai language)
- AI Mockup (Dynamic Mockups API)
- Payment gateway (Omise / 2C2P)
- Supplier portal (read-only)
- LINE OAuth login