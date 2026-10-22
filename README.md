# vInThePrism.github.io 🌸

V's personal site: study notes, thoughts and life → **https://vintheprism.github.io**

Built with [Astro](https://astro.build) and the [Firefly](https://github.com/CuteLeaf/Firefly) theme, hosted on GitHub Pages. Every push to `main` deploys automatically.

---

## ✍️ Publishing, editing and deleting

### In the browser (recommended)

| Editor | Edits | URL |
|---|---|---|
| **Site editor** | Posts (Learning / Thoughts / Life), Updates, Projects, the About page | https://vintheprism.github.io/admin/ |
| **Notes editor** | Notes in [`vInThePrism/notes`](https://github.com/vInThePrism/notes), which feed the *Learning* section | https://vintheprism.github.io/admin/notes/ |

Both are [Sveltia CMS](https://github.com/sveltia/sveltia-cms): you can create, edit and delete entries, upload images, and preview Markdown. Every save is a commit, so nothing is lost and anything can be reverted from the git history.

**One-time sign-in setup**

1. Open the editor and click **Sign In with Token**. It links to GitHub's token page.
2. Create a *fine-grained* token: *Repository access* → *Only select repositories* → `vInThePrism.github.io` **and** `vInThePrism/notes`; *Permissions* → *Contents: Read and write*.
3. Paste the token. It's stored only in that browser; nobody else can sign in without write access to your repos.

Site edits go live about two minutes after saving. Notes appear on the next daily rebuild, or right away if you run *Actions → Deploy to GitHub Pages → Run workflow*.

### Other ways

| What | Where | Minimum frontmatter |
|---|---|---|
| **Study notes** | Push to `vInThePrism/notes` | None. Title from the first `#` heading, date from git |
| **Posts** | `src/content/posts/xxx.md` | `title`, `published`, `category: Learning` / `Thoughts` / `Life` |
| **Updates** | `src/content/dynamic/2026-10-22-xxx.md` | `published: 2026-10-22 20:00:00` |
| **Photo albums** | Images in `public/gallery/<album-id>/`, plus an entry in `src/config/galleryConfig.ts` | — |
| **Projects** | `src/content/projects/xxx.md` | `title`, `published` |

Post template:

```markdown
---
title: Post title
published: 2026-10-22
description: One-line summary shown in the post list
category: Thoughts      # Learning / Thoughts / Life
tags: [CUDA, Essay]
image: ./cover.webp     # optional cover image
pinned: false
draft: false            # true = hidden from the site
---

Body…
```

To delete something without the editor, delete the file on GitHub (or locally and push). Markdown extras: callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`), math (`$...$`, `$$...$$`), Mermaid diagrams, and GitHub repo cards (`::github{repo="vInThePrism/notes"}`).

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

Theme: [Firefly](https://github.com/CuteLeaf/Firefly) by CuteLeaf, based on [Fuwari](https://github.com/saicaca/fuwari), MIT License.
