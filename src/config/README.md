# Configuration

Every Firefly setting lives in this folder. Each file covers one feature.

## 📁 Files

```
src/config/
├── index.ts                  # Barrel - re-exports everything
├── siteConfig.ts             # Core site settings
├── analyticsConfig.ts        # Analytics (Google Analytics, Umami, 51la, ...)
├── announcementConfig.ts     # Announcement widget
├── backgroundWallpaper.ts    # Wallpaper
├── commentConfig.ts          # Comment system
├── coverImageConfig.ts       # Post cover images
├── displaySettingsConfig.ts  # Visitor-facing settings panel
├── dynamicConfig.ts          # Updates page
├── effectsConfig.ts          # Visual effects (sakura, ...)
├── expressiveCodeConfig.ts   # Code highlighting
├── fontConfig.ts             # Fonts
├── friendsConfig.ts          # Friend links
├── galleryConfig.ts          # Photo albums
├── licenseConfig.ts          # Post license
├── musicConfig.ts            # Music player
├── navBarConfig.ts           # Navbar (including LinkPresets)
├── pioConfig.ts              # Mascot (Spine, Live2D)
├── mermaidConfig.ts          # Mermaid diagrams
├── plantumlConfig.ts         # PlantUML diagrams
├── profileConfig.ts          # Profile
├── sidebarConfig.ts          # Sidebar layout
├── sponsorConfig.ts          # Sponsor page
└── README.md                 # This file
```

## 🚀 Usage

### Recommended: import from the barrel

```typescript
import { siteConfig, profileConfig } from "@/config";
```

### Or import a single config

```typescript
import { siteConfig } from "@/config/siteConfig";
import { profileConfig } from "@/config/profileConfig";
```

## 📋 What each file controls

| File | Controls |
|------|------|
| `siteConfig.ts` | Title, description, language, theme color, page width, post list and post page options |
| `analyticsConfig.ts` | Google Analytics, Microsoft Clarity, Umami, 51la |
| `announcementConfig.ts` | Announcement title, text, link |
| `backgroundWallpaper.ts` | Wallpaper mode, images, banner text, waves |
| `commentConfig.ts` | Twikoo, Waline, Artalk, Giscus, Disqus |
| `coverImageConfig.ts` | Post covers, random cover API |
| `displaySettingsConfig.ts` | Settings panel master switch and per-option switches |
| `dynamicConfig.ts` | Updates page title, description, comments, page size |
| `effectsConfig.ts` | Sakura petals: count, speed, size |
| `expressiveCodeConfig.ts` | Code themes, collapsing, language badges |
| `fontConfig.ts` | Font list, fallbacks, preloading |
| `friendsConfig.ts` | Friend links and page options |
| `galleryConfig.ts` | Albums, masonry column width |
| `licenseConfig.ts` | CC license shown on posts |
| `musicConfig.ts` | Meting API or local playlist, navbar/sidebar switches |
| `navBarConfig.ts` | Navbar links, LinkPresets, search |
| `pioConfig.ts` | Spine and Live2D models |
| `plantumlConfig.ts` | PlantUML rendering |
| `profileConfig.ts` | Avatar, name, social links |
| `sidebarConfig.ts` | Left/right/mobile widget lists |
| `sponsorConfig.ts` | Payment methods, sponsor list |

## 📝 Notes

- Everything can be imported through `index.ts`
- Each config has its own type definition under `types/`
- `siteConfig.ts` holds only core site info and doesn't aggregate other modules
- `LinkPresets` at the bottom of `navBarConfig.ts` sets the name, icon and URL of each navbar link
- The settings panel in `displaySettingsConfig.ts` is off by default. Besides setting `enable`, you can turn it on with the environment variable `PUBLIC_DISPLAY_SETTINGS=true` on your hosting platform; the variable takes precedence (`true/1/on/yes` on, `false/0/off/no` off)
