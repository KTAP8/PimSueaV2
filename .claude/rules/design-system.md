# Design System & Brand Rules

## Brand Assets

**Logo:** `public/logo.svg` — use as `<img src="/logo.svg" />` or `<Image src="/logo.svg" />`.
SVG is already in brand green `#08636D`. Do not recolor it.
Dimensions: 137 × 52px (use as-is or scale proportionally).

**Font: FC Vision** (loaded via `globals.css` `@font-face`)

| File | Weight | Tailwind class |
|---|---|---|
| `fc-vision-light.otf` | 300 (light) | `font-light` — default body weight |
| `fc-vision-bold.otf` | 700 (bold) | `font-bold` — UI labels, prices |
| `fc-vision-heavy.otf` | 900 (heavy) | `font-heavy` — large display headings only |

FC Vision is the **only** typeface for this project. Do not import Google Fonts for UI.
(Google Fonts Thai variants like Sarabun/Kanit are only allowed inside the canvas tool for customer design use.)

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Brand Green | `#08636D` | Navigation, active states, structural UI, headings |
| Action Orange | `#F05A25` | Primary CTAs **only** (Add to Cart, Checkout, Save Design) |
| Alert Red | `#C23B32` | Errors and destructive actions **only** |
| Deep Black | `#121212` | Main typography |
| Slate Gray | `#6C757D` | Secondary text, placeholders |
| Surface Gray | `#E9ECEF` | Input backgrounds, dividers |
| Crisp White | `#F8F9FA` | Cards, canvas background |

## Color Rules

- Orange = conversion actions only. Never decorative.
- Red = errors only. Never decorative.
- Never put orange text on a green background.

## Component Specs

**Buttons**
- Primary: orange bg (`#F05A25`) + white text
- Secondary: green border (`#08636D`) + transparent bg + green text

**Inputs**
- Idle border: `#E9ECEF`
- Focus: `2px solid #F05A25`
- Error: `#C23B32`

**Border Radius**
- Buttons and inputs: `4px`
- Cards and modals: `8px`
- Product images: `0px` (sharp edges, no rounding)

## Products at Launch

**Regular T-Shirt**
- Colors: White (`#FFFFFF`), Black (`#000000`)
- Sizes: S, M, L, XL, XXL
- SKUs: `REG-WHITE-S` … `REG-BLACK-XXL`
- Printing: DTG + DTF
- Base price: 130 THB

**Oversize T-Shirt**
- Colors: White (`#FFFFFF`), Black (`#000000`)
- Sizes: S, M, L, XL, XXL
- SKUs: `OS-WHITE-S` … `OS-BLACK-XXL`
- Printing: DTG + DTF
- Base price: 150 THB

## Tone of Voice

Audience: Thai university students. Be direct and energetic.

- Good: "Upload, choose, done." / "Your design. Your squad."
- Bad: "Please kindly proceed to the next step."
- Prices always show THB with ฿ symbol.

## Route Protection

Implemented in `/lib/supabase/middleware.ts`:

- `/design/*`, `/cart`, `/checkout`, `/orders/*` → require auth → redirect `/login`
- `/admin/*` → require auth AND `profiles.role = 'admin'` → redirect `/` if not admin
- `/group/[shareCode]` → public, no auth required (members don't need accounts)
