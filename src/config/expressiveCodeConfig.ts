import type { ExpressiveCodeConfig } from "../types/expressiveCodeConfig";

/**
 * Expressive Code settings
 * @see https://expressive-code.com/
 * Restart the Astro dev server after changing this file
 */

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Dark theme (dark mode)
	darkTheme: "one-dark-pro",

	// Light theme (light mode)
	lightTheme: "one-light",

	// More themes: see the Expressive Code documentation
	// https://expressive-code.com/guides/themes/

	// Collapsible code blocks
	pluginCollapsible: {
		enable: true, // enable collapsing
		lineThreshold: 15, // show the collapse button for blocks longer than 15 lines
		previewLines: 8, // lines shown while collapsed
		defaultCollapsed: true, // collapse long code blocks by default
	},

	// Language badge (language name in the top-right corner of a code block)
	pluginLanguageBadge: {
		// Enable the language badge
		enable: true,
	},

	// Language logo (language icon in the bottom-right corner of a code block)
	pluginLanguageLogo: {
		// Enable the language logo
		enable: false,
		// Logo color mode:
		//   "mono"     - single color, follows light/dark mode (default)
		//   "original" - each language's brand color (JS yellow, TS blue, ...)
		//   "theme"    - the code block foreground color
		//   "#ff6600"  - a custom hex color
		color: "mono",
		// Languages that never show a logo
		excludedLangs: [],
	},
};
