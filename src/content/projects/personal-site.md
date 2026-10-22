---
title: "vInThePrism.github.io"
published: 2026-10-22
order: 100
description: "就是你现在看到的这个网站：Astro + Firefly，GitHub Pages 托管，笔记和仓库列表自动从 GitHub 同步。"
status: "published"
tags:
  - Astro
  - GitHub Actions
link:
  - label: "GitHub"
    icon: "fa7-brands:github"
    value: "https://github.com/vInThePrism/vInThePrism.github.io"
---

## 这个网站是怎么搭的

- **框架**：[Astro](https://astro.build) + [Firefly](https://github.com/CuteLeaf/Firefly) 主题
- **托管**：GitHub Pages，push 到 `main` 分支后由 GitHub Actions 自动构建部署
- **自动同步**：每天定时重建一次，期间会
  - 从笔记仓库拉取 Markdown，生成「学习」分类下的文章
  - 通过 GitHub API 拉取公开仓库列表，显示在「项目」页底部
