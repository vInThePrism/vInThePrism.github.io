/**
 * Font configuration (single entry point)
 *
 * Every font setting lives in this file:
 *   see the Astro docs for details: https://docs.astro.build/en/guides/fonts
 * - fonts: Astro Font API definitions (download, cache and optimized loading are automatic)
 * - fontConfig: which fonts are used, globally and per area
 *
 * To add a font, edit only this file:
 * 1. add a definition to the fonts array below
 * 2. reference its cssVariable from fontConfig.selected or one of the area fields
 *
 * Supported providers: https://docs.astro.build/en/reference/font-provider-reference/#built-in-providers
 *   "google"     - Google Fonts
 *   "fontsource" - Fontsource
 *   "local"      - local font files
 *   "bunny"      - Bunny Fonts
 *   "fontshare"  - Fontshare
 *   "npm"        - npm packages (e.g. @fontsource/*)
 *
 * Subsetting local fonts: add an entry for the cssVariable in fontConfig.subsetFonts,
 * and a build script scans the pages' characters and writes a small woff2 subset.
 */
import type { FontDefinition, FontSelectionConfig } from "@/types/fontConfig";

// ─── Astro Font API definitions ───────────────────────────────
// Font definitions for the Astro Font API (download, cache and optimized loading are automatic)
// In local development, restart the dev server after every change
export const fontsList: FontDefinition[] = [
	{
		name: "Zen Maru Gothic",
		cssVariable: "--font-zen-maru-gothic",
		provider: "fontsource",
		weights: ["300", "400", "500", "600", "700"],
		styles: ["normal"],
		subsets: ["latin", "cyrillic"],
		fallbacks: ["sans-serif"],
	},
	{
		name: "Inter",
		cssVariable: "--font-inter",
		provider: "fontsource",
		weights: ["300", "400", "500", "600", "700"],
		styles: ["normal"],
		subsets: ["latin", "cyrillic"],
		fallbacks: ["sans-serif"],
	},
	{
		name: "JetBrains Mono",
		cssVariable: "--font-jetbrains-mono",
		provider: "fontsource",
		weights: ["400", "700"],
		styles: ["normal"],
		subsets: ["latin", "cyrillic"],
		fallbacks: [
			"ui-monospace",
			"SFMono-Regular",
			"Menlo",
			"Monaco",
			"Consolas",
			"Liberation Mono",
			"Courier New",
			"monospace",
		],
	},
	// ─── Local font example ───
	// Steps:
	// 1. Put the TTF/OTF/WOFF2 files in public/assets/fonts/
	// 2. Fill in the font details following the example below
	// 3. Reference the cssVariable from fontConfig.selected or an area field
	{
		name: "GreatVibes Regular 2",
		cssVariable: "--font-greatvibes",
		provider: "local",
		options: {
			variants: [
				{
					src: ["./public/assets/fonts/GreatVibes-Regular-2.otf"],
				},
			],
		},
		fallbacks: ["sans-serif"],
	},
];

// ─── Font selection and per-area overrides ─────────────────────────────────────
export const fontConfig: FontSelectionConfig = {
	// Enable custom fonts
	enable: true,
	// CSS variable of the selected font (the cssVariable of an entry in fonts above)
	// Use "system" for system fonts (no custom fonts are loaded)
	selected: ["system"],

	// Per-area fonts (a cssVariable from fonts above; leave empty to use the global selection)
	// e.g. bannerTitleFont: "--font-inter" uses Inter for the home banner title
	// Home banner title font
	bannerTitleFont: "--font-zen-maru-gothic",
	// Home banner subtitle font
	bannerSubtitleFont: "--font-inter",
	// Navbar title font
	navbarTitleFont: "",
	// Code font (syntax highlighting and monospace text)
	codeFont: "--font-jetbrains-mono",

	// Local font subsetting (handled at build time by scripts/subset-fonts.ts)
	// key: a cssVariable from the fonts array; value: subsetting options
	subsetFonts: {
		"--font-greatvibes": {
			// Extra characters to include
			extraChars: "",
		},
	},
};
