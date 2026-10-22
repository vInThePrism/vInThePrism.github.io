import type { SiteConfig } from "@/types/siteConfig";
import { resolvePageToggles } from "../utils/page-toggle-utils";
import { resolveSiteLang } from "../utils/site-config-utils";

// Site language
// Language code, e.g. 'zh_CN', 'zh_TW', 'en', 'ja', 'ru', 'ko'.
const SITE_LANG = resolveSiteLang("en");

// Page switches - false returns a 404 and hides the matching navbar item
const pages = resolvePageToggles({
	// ── Social ──────────────────────────────────

	// Friend links page
	friends: false,
	// Guestbook page (requires a comment system)
	guestbook: false,

	// ── Mine ──────────────────────────────────

	// Updates page
	dynamic: true,
	// Projects page
	projects: true,
	// Gallery page
	gallery: true,
	// Bookmarks page
	booknav: false,
	// Bilibili anime page
	bilibili: false,
	// Bangumi page
	bangumi: false,
	// VNDB page
	vndb: false,
	// MyAnimeList page
	mal: false,

	// ── About ──────────────────────────────────

	// Sponsor page
	sponsor: false,
});

export const siteConfig: SiteConfig = {
	// Site title
	title: "vInThePrism",

	// Site subtitle
	subtitle: "AI Infra · GPU · Life",

	// Site URL
	site_url: "https://vintheprism.github.io",

	// Site description
	description:
		"V's personal site: notes on GPU kernels and AI infra training performance, plus thoughts and everyday life.",

	// Site keywords
	keywords: ["vInThePrism", "CUDA", "GPU", "AI Infra", "notes", "blog"],

	// Theme color
	themeColor: {
		// Default hue, 0-360. e.g. red 0, cyan 200, blue-violet 250, pink 345
		hue: 345,
		// Default mode: "light", "dark" or "system"
		defaultMode: "system",
	},

	// Overall page width (rem)
	// Larger values make the content area wider
	// With a single sidebar, a slightly smaller width tends to look better.
	pageWidth: 90,

	// Card style
	card: {
		// Card borders and shadows (adds depth)
		border: false,
		// Tint cards with the theme hue
		followTheme: false,
	},

	// Favicon
	// If OpenGraph image generation is on, include a PNG favicon in this list
	favicon: [
		{
			// Icon file path
			src: "/favicon/vintheprism-32.png",
			// Optional: theme, 'light' | 'dark'
			// theme: "light",
			// Optional: icon size
			// sizes: "32x32",
		},
	],

	// Navbar
	navbar: {
		// Navbar logo
		// Four kinds are supported:
		// 1. Astro icon: { type: "icon", value: "material-symbols:home-pin-outline" }
		// 2. Image in public/ (not optimized): { type: "image", value: "/assets/images/logo.webp", alt: "Logo" }
		// 3. Image in src/ (optimized, slower builds): { type: "image", value: "assets/images/logo.webp", alt: "Logo" }
		// 4. Remote image: { type: "url", value: "https://example.com/logo.png", alt: "Logo" }
		// image and url logos can set valueDark for dark mode; otherwise value is used in both modes
		// e.g. { type: "image", value: "assets/images/logo.png", valueDark: "assets/images/logo-dark.png", alt: "Logo" }
		// Icons switch with light/dark mode automatically, so they don't need valueDark
		logo: {
			type: "icon",
			value: "material-symbols:diamond-outline-rounded",
		},
		// Navbar title
		title: "vInThePrism",
		// Full-width navbar
		widthFull: false,
		// Menu alignment: left or center
		menuAlign: "center",
		// Tint the navbar icon and title with the theme color
		followTheme: false,
		// navbarMode:
		// "static": not pinned; scrolls away with the page
		// "fixed": always pinned to the top
		// "dynamic": pinned to the top; hides when scrolling down, shows when scrolling up
		navbarMode: "dynamic",
	},

	// Site start date, used for the uptime counter
	siteStartDate: "2026-10-22",

	// Site time zone (IANA string), used to format dates in RSS, Bangumi, etc.
	// e.g. "Asia/Shanghai", "UTC"; if empty, the build server's time zone is used
	timezone: "UTC",

	// Page switches - false returns a 404 and hides the matching navbar item

	// Category bar: quick category links at the top of the home and archive pages
	categoryBar: true,

	// Category bar button style
	// "pill": rounded, light theme-colored background
	// "rectangle": same colors as pill, smaller corner radius
	categoryStyle: "rectangle",

	// Tag style (post list, tags page and sidebar)
	// "pill": rounded, theme-colored background
	// "pill-gray": rounded, neutral gray background
	// "rectangle": theme-colored background, small corner radius
	tagStyle: "pill",

	// Collapse older years on the archive page; when off, every year is expanded
	foldArticle: true,

	// ── Post list layout ──────────────────────────────────
	postListLayout: {
		// Default layout: "list" (single column) or "grid" (multiple columns)
		defaultMode: "list",
		// Default layout on mobile; follows defaultMode if unset
		mobileDefaultMode: "list",
		// Cover position in list mode: "right" or "left"
		// In grid mode the cover is always at the top of the card
		coverPosition: "right",
		// Lines of description to show; 0 means no truncation
		descriptionLines: 2,
		// Show icons next to stats and dates at the bottom of post cards
		showStatsIcons: true,
		// Where tags are shown
		// "meta": in the metadata under the title
		// "bottom": at the bottom, replacing the stats
		tagsPosition: "bottom",
		// Bottom tag style (only when tagsPosition is "bottom")
		// "chip": button style, shape follows tagStyle above
		// "text": plain text, no background
		tagsBottomStyle: "chip",
		// PostMeta (metadata under the title)
		meta: {
			// Show the publish date
			showPublished: true,
			// Show the category
			showCategory: true,
			// Show tags
			showTags: true,
			// Number of tags; 0 means no limit
			tagCount: 3,
			// Show word count
			showWords: false,
			// Show reading time
			showReadingTime: false,
		},
		// PostStats (bottom of the card)
		// Not shown when tagsPosition is "bottom"
		stats: {
			// Show the publish date
			showPublished: true,
			// Show word count
			showWords: true,
			// Show reading time
			showReadingTime: true,
		},
		// Grid layout (applies when defaultMode is "grid" or the layout can be switched)
		grid: {
			// Masonry layout; recommended when some posts have covers and some don't
			masonry: false,
			// Minimum card width in grid mode (px); the browser picks the column count
			columnWidth: 320,
			// Make grid covers bleed to the card edges
			// true: cover touches the left, right and top edges; only the top corners are rounded
			// false: cover is inset by the card padding; all four corners are rounded
			coverFullWidth: false,
		},
	},

	// Pagination
	pagination: {
		// Posts per page
		postsPerPage: 10,
	},

	// ── Post page ──────────────────────────────────
	post: {
		// Callouts (admonitions); restart the dev server after changing this
		// Theme: 'github' | 'obsidian' | 'vitepress' | 'docusaurus' - each has its own look and syntax
		rehypeCallouts: {
			theme: "github",
			// Support Python-Markdown admonition syntax (!!! and ???)
			// Note: only the obsidian theme supports this reasonably; other themes may render it incorrectly
			enablePythonMarkdownAdmonitions: false,
		},
		// "Last edited" card at the bottom of posts
		showLastModified: true,
		// Only show the "last edited" card for posts older than this many days
		outdatedThreshold: 30,
		// Show the share button on posts
		share: true,
		// Show previous/next post navigation
		postNavigation: true,
		// Show related posts
		relatedPosts: true,
		// Show random post suggestions
		randomPosts: true,
		// Generate OpenGraph images (slow to render; not recommended for local development)
		generateOgImages: false,
		// Immersive reading: a button at the bottom right of posts on desktop that leaves only the post card and the TOC
		immersiveReading: {
			// Master switch; false hides the button
			enable: true,
			// Turn immersive reading on by default when opening a post
			defaultOn: false,
			// Show the TOC in immersive reading
			tocEnabled: true,
			// TOC position: "left" | "right"
			tocPosition: "left",
		},
	},

	// ── Bilibili ──────────────────────────────────
	bilibili: {
		// Your Bilibili user UID
		uid: "38932988",
	},

	// ── Bangumi ──────────────────────────────────
	bangumi: {
		// Bangumi user ID
		userId: "1143164",
		// Data mode: static = fetched at build time, dynamic = fetched live in the browser
		// static renders at build time; data doesn't update after deployment
		// dynamic calls the API from the browser and always shows the latest data
		mode: "dynamic",
		// Bangumi API URL
		apiUrl: "https://api.bangumi.pro",
		// Detail page URL
		subjectBaseUrl: "https://api.bangumi.pro/subject/",
		// Category order; listed types are shown first, in this order
		// Values: "anime" | "book" | "music" | "game" | "real" ("real" is not supported yet)
		// Unlisted types follow in the default order
		categoryOrder: ["anime", "book", "music", "game"],
		// Enable/disable individual categories (true/false); unlisted categories are enabled
		// categories: {
		// 	game: false, // hide games
		// },
		// NSFW handling: "off" no filtering | "blur" blur covers | "hide" hide entries
		nsfw: "hide",
	},

	// ── VNDB ──────────────────────────────────
	vndb: {
		// VNDB user ID
		userId: "u358128",
		// Data mode: static = fetched at build time, dynamic = fetched live in the browser
		// static renders at build time; data doesn't update after deployment
		// dynamic calls the API from the browser and always shows the latest data
		mode: "static",
		// Download and compress covers into public/vndb-covers at build time and serve them from this site
		downloadCovers: false,
		// VNDB API URL
		apiUrl: "https://api.vndb.org/kana",
		// Entry detail URL (must end with /)
		vnBaseUrl: "https://vndb.org/",
		// Token for private lists (static mode only). Never commit a real token to a public repo!
		apiToken: "",
		// NSFW handling: "off" no filtering | "blur" blur covers | "hide" hide entries
		nsfw: "hide",
	},

	// ── MyAnimeList ──────────────────────────────────
	mal: {
		// MyAnimeList username (the list must be public)
		username: "cuteleaf",
		// MyAnimeList Client ID; register a free app at https://myanimelist.net/apiconfig
		clientId: "	0ef34371450f9c6c809deaadec6aa8f3",
		// MAL API URL
		apiUrl: "https://api.myanimelist.net/v2",
		// Anime detail URL (must end with /)
		animeBaseUrl: "https://myanimelist.net/anime/",
		// Manga detail URL (must end with /)
		mangaBaseUrl: "https://myanimelist.net/manga/",
		// NSFW handling: "off" no filtering | "blur" blur covers | "hide" hide entries
		nsfw: "hide",
	},

	// ── Image optimization ──────────────────────────────────
	// Optimized images are output as AVIF and/or WebP only
	// Responsive images are resized to fit their container and served at different sizes depending on the visitor's screen size and resolution.
	// Astro can only optimize images under src/; the more images there, the longer the build
	// Astro image docs: https://docs.astro.build/en/guides/images/
	imageOptimization: {
		// Output format
		// - "avif": AVIF only (smallest files, lower compatibility, slower builds)
		// - "webp": WebP only (medium size, good compatibility, fast builds)
		// - "both": AVIF and WebP (the browser picks the best one)
		formats: "webp",
		// Compression quality (1-100); lower is smaller but worse. 70-85 recommended
		quality: 85,
		// Add referrerpolicy="no-referrer" to images from these domains
		// Wildcards (*) are supported, e.g. ["i0.hdslb.com", "*.bilibili.com"]
		// Fixes 403 errors from hotlink-protected image hosts
		noReferrerDomains: [
			"*.hdslb.com",
			"*.bilibili.com",
			"*.myanimelist.net",
			"*.vndb.org",
		],
	},

	// ── Feeds (RSS / Atom) ──────────────────────────────────
	feed: {
		// Feed item content:
		// - "full": the full post body (default)
		// - "summary": description only, no body; smaller feed
		contentMode: "full",
	},

	// Site language, defined by SITE_LANG at the top of this file
	lang: SITE_LANG,

	// Page switches, defined by pages at the top of this file
	pages,
};
