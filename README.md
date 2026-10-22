# vInThePrism.github.io 🌸

V's personal site: study notes, thoughts and life → **https://vintheprism.github.io**

Built with [Astro](https://astro.build) and the [Firefly](https://github.com/CuteLeaf/Firefly) theme, hosted on GitHub Pages. Every push to `main` deploys automatically.

---

## ✍️ Publishing

| What | Where | Minimum frontmatter |
|---|---|---|
| **Study notes** | Push to [`vInThePrism/notes`](https://github.com/vInThePrism/notes) — synced daily (or trigger manually, see below) | None. The title comes from the first `#` heading, the date from the git history |
| **Longer posts** | `src/content/posts/xxx.md` | `title`, `published`, `category: Learning` / `Thoughts` / `Life` |
| **Short updates** | `src/content/dynamic/2026-10-22-xxx.md` | `published: 2026-10-22 20:00:00` |
| **Photo albums** | Images in `public/gallery/<album-id>/`, then add an entry in `src/config/galleryConfig.ts` | — |
| **Projects** | `src/content/projects/xxx.md` | `title`, `published` (GitHub repos appear on the Projects page automatically) |

Full post template:

```markdown
---
title: Post title
published: 2026-10-22
description: One-line summary shown in the post list
category: Thoughts      # Learning / Thoughts / Life
tags: [CUDA, Essay]
image: ./cover.webp     # optional cover image next to the post
pinned: false
draft: false            # true = not published
series: ""              # optional: group posts into a series
seriesOrder: 1
---

Body…
```

**Three easy ways to post**

1. **GitHub web UI**: open `src/content/posts/` → *Add file* → *Create new file*, paste the template, commit. Live in about two minutes.
2. **Phone**: the same flow in the GitHub mobile app.
3. **Locally**: `pnpm new-post my-post`, write, `git push`.

Markdown extras: callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`), math (`$...$`, `$$...$$`), Mermaid diagrams, and GitHub repo cards (`::github{repo="vInThePrism/notes"}`).

---

## 🔄 How syncing works

`.github/workflows/deploy.yml` rebuilds the site when:

- something is pushed to `main`
- **every day at 13:17 UTC (about 8 AM Chicago)**
- you click *Actions → Deploy to GitHub Pages → Run workflow*

Each build runs:

- `scripts/sync-notes.ts` — turns Markdown from the notes repo into *Learning* posts (directory names become tags, e.g. `gpu/` → `GPU`). The root `README.md` and anything starting with `_` or `.` is skipped.
- `scripts/sync-github-repos.ts` — fetches public repos from the GitHub API for the Projects page.

### ⚠️ The notes repo is private and needs a token

The build can't read `vInThePrism/notes` while it's private. Pick one:

- **Make the notes repo public** (simplest): *notes → Settings → Danger Zone → Change visibility*.
- **Keep it private and add a read-only token**:
  1. Go to https://github.com/settings/personal-access-tokens/new
  2. *Repository access* → *Only select repositories* → `vInThePrism/notes`
  3. *Permissions → Contents* → *Read-only*; generate and copy it
  4. In this repo: *Settings → Secrets and variables → Actions → New repository secret*, name it `NOTES_TOKEN`

### Rebuild immediately after pushing notes (optional)

Add `.github/workflows/notify-site.yml` to `vInThePrism/notes`, and give the notes repo a token with *Contents: Read and write* on this repo (secret name `SITE_TOKEN`):

```yaml
name: Notify site
on: { push: { branches: [main] } }
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sS -X POST \
            -H "Authorization: Bearer ${{ secrets.SITE_TOKEN }}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/vInThePrism/vInThePrism.github.io/dispatches \
            -d '{"event_type":"notes-updated"}'
```

Without it, notes still sync once a day.

---

## 🎨 Customizing

Everything lives in `src/config/`:

| Change | File | Field |
|---|---|---|
| Theme color | `siteConfig.ts` | `themeColor.hue` (currently 345, sakura pink) |
| Site language | `siteConfig.ts` | `resolveSiteLang("en")` |
| Wallpaper mode / image | `backgroundWallpaper.ts` | `mode` (currently `overlay`), `src` |
| Sidebar | `sidebarConfig.ts` | `position` (currently `left`) |
| Post list | `siteConfig.ts` | `postListLayout.defaultMode` (`list` / `grid`) |
| Avatar, bio | `profileConfig.ts` | |
| Top navigation | `navBarConfig.ts` | |
| Announcement | `announcementConfig.ts` | |
| Comments (Giscus) | `commentConfig.ts` | see the [Firefly docs](https://docs-firefly.cuteleaf.cn/) |

The wallpaper is a generated sakura gradient in `src/assets/images/wallpaper/`; swap in any image you like.

## 💻 Local preview

Requires Node.js ≥ 22 and pnpm:

```bash
pnpm install
pnpm dev                         # http://localhost:4321
NOTES_DIR=../notes pnpm build    # full build including a local clone of the notes repo
```

---

Theme: [Firefly](https://github.com/CuteLeaf/Firefly) by CuteLeaf, based on [Fuwari](https://github.com/saicaca/fuwari), MIT License. The *CUDA Kernel Handbook* series is adapted from [Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples) (MIT License).
