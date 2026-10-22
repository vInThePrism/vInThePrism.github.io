import type { DisplaySettingsConfig } from "../types/displaySettingsConfig";
import { resolveDisplaySettingsConfig } from "../utils/display-settings-utils";

// Display settings panel switches
// Controls which options appear in the visitor-facing settings panel
// so you can decide what visitors may change
// and preview effects while developing

export const displaySettingsConfig: DisplaySettingsConfig =
	resolveDisplaySettingsConfig({
		// ── Master switch ────────────────────────────────────

		// Master switch for the settings panel. When off, nothing below applies and the panel is hidden
		// When on, the panel and everything it depends on (option logic, icons, ...) ship to the browser,
		// which makes the build larger and adds JS to first load; when off, the panel isn't rendered at all and the build is smaller.
		// The wallpaper-mode switch is the biggest contributor to bundle size:
		// with it off, the switch is hidden and the wallpaper mode from backgroundWallpaper is always used;
		// with it on, every wallpaper mode's markup must be built so it can switch at runtime (about +33 KB per page, slower first load)

		// You can also enable it on your hosting platform (Vercel / Cloudflare, ...) with an environment variable
		// instead of editing this file: PUBLIC_DISPLAY_SETTINGS=true
		// The environment variable wins; if it's unset or unrecognized, the value here is used
		// Recommended: keep it off in production and only turn it on to preview changes
		enable: false,

		// ── Appearance ──────────────────────────────────

		// Theme color picker
		themeColorSwitchable: true,

		// Post list layout switch
		layoutSwitchable: true,

		// Card border and shadow switch
		cardBorderSwitchable: true,

		// Cards follow the theme color
		cardFollowThemeSwitchable: true,

		// ── Wallpaper ──────────────────────────────────

		// Wallpaper mode switch
		wallpaperModeSwitchable: true,

		// Fullscreen wallpaper layout switch (classic / hero)
		fullscreenLayoutSwitchable: true,

		// Wave animation switch
		wavesSwitchable: true,

		// Gradient transition switch
		gradientSwitchable: true,

		// Banner title switch
		bannerTitleSwitchable: true,

		// Wallpaper carousel switch
		bannerCarouselSwitchable: true,

		// Sliders for fullscreen / overlay wallpaper parameters
		// false hides every slider; use an object to control each one
		overlaySwitchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},

		// ── Effects ────────────────────────────────────

		// Sakura petals switch
		sakuraSwitchable: true,
	});
