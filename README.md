# Harsh Vardhan Dubey — Portfolio

An RPG "character sheet" themed portfolio. Pure HTML/CSS/JS — no build step, so it deploys straight to GitHub Pages.

## Sections

- **Character** — hero player card + about
- **Journey** — timeline of education, roles, and milestones
- **Skill Tree** — skills grouped by category
- **Quest Log** — projects (Viralyst, Grammarly for Hindi) with real GitHub links
- **Achievements Unlocked** — GATE CS 2025, dept rank, Google Cloud Ready, AICTE program
- **Snapshots** — photo gallery (placeholder frames, ready for your photos)
- **Connect** — GitHub, LinkedIn, email, FUSS Group

## 1. Add your photos to the gallery

Drop images into `assets/gallery/`, then in `index.html` find the `#snapshots` section and swap each:

```html
<span class="polaroid-frame"><span class="polaroid-icon">📷</span></span>
```

for:

```html
<span class="polaroid-frame"><img src="assets/gallery/your-photo.jpg" alt="Description"></span>
```

Update the caption text under each one too. Full instructions are also in `assets/gallery/README.txt`.

## 2. Other things you may want to tweak

- **Player card stat bars** (`#character`) — the four proficiency bars are a stylistic touch; adjust the `style="--fill:XX%"` values in `index.html` if you want different weighting.
- **Class rotator** — edit the `CLASSES` array at the top of `js/script.js`.
- **Resume link** — if you want a "Download résumé" button, add your PDF to `assets/` and link it from the hero or footer.
- **Colors/fonts** — CSS variables live at the top of `css/style.css` (`:root`).

## 3. Preview locally

Just open `index.html` in a browser. No server required.

## 4. Deploy to GitHub Pages

1. Create a repo on GitHub — name it `yourusername.github.io` for a root-domain URL, or anything else for a `/repo-name/` path.
2. Push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages** → Source: `Deploy from a branch` → branch `main`, folder `/ (root)` → Save.
4. Visit `https://yourusername.github.io` (or `.../repo-name/`) after a minute or two.

## 5. Optional next steps

- Add a custom domain via **Settings → Pages → Custom domain**.
- Add a résumé download button.
- Add more "side quests" (extra small project entries) following the existing `.side-quest` pattern in `#quests`.
