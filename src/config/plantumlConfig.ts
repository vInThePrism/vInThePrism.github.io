import type { PlantUMLConfig } from "../types/plantumlConfig";

/**
 * PlantUML diagram rendering
 *
 * Controls how `plantuml` code blocks in Markdown are encoded at build time
 * and rendered in the browser as SVG from a PlantUML server. Supports light/dark themes and self-hosted servers.
 *
 * @see https://plantuml.com/zh/theme
 * @see https://plantuml.com/zh/server
 */
export const plantumlConfig: PlantUMLConfig = {
	/**
	 * Enable PlantUML rendering.
	 * When off, `plantuml` blocks fall back to plain syntax highlighting via Expressive Code.
	 */
	enable: true,

	/**
	 * PlantUML server URL (a trailing slash is optional and normalized automatically).
	 * Defaults to the public server; for sensitive content, run your own (e.g. the
	 * `plantuml/plantuml-server` Docker image) and put its URL here.
	 */
	server: "https://www.plantuml.com/plantuml",

	/**
	 * Theme injected into PlantUML source in light mode (as `!theme <name>`).
	 * An empty string injects no theme and uses PlantUML's default look.
	 */
	lightTheme: "",

	/**
	 * Theme injected into PlantUML source in dark mode (as `!theme <name>`).
	 * An empty string injects no theme; defaults to the built-in dark `cyborg` theme.
	 */
	darkTheme: "cyborg",
};
