import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// Bookmarks page settings
export const booknavPageConfig: BooknavPageConfig = {
	// Page title; leave empty to use the i18n translation
	title: "",

	// Page description; leave empty to use the i18n translation
	description: "",

	// Automatic favicons
	favicon: {
		// Fetch the target site's favicon when a bookmark has no icon
		enabled: true,

		// Favicon API URL; {domain} is replaced with the target site's domain
		// Any API works as long as the URL contains {domain}, for example:
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// Bookmarks
// Each array item is a group; its items are the bookmarks in that group
export const booknavConfig: BooknavGroup[] = [
	{
		id: "dev",
		name: "Development",
		icon: "material-symbols:code-rounded",
		desc: "Sites I use while writing code",
		weight: 100,
		items: [
			{
				title: "GitHub",
				url: "https://github.com",
				desc: "The largest code hosting platform",
				// icon can be an astro-icon name
				// or an image URL / local image path
				// leave it out to fetch the site's favicon automatically (configured above)
				icon: "fa7-brands:github",
				weight: 10,
			},
			{
				title: "MDN Web Docs",
				url: "https://developer.mozilla.org",
				desc: "The definitive web platform docs",
				weight: 9,
			},
			{
				title: "Astro",
				url: "https://astro.build",
				desc: "The web framework for content-driven sites",
				weight: 8,
			},
			{
				title: "Svelte",
				url: "https://svelte.dev",
				desc: "Compiles components into efficient vanilla JS",
				weight: 7,
			},
			{
				title: "Tailwind CSS",
				url: "https://tailwindcss.com",
				desc: "A powerful, flexible CSS framework",
				weight: 6,
			},
		],
	},
	{
		id: "opensource",
		name: "Projects",
		icon: "material-symbols:code-rounded",
		desc: "Useful open-source projects",
		weight: 90,
		items: [
			{
				title: "Firefly",
				url: "https://github.com/CuteLeaf/Firefly",
				desc: "A clean, pretty Astro blog theme",
				icon: "/favicon/firefly-32.png",
				weight: 10,
			},
		],
	},
	{
		id: "design",
		name: "Design",
		icon: "material-symbols:palette-outline-rounded",
		desc: "Color, icons and inspiration",
		weight: 90,
		items: [
			{
				title: "Iconify",
				url: "https://icon-sets.iconify.design",
				desc: "Search a huge set of open-source icons",
				weight: 10,
			},
			{
				title: "iconfont",
				url: "https://www.iconfont.cn",
				desc: "Alibaba's vector icon library",
				weight: 9,
			},
		],
	},
	{
		id: "tools",
		name: "Tools",
		icon: "material-symbols:build-outline-rounded",
		desc: "Handy online tools",
		weight: 80,
		items: [
			{
				title: "TinyPNG",
				url: "https://tinypng.com",
				desc: "Compress PNG / JPEG images online",
				weight: 10,
			},
			{
				title: "Squoosh",
				url: "https://squoosh.app",
				desc: "Image compression and conversion by Google",
				weight: 9,
			},
			{
				title: "Carbon",
				url: "https://carbon.now.sh",
				desc: "Turn code snippets into beautiful images",
				weight: 8,
			},
		],
	},
	{
		id: "resources",
		name: "Resources",
		icon: "material-symbols:auto-stories-outline-rounded",
		desc: "Docs, tutorials and reading",
		weight: 70,
		items: [
			{
				title: "Firefly Docs",
				url: "https://docs-firefly.cuteleaf.cn",
				desc: "Firefly theme documentation",
				icon: "https://docs-firefly.cuteleaf.cn/logo.png",
				weight: 10,
			},
			{
				title: "Firefly Demo",
				url: "https://blog.cuteleaf.cn",
				desc: "The Firefly theme demo site",
				weight: 9,
			},
		],
	},
];
