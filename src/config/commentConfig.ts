import type { CommentConfig } from "../types/commentConfig";

export const commentConfig: CommentConfig = {
	// Comment system: none, twikoo, waline, giscus, disqus or artalk. Default "none" disables comments
	type: "none",

	// Twikoo
	twikoo: {
		envId: "https://twikoo.vercel.app",
		// Twikoo UI language
		lang: "zh-CN",
		// Enable page-view counts
		visitorCount: true,
		// Twikoo script URL (CDN links work)
		// Mirror for mainland China 1: https://registry.npmmirror.com/twikoo/1.7.14/files/dist/twikoo.min.js
		// Mirror for mainland China 2: https://s4.zstatic.net/npm/twikoo@1.7.14/dist/twikoo.min.js
		// International: https://cdn.jsdelivr.net/npm/twikoo@1.7.14/dist/twikoo.min.js
		jsUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.14/dist/twikoo.min.js",
		// Custom Twikoo CSS URL; leave empty to load none
		cssUrl: "/assets/css/twikoo-custom.css",
	},

	// Waline
	waline: {
		// Waline server URL
		serverURL: "https://waline.vercel.app",
		// Waline UI language
		lang: "zh-CN",
		// Waline emoji sets
		emoji: [
			"https://unpkg.com/@waline/emojis@1.4.0/weibo",
			"https://unpkg.com/@waline/emojis@1.4.0/bilibili",
			"https://unpkg.com/@waline/emojis@1.4.0/bmoji",
		],
		// Login mode:
		//   'enable'  - default: anonymous comments plus third-party OAuth login, most compatible.
		//   'force'   - login required; anonymous comments disabled. Good for strict communities.
		//   'disable' - no login or OAuth at all; anonymous comments only (name/email). Minimal guestbook.
		login: "enable",
		// Enable page-view counts
		visitorCount: true,
	},

	// Artalk
	artalk: {
		// Artalk server API URL
		server: "https://artalk.example.com/",
		// Artalk UI language
		locale: "zh-CN",
		// Enable page-view counts
		visitorCount: true,
	},

	// Giscus (comments stored in GitHub Discussions; get the IDs at https://giscus.app)
	giscus: {
		// Repository (owner/repo)
		repo: "CuteLeaf/Firefly",
		// Repository ID
		repoId: "R_kgD2gfdFGd",
		// Discussion category
		category: "General",
		// Discussion category ID
		categoryId: "DIC_kwDOKy9HOc4CegmW",
		// How pages map to discussions
		mapping: "title",
		// Strict title matching
		strict: "0",
		// Enable reactions
		reactionsEnabled: "1",
		// Emit discussion metadata
		emitMetadata: "1",
		// Comment box position
		inputPosition: "top",
		// UI language
		lang: "zh-CN",
		// Loading strategy
		loading: "lazy",
	},

	// Disqus
	disqus: {
		// Disqus shortname
		shortname: "firefly",
	},
};
