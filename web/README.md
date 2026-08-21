# Snailtechs Academy website

Premium marketing site for **Snailtechs Academy** — a practical UX/UI and product design school with campuses in Chennai, Coimbatore, Pondicherry, plus online learning.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router

## Scripts

```bash
cd web
npm install
npm run dev      # http://127.0.0.1:5173
npm run build
npm run preview  # http://127.0.0.1:4173
npm run lint
```

## Editing content

Keep copy and numbers in `src/data/`:

| File | What to change |
|------|----------------|
| `site.ts` | Brand, phone, email, social URLs |
| `courses.ts` | Programme list |
| `locations.ts` | Campuses |
| `pricing.ts` | Fees, GST, EMI — set numbers or leave `null` for `₹XX,XXX` |
| `mentors.ts` | Mentor profiles |
| `projects.ts` | Student work |
| `batches.ts` | Upcoming batches |
| `testimonials.ts` | Verified quotes only |
| `faq.ts` | FAQs |
| `curriculum.ts` | Modules |

Do not invent placement rates, salaries or hiring partners.
