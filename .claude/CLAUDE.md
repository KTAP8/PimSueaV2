# PimSuea (พิมพ์เสื้อ) — Project Context

## What Is This

Thai print-on-demand platform for university students. Customers design shirts
on a canvas, pay via PromptPay, we handle production and delivery.
Supports Group Orders — one link, members submit sizes, each pays their share.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14, App Router, TypeScript strict mode |
| Styling | Tailwind CSS only. No CSS Modules, no styled-components. |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| Design Canvas | Fabric.js (browser, display resolution only) |
| Print Export | node-canvas (server-side, 300dpi) |
| PDF Export | pdfkit |
| Excel Export | exceljs |
| Payment | promptpay-qr (no gateway in MVP — manual confirm) |
| Notifications | LINE Messaging API |
| Validation | Zod on all API route inputs |
| Hosting | Vercel (frontend) + Supabase (DB + storage) |
| AI (Phase 2) | Claude API (@anthropic-ai/sdk) |
| Mockup (Phase 2) | Dynamic Mockups API |

## Folder Structure

```
/app
  /(auth)/login        — login page
  /(auth)/signup       — signup page
  /catalog             — product listing
  /catalog/[productId] — product detail
  /design/[productId]  — design canvas
  /cart                — cart page
  /checkout            — checkout page
  /orders              — order history
  /orders/[orderId]    — order detail
  /group/[shareCode]   — group order member submission form (public)
  /admin               — admin layout (role-gated)
  /admin/orders        — order management
  /admin/products      — product & variant CRUD
  /admin/pricing       — pricing tier management
  /admin/po            — PO generation

/components
  /ui                  — shared UI primitives (Button, Input, Badge, Card)
  /canvas              — Fabric.js canvas components
  /admin               — admin-specific components

/lib
  /supabase
    client.ts          — browser Supabase client
    server.ts          — server component Supabase client
    middleware.ts      — session refresh
  pricing.ts           — calculatePrice() — used by both frontend and API routes
  line.ts              — LINE Messaging API helpers
  print.ts             — server-side print file generation (node-canvas)
  canvas-serialiser.ts — Fabric.js px → cm converter and AABB calculator

/types
  database.ts          — Supabase generated types
  canvas.ts            — CanvasObject (cm-based), DesignJSON types

/utils
  cn.ts                — Tailwind class merge utility

/hooks
  useCart.ts           — cart state (reads/writes cart_items table)
  useCanvasPrice.ts    — live pricing from canvas AABB
```

## Key Conventions

**Always:**
- Use server components for data fetching. Client components for interactivity only.
- Use Zod to validate all API route request bodies before touching the DB.
- Snapshot prices in `order_items.unit_price_thb` at order time — never recalculate from current pricing for historical orders.
- Use `gen_random_uuid()` as default for all PK columns.
- Return typed responses from API routes using Zod schemas.
- Store all coordinates in cm, never pixels, in the database.

**Never:**
- Expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.
- Trust the price sent from the client — always recalculate server-side.
- Store raw Fabric.js pixel coordinates in the database.
- Use `any` type in TypeScript.
- Write inline styles — use Tailwind classes only.
- Use `localStorage` for cart — use the `cart_items` table.

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-side only, never expose to client
NEXT_PUBLIC_PROMPTPAY_ID=           # your PromptPay phone/ID number
LINE_CHANNEL_ACCESS_TOKEN=          # LINE Messaging API token
LINE_CHANNEL_SECRET=                # LINE Messaging API secret
```

## Verification & Testing

Before submitting any changes, run the following commands to verify the work:

1. **Lint:** `npm run lint` — ESLint via Next.js
2. **Types:** `npm run typecheck` — TypeScript strict-mode check (`tsc --noEmit`)
3. **Both:** `npm run check` — runs lint + typecheck together

Fix all errors before marking a task complete. Warnings are acceptable but should be noted.

No test framework is configured in Phase 1. Manual verification checkpoints are in `TASKS.md`.

## Current Build Phase

**Phase 1 — MVP** (T01–T28). Complete tasks in order. Do not skip ahead.

Phase 2: Group Order Coordinator, Claude API summary, Dynamic Mockups.
Phase 3: AI design generator, size recommender, design marketplace.

Do not implement Phase 2+ features until all T01–T28 are complete and verified.

---

> Detailed rules are split into focused files in `.claude/rules/`:
> `design-system.md` · `canvas.md` · `pricing.md` · `database.md` · `group-orders.md`
