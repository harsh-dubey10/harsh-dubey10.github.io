# Portfolio — Harsh Vardhan Dubey

The personal portfolio of **Harsh Vardhan Dubey**, an M.Tech (CSE) researcher in the FUSS Group at
IIT Gandhinagar working on formal methods, systems, web security and compilers.

**Live:** [harsh-dubey10.github.io](https://harsh-dubey10.github.io)

## What's inside

A single-page site built with React, TypeScript and Tailwind, with three.js drawings throughout.

| Section | What it shows |
| :--- | :--- |
| **Hero** | Name, role and links on a night backdrop, with pen-sketch drawings in the margins |
| **About** | A "character sheet": portrait, bio, education, skills, links and achievements |
| **Experience** | A parchment map with torn WebGL paper edges, a timeline of roles and sketched navigation instruments |
| **Projects** | An inventor's notebook: project cards beside sketched gears, polyhedra and machines |
| **Contact** | Ways to get in touch |

### The sketches

All margin drawings are real 3D line geometry drawn by `SketchWorld.tsx` on a single WebGL canvas.
Each stroke is drawn twice with a slight wobble, like a quick pen sketch. The drawings drift at a
slower parallax than the page and turn as you scroll. The canvas is split into three "sheets",
each clipped to its own sections:

- **Night sheet** (Hero, About): pale ink on navy. A globe pinned on Gandhinagar, a node graph,
  a syntax tree, a padlock, orbit rings and star-chart crosses.
- **Map sheet** (Experience): sepia ink. A compass rose, a sextant and an island chart with a
  dashed route.
- **Notebook sheet** (Projects, Contact): meshing gears, Leonardo's aerial screw, polyhedra, an
  armillary and a swirl of tiny sketches.

The shapes live in `src/lib/sketch.ts`, so adding a drawing means writing a function that returns
line segments. Without WebGL the site falls back to a 2D background, and the motion respects
`prefers-reduced-motion`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and build a static site into dist/
```

Pushes to `main` are deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Structure

```
src/
  components/   Hero, Profile (About), Timeline (Experience), Work (Projects), Contact, Nav,
                SketchWorld (three.js sketches), PaperTear (WebGL torn paper), Reveal
  data/         content.ts — all text content: bio, education, skills, experience, projects, links
  lib/          sketch.ts (line drawings), sections.ts, webgl.ts
  hooks/        smooth scrolling, active section, scroll progress
public/
  profile.PNG, resume.pdf
```

To update content (projects, skills, achievements, links), edit `src/data/content.ts`. No component
changes are needed for new entries. Experience entries are in `src/components/Timeline.tsx`.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · three.js · Framer Motion · Lenis

Type: Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (labels).
