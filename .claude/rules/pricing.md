# Pricing Rules

## Formula Overview

Two independent lookups (shirt price + print price), then sum.
Both tables use volume tiers — more quantity = cheaper per unit.

**Never trust the price from the client. Always recalculate server-side on checkout.**

`calculatePrice()` lives in `/lib/pricing.ts` and is called from:
- The canvas sidebar (live update on every `canvas:modified` event)
- The checkout API route (server-side price confirmation)
- The group order summary calculation

## calculatePrice() Signature

```typescript
async function calculatePrice({
  printingType,  // 'DTG' | 'DTF'
  aabb_w_cm,
  aabb_h_cm,
  quantity,
  productId,
  color_name,    // 'White' | 'Black' — needed for shirt AND DTG print lookup
  size,          // 'S' | 'M' | 'L' | 'XL' | 'XXL' — needed for shirt lookup
}) {
  // 1. Determine print tier from design's rotated AABB
  const tier = getPrintTier(aabb_w_cm, aabb_h_cm);
  // '3x4in' | 'A5' | 'A4' | 'A3' | 'A2'

  // 2. Look up shirt price from shirt_pricing table
  // Matches: product_id + color_name + size + quantity bracket
  const shirt_row = await supabase
    .from('shirt_pricing')
    .select('price_per_unit_thb')
    .eq('product_id', productId)
    .eq('color_name', color_name)
    .eq('size', size)
    .lte('min_qty', quantity)
    .or(`max_qty.is.null,max_qty.gte.${quantity}`)
    .single();

  // 3. Look up print price from print_pricing table
  // DTG: matches type_code + size_tier + color_name + quantity bracket
  // DTF: matches type_code + size_tier + color_name=NULL + quantity bracket
  const print_row = await supabase
    .from('print_pricing')
    .select('price_per_unit_thb')
    .eq('type_code', printingType)
    .eq('size_tier', tier)
    .eq('color_name', printingType === 'DTG' ? color_name : null)
    .lte('min_qty', quantity)
    .or(`max_qty.is.null,max_qty.gte.${quantity}`)
    .single();

  // 4. Calculate totals
  const shirt_per_unit = shirt_row.data.price_per_unit_thb;
  const print_per_unit = print_row.data.price_per_unit_thb;
  const total_per_unit = shirt_per_unit + print_per_unit;

  return {
    tier,
    shirt_per_unit,
    print_per_unit,
    total_per_unit,
    total: total_per_unit * quantity,
    quantity,
  };
}
```

## Pricing Dimensions

| Dimension | shirt_pricing | print_pricing (DTG) | print_pricing (DTF) |
|---|---|---|---|
| Product type | ✅ per product | ✅ same for all | ✅ same for all |
| Color | ✅ White ≠ Black | ✅ White ≠ Black | ❌ no difference |
| Size | ✅ S/M/L/XL/XXL | ❌ no difference | ❌ no difference |
| Print tier | ❌ n/a | ✅ 3x4in/A5/A4/A3/A2 | ✅ 3x4in/A5/A4/A3/A2 |
| Qty discount | ✅ more = cheaper | ✅ more = cheaper | ✅ more = cheaper |
