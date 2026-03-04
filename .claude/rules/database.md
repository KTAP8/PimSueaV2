# Database Rules

## Tables

| Table | Purpose |
|---|---|
| `profiles` | Extends auth.users — name, phone, line_user_id, role |
| `products` | Blank garments (2 at launch: Regular + Oversize T-shirt) |
| `product_variants` | Color × size combinations with SKU |
| `product_templates` | Canvas template per face (front/back) — printable area in cm |
| `shirt_pricing` | Shirt price per unit: product × color × size × qty bracket |
| `print_pricing` | Print cost per unit: DTG/DTF × tier × color (DTG only) × qty bracket |
| `designs` | Canvas state as cm JSON. status: `draft` / `ordered` / `archived` |
| `cart_items` | Persistent cart — design_id + variant_id + quantity |
| `orders` | Master order record |
| `order_items` | One row per design × variant. Snapshots price at order time. |
| `order_status_log` | Immutable audit trail of status changes |
| `group_orders` | Group order session — share_code, deadline, design_id |
| `group_order_submissions` | Member submissions with per-member payment tracking |
| `admin_settings` | Key-value store for LINE tokens, supplier params |

## RLS Policy Summary

RLS is enabled on all tables.

- Users can only read/write their own data.
- `profiles.role = 'admin'` grants full access to all tables.
- `group_order_submissions`: anyone can INSERT if group status = `'open'`.

## Order Status Flow

```
pending_payment → confirmed → in_production → shipped → delivered
                                                    ↑ from any state
                                                 cancelled (admin only)
```

- LINE notification sent to customer on every transition after `pending_payment`
- `confirmed` triggers print file generation automatically
- `shipped` notification includes tracking number

## Storage Buckets

| Bucket | Access | Path Pattern |
|---|---|---|
| `uploads` | Public | `/uploads/[userId]/[filename]` |
| `print-files` | Private (admin only) | `/print-files/[orderId].png` |
| `products` | Public | `/products/[productId]/[filename]` |
