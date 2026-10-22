# vInThePrism.github.io 🌸

V 的个人网站：学习笔记、思考和生活。→ **https://vintheprism.github.io**

基于 [Astro](https://astro.build) + [Firefly](https://github.com/CuteLeaf/Firefly) 主题，GitHub Pages 托管，push 到 `main` 后自动部署。

---

## ✍️ 怎么发内容

| 想发什么 | 放在哪里 | 最少要写的 frontmatter |
|---|---|---|
| **学习笔记** | 直接 push 到 [`vInThePrism/notes`](https://github.com/vInThePrism/notes)，网站每天自动同步（也可手动触发，见下文） | 不需要，标题取第一个 `#` 标题，日期取 git 提交时间 |
| **思考 / 生活长文** | `src/content/posts/xxx.md` | `title`、`published`、`category: 思考` 或 `category: 生活` |
| **碎碎念（动态）** | `src/content/dynamic/2026-10-22-xxx.md` | `published: 2026-10-22 20:00:00` |
| **相册** | 图片放 `public/gallery/<相册id>/`，再在 `src/config/galleryConfig.ts` 加一项 | — |
| **项目** | `src/content/projects/xxx.md` | `title`、`published`（GitHub 仓库会自动出现在项目页底部，不用手写） |

一篇文章的完整模板：

```markdown
---
title: 文章标题
published: 2026-10-22
description: 一句话简介（显示在列表里）
category: 思考        # 学习 / 思考 / 生活
tags: [CUDA, 随笔]
image: ./cover.webp   # 可选，封面图放在文章旁边
pinned: false         # 置顶
draft: false          # true = 不发布
---

正文……
```

**最省事的三种发法：**

1. **GitHub 网页**：在仓库里进入 `src/content/posts/` → *Add file* → *Create new file*，粘贴上面的模板，提交即发布（约 2 分钟后上线）。
2. **手机**：用 GitHub App 同样操作。
3. **本地**：`pnpm new-post 文件名` 生成模板，写完 `git push`。

Markdown 里还可以用：提示块 `> [!NOTE]` / `> [!TIP]` / `> [!WARNING]`，数学公式 `$...$` / `$$...$$`，Mermaid 图，以及 GitHub 仓库卡片 `::github{repo="vInThePrism/notes"}`。

---

## 🔄 自动同步是怎么工作的

`.github/workflows/deploy.yml` 会在三种情况下重建网站：

- push 到 `main`
- **每天 UTC 13:17（芝加哥早上 8 点左右）定时重建**
- 在 *Actions → Deploy to GitHub Pages → Run workflow* 手动触发

每次构建会运行：

- `scripts/sync-notes.ts`：把笔记仓库的 Markdown 转成「学习」分类的文章（目录名会变成标签，如 `gpu/` → `GPU`）。根目录 `README.md`、以 `_` 或 `.` 开头的文件和目录会被跳过。
- `scripts/sync-github-repos.ts`：通过 GitHub API 拉取公开仓库列表，显示在「项目」页底部。

### ⚠️ 笔记仓库是私有的，需要一个 token

`vInThePrism/notes` 目前是私有仓库，网站构建时默认读不到它。二选一：

- **把笔记仓库改成公开**（最简单）：*notes → Settings → Danger Zone → Change visibility*。
- **保持私有，配一个只读 token**：
  1. 打开 https://github.com/settings/personal-access-tokens/new
  2. *Repository access* 选 *Only select repositories* → `vInThePrism/notes`
  3. *Permissions → Contents* 选 *Read-only*，生成并复制
  4. 本仓库 *Settings → Secrets and variables → Actions → New repository secret*，名字填 `NOTES_TOKEN`

### 笔记 push 后想立刻更新网站（可选）

在 `vInThePrism/notes` 里加 `.github/workflows/notify-site.yml`，并给 notes 仓库配一个对本仓库有 *Contents: Read and write* 权限的 token（secret 名 `SITE_TOKEN`）：

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

不配也没关系，每天会自动同步一次。

---

## 🎨 改外观

所有外观都在 `src/config/` 里：

| 想改什么 | 文件 | 字段 |
|---|---|---|
| 主题色 | `siteConfig.ts` | `themeColor.hue`（当前 345 樱花粉） |
| 壁纸模式 / 图片 | `backgroundWallpaper.ts` | `mode`（当前 `overlay`）、`src` |
| 侧边栏 | `sidebarConfig.ts` | `position`（当前 `left`） |
| 文章列表 | `siteConfig.ts` | `postListLayout.defaultMode`（`list` / `grid`） |
| 头像、简介 | `profileConfig.ts` | |
| 顶部导航 | `navBarConfig.ts` | |
| 公告 | `announcementConfig.ts` | |
| 评论（Giscus） | `commentConfig.ts` | 见 [Firefly 文档](https://docs-firefly.cuteleaf.cn/) |

壁纸是自己生成的樱花渐变图，在 `src/assets/images/wallpaper/`，换成任何图片都可以。

## 💻 本地预览

需要 Node.js ≥ 22 和 pnpm：

```bash
pnpm install
pnpm dev            # http://localhost:4321
NOTES_DIR=../notes pnpm build   # 带上本地的笔记仓库完整构建
```

---

主题：[Firefly](https://github.com/CuteLeaf/Firefly) by CuteLeaf，基于 [Fuwari](https://github.com/saicaca/fuwari)，MIT License。
