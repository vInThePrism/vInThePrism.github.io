---
title: "vInThePrism.github.io"
published: 2026-10-22
order: 100
description: "The site you're looking at: Astro + Firefly on GitHub Pages, with notes and the repo list synced automatically from GitHub."
status: "published"
tags:
  - Astro
  - GitHub Actions
link:
  - label: "GitHub"
    icon: "fa7-brands:github"
    value: "https://github.com/vInThePrism/vInThePrism.github.io"
---

## How this site is built

- **Framework**: [Astro](https://astro.build) with the [Firefly](https://github.com/CuteLeaf/Firefly) theme
- **Hosting**: GitHub Pages — every push to `main` is built and deployed by GitHub Actions
- **Automatic sync**: a scheduled rebuild runs every day and
  - pulls Markdown from my notes repo and turns it into posts in the *Learning* category
  - fetches my public repositories through the GitHub API and lists them at the bottom of the *Projects* page
