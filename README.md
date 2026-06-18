# HRDW — Harrison R. Whelan · Portfolio

A dark, cinematic, interactive portfolio rebuilt from the `HRDW` brand and inspired by
[hrdwmedia.com](https://www.hrdwmedia.com) and the Awwwards-tier director/editor portfolios
in your reference document.

No build step, no dependencies. Plain HTML/CSS/JS — open it and it runs.

```
HRDW-Portfolio/
├── index.html        # structure & content
├── styles.css        # full design system
├── script.js         # interactions (incl. Vimeo lightbox)
├── netlify.toml       # Netlify hosting config (caching + headers)
├── assets/
│   ├── hrdw-logo-white.png / hrdw-logo-black.png
│   ├── headshot-blossom.png   (hero background + About portrait)
│   └── thumbs/                (Vimeo thumbnails for the work grid)
└── README.md
```

## View it locally

```bash
cd "HRDW-Portfolio"
python3 -m http.server 8080
# open http://localhost:8080
```

## Real Vimeo work

The work grid is populated with 12 real films pulled from
[vimeo.com/harrisonwhelan](https://vimeo.com/harrisonwhelan). Tiles show the real Vimeo
thumbnail; **clicking a tile opens an in-page lightbox with the embedded Vimeo player**
(loads on demand — fast, no dozen autoplaying iframes). The Show Reel section plays the
Narrative Demo Reel the same way.

### Add / replace a project
1. Grab the numeric Vimeo ID from the video URL (`vimeo.com/**1202271190**`).
2. Save its thumbnail as `assets/thumbs/<ID>.jpg` (the Vimeo "thumbnail_large" works well).
3. Copy a tile in `index.html` and set the ID + text:

```html
<article class="tile" data-cat="commercial" data-vimeo="1103943424"
         data-title="The Future Starts at Home" data-cursor="WATCH ▶">
  <div class="tile__media">
    <img src="assets/thumbs/1103943424.jpg" alt="The Future Starts at Home" loading="lazy" />
    <span class="tile__play" aria-hidden="true"></span>
  </div>
  <div class="tile__body">
    <span class="tile__cat">Commercial · Spot</span>
    <h3 class="tile__title">The Future Starts at Home</h3>
    <span class="tile__year">2025</span>
  </div>
</article>
```

- **`data-cat`** must match a filter button: `ai`, `commercial`, `music`, `doc`, `narrative`, `corporate`.
- Add `tile--lg` to the `class` to make a tile span two columns.
- That's it — `script.js` auto-wires any element with `data-vimeo` to the lightbox.

## Deploy to Netlify

`netlify.toml` is already set up (publish root = the folder, long-cache for `/assets`,
revalidate for HTML/CSS/JS, basic security headers). Pick one:

### Option A — Drag & drop (fastest, zero setup)
1. Go to **app.netlify.com/drop** while logged into your account.
2. Drag the whole `HRDW-Portfolio` folder onto the page.
3. Live in ~10 seconds on a `*.netlify.app` URL. Rename the site and add a custom
   domain under **Site configuration → Domain management**.

### Option B — Git + continuous deploy (best for ongoing edits)
1. Put this folder in a Git repo and push to GitHub/GitLab.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
3. Build command: *(leave blank)* · Publish directory: `.` — then **Deploy**.
   Every push redeploys automatically.

### Option C — Netlify CLI
```bash
npm install -g netlify-cli      # one-time
cd "HRDW-Portfolio"
netlify login                   # opens your browser
netlify deploy                  # draft preview URL
netlify deploy --prod           # publish to production
```

> Note: your existing "Sinu" site is a separate Netlify site — this deploys as a **new
> site** under the same account, so it won't touch Sinu.

## Manage on GitHub (via GitHub Desktop)

This folder is already a Git repo (`main` branch, initial commit). To put it on GitHub:

1. Install **GitHub Desktop** from [desktop.github.com](https://desktop.github.com) and sign in
   (create a free GitHub account if you don't have one).
2. **File → Add Local Repository…** → choose this folder (`HRDW-Portfolio`).
3. Click **Publish repository** (top bar). Name it e.g. `hrdw-portfolio`,
   **uncheck "Keep this code private"** for a public repo, then **Publish**.

To update later: edit files → GitHub Desktop lists the changes → write a short summary →
**Commit to main** → **Push origin**.

> The project lives on an external SD card, so the drive must be plugged in to commit/push.

### Auto-deploy from GitHub → Netlify (optional)
Once it's on GitHub, connect it for hands-off deploys: Netlify → **Add new site → Import an
existing project** → pick the repo → build command *(blank)*, publish directory `.`. Every
push to `main` then redeploys automatically. (`netlify.toml` is already in the repo.)

---

Built to drop onto any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
Nothing to install.
