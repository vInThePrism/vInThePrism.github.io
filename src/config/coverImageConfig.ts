import type { CoverImageConfig } from "../types/coverImageConfig";

/**
 * Post cover image settings
 *
 * enableInPost - show the cover image on the post page
 * enableInPostOverlay - overlay the title and metadata on top of the cover
 * showLoading - show a loading animation for the cover image
 *
 * Random cover images:
 * 1. Add image: "api" to a post's frontmatter to use a random cover
 * 2. Each configured API is tried in order; if all fail, the LQIP stays and an error is shown
 *
 * // Example post frontmatter:
 * ---
 * title: Post title
 * image: "api"
 * ---
 */
export const coverImageConfig: CoverImageConfig = {
	// Show the cover image on the post page
	enableInPost: true,

	// Overlay the title and metadata on top of the cover
	enableInPostOverlay: false,

	// Show a spinner while loading (replaces the LQIP placeholder)
	showLoading: false,

	randomCoverImage: {
		// Enable random cover images
		enable: false,
		// Cover image API list
		apis: [
			"https://t.alcy.cc/pc",
			"https://www.dmoe.cc/random.php",
			"https://uapis.cn/api/v1/random/image?category=acg&type=pc",
		],
	},
};
