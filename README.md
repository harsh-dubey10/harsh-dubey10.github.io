# Harsh Vardhan Dubey — Portfolio

React + TypeScript + Tailwind rebuild of the personal portfolio. Built to reproduce the
**design language and interaction patterns** of shubhamgl.com (scroll-triggered reveals,
an interactive tab-driven timeline, link-tile contact section, scroll-spy nav) with an
entirely original visual identity and all-new content — no source code, copy, or assets
from the reference site.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static `dist/` folder you can
deploy anywhere (GitHub Pages, Vercel, Netlify, etc).

## Design system

**Concept.** A "spec sheet / field log" identity — instrument-panel brass on deep indigo —
fitted to a systems & NLP researcher's actual work, rather than the reference's fantasy-quest
skin.

- **Color** — `ink` (#0B0F1A background family), `brass` (#D9A54A, primary accent),
  `signal` (#6FCF97, status indicator), `wire` (#6C93C7, links). One accent used sparingly,
  everything else neutral, per `tailwind.config.ts`.
- **Type** — Fraunces (display serif, used only for names/headings), IBM Plex Sans (body),
  IBM Plex Mono (labels, dates, tags, nav) — a three-tier system distinct from the reference's
  faces.
- **Spacing/layout** — single centered content rail (`max-w-rail` = 960px), ~100px vertical
  rhythm between sections, dense card padding.
- **Signature interaction** — the hero's role line is a typewriter effect cycling through
  three descriptors, and the Field Log section uses real click-to-expand tabs (state in
  `Timeline.tsx`) rather than a static list.
- **Motion** — `Reveal.tsx` wraps sections in a `framer-motion` `whileInView` fade/rise;
  project cards get a subtle cursor-tracked 3D tilt; a scroll progress bar runs along the
  top edge.
- **Accessibility** — visible focus rings (`index.css`), `prefers-reduced-motion` respected,
  semantic headings throughout.

## Structure

```
src/
  components/   Nav, Hero, Profile, Timeline, Work, Gallery, Contact, Reveal, ScrollProgress
  hooks/        useScrollProgress, useActiveSection, useTypewriter
  data/         content.ts — all real content lives here, typed via types.ts
public/
  profile.jpg, resume.pdf
```

To update content (experience, projects, skills, links), edit `src/data/content.ts` only —
no component changes needed for new entries.
