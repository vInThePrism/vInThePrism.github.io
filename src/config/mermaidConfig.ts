import type { MermaidConfig } from "../types/mermaidConfig";

/**
 * Mermaid diagram rendering
 *
 * Mermaid code blocks are rendered to static SVG at build time with merman,
 * with light and dark themes switched automatically via CSS.
 *
 * @see https://github.com/Latias94/merman
 */
export const mermaidConfig: MermaidConfig = {
	/**
	 * Light-mode theme.
	 * Options: editor-light, gruvbox-light, ayu-light.
	 */
	lightTheme: "editor-light",

	/**
	 * Dark-mode theme.
	 * Options: editor-dark, one-dark, gruvbox-dark, ayu-dark.
	 */
	darkTheme: "editor-dark",
};
