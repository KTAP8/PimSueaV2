# Group Order Rules

Group Orders are a Phase 2 feature. Do not implement until T01–T28 (MVP) are complete.

## Flow

```
Organizer (logged in)
  → designs shirt
  → clicks "สร้าง Group Order"
  → sets deadline + optional min quantity
  → gets shareable link: pimsua.co/group/[6-char share_code]
  → shares to LINE group

Member clicks link (no login required)
  → opens in LINE browser
  → submits: name, phone, size, color preference
  → after deadline: group closes automatically (Edge Function)
  → unit price calculated and written to each submission
  → each member gets their own PromptPay QR for their share
  → admin confirms each member's payment individually
  → organizer places master order once all paid
```

## Anomaly Detection on Submissions

| Condition | Action |
|---|---|
| Same phone number submitted twice | `is_flagged = true`, `flag_reason = 'Duplicate phone'` |
| Submission after deadline | Reject at API level (hard reject) |
| Same name submitted twice | Warn organizer (soft flag only) |

## Route

`/group/[shareCode]` — public, no auth required.
