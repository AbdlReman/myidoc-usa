# MYiDocUSA — Website (Next.js + TypeScript)

Home page built from the final MyiDoc design: deep blue `#1D4E89`, lavender accents, gold booking buttons,
Plus Jakarta Sans headings and Source Sans 3 body text.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node.js 18.18+ (20 or 22 recommended).

## Where to edit

| What | File |
|---|---|
| All text, links, doctor info, reviews, articles | `lib/content.ts` |
| Colors, spacing, fonts (CSS variables at the top) | `app/globals.css` |
| Page title / SEO description | `app/layout.tsx` |
| Section order | `app/page.tsx` |

## Adding your photos

1. Put images in `public/images/` (e.g. `hero-doctor.jpg`, `dr-naqvi.jpg`, `blog-1.jpg`).
2. In `lib/content.ts` set the paths, e.g. `hero.image = "/images/hero-doctor.jpg"`,
   `doctor.image = "/images/dr-naqvi.jpg"`, and each article's `image`.
3. Placeholders disappear automatically; images are optimized by `next/image` (AVIF/WebP, lazy-loaded).

## Logo

`components/Logo.tsx` contains a placeholder mark. Replace it with your real logo
(e.g. `<Image src="/logo.svg" alt="MYiDocUSA" width={180} height={40} />`).

## Newsletter / subscriber emails

`components/Newsletter.tsx` and `components/SubscribePopup.tsx` both post to `/api/subscribe`,
which saves a `Lead`, sends a welcome email immediately, and schedules the Day 2/5/9 follow-ups.
The success message appears inline under the Subscribe button — see `docs/ADMIN_GUIDE.md` for
how to edit templates/flow timing from `/admin`.

## Performance

- Static page (prerendered at build time) — no client data fetching.
- Fonts self-hosted via `next/font` (no layout shift, no Google request at runtime).
- Only three small client components (mobile menu, testimonial carousel, newsletter form); everything else is a server component.
- No CSS framework or icon library — a single hand-written stylesheet and inline SVG icons.

## Deploy

Push to GitHub and import into Vercel, or run `npm run build && npm start` on any Node host.
