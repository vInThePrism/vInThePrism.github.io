import type { SidebarLayoutConfig } from "../types/sidebarConfig";

/**
 * Sidebar layout
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// Enable sidebars
	enable: true,

	// Sidebar position:
	// left: left sidebar only
	// right: right sidebar only
	// both: two sidebars; both shown above 1280px, one (per tabletSidebar) at 769-1279px
	position: "left",

	// Which sidebar tablets (769-1279px) show; only when position is both
	// left: tablets show the left sidebar
	// right: tablets show the right sidebar
	tabletSidebar: "left",

	// Hide sidebars on post pages; true shows them only on non-post pages such as the home page
	hideSidebarOnPostPage: false,

	// When a page has no sidebar column, the content's share of the sidebar + content width (0-1); unset or >= 1 fills it
	noSidebarContentWidth: 0.6,

	// Left sidebar widgets
	// Widgets render in array order, except that top widgets always come before sticky ones
	// type: widget type
	// enable: show this widget
	// showTitle: show the widget title (default true)
	// position: top (fixed at the top) or sticky (follows the page as you scroll)
	// showOnPostPage: show on post pages
	// hideOnNonPostPage: hide on non-post pages (true = post pages only)
	// specificConfig: widget-specific settings
	leftComponents: [
		{
			// Widget: profile
			type: "profile",
			// Show this widget
			enable: true,
			// Position
			position: "top",
			// Show on post pages
			showOnPostPage: true,
		},
		{
			// Widget: announcement
			type: "announcement",
			// Show this widget
			enable: true,
			// Position
			position: "top",
			// Show on post pages
			showOnPostPage: true,
		},
		{
			// Widget: music player
			type: "music",
			// Show this widget
			enable: false,
			// Position
			position: "top",
			// Show on post pages
			showOnPostPage: true,
		},
		{
			// Widget: categories
			type: "categories",
			// Show this widget
			enable: true,
			// Position
			position: "sticky",
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				// Collapse when there are more than 5 categories
				collapseThreshold: 5,
			},
		},
		{
			// Widget: tags
			type: "tags",
			// Show this widget
			enable: true,
			// Position
			position: "sticky",
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				// Collapse when there are more than 10 tags
				collapseThreshold: 10,
			},
		},
		{
			// Table of contents (post pages only)
			type: "sidebarToc",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			hideOnNonPostPage: true,
		},
	],

	// Right sidebar widgets
	rightComponents: [
		{
			// Widget: latest updates
			type: "dynamic",
			// Show this widget
			enable: true,
			// Position
			position: "top",
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				dynamic: {
					// Number of updates to show
					limit: 2,
				},
			},
		},
		{
			// Widget: site stats
			type: "stats",
			// Show this widget
			enable: true,
			// Position
			position: "top",
			// Show on post pages
			showOnPostPage: false,
		},
		{
			// Widget: site info
			type: "siteInfo",
			// Show this widget
			enable: true,
			// Position
			position: "top",
			// Show on post pages
			showOnPostPage: false,
			// Widget-specific settings
			specificConfig: {
				siteInfo: {
					// Fallback label when the build platform can't be detected
					unknownBuildPlatform: "Unknown CI",
				},
			},
		},
		{
			// Widget: calendar
			type: "calendar",
			// Show this widget
			enable: true,
			// Show the widget title
			showTitle: false,
			// Position
			position: "sticky",
			// Show on post pages
			showOnPostPage: false,
			// Widget-specific settings
			specificConfig: {
				calendar: {
					// Show the yearly post heatmap
					showHeatmap: true,
				},
			},
		},
		{
			// Widget: table of contents (post pages only)
			type: "sidebarToc",
			// Show this widget
			enable: true,
			// Position
			position: "sticky",
			// Show on post pages
			showOnPostPage: true,
			// Hide on non-post pages
			hideOnNonPostPage: true,
		},
		{
			// Widget: banner ad 1
			type: "advertisement",
			// Show this widget
			enable: false,
			// Show the widget title
			showTitle: false,
			// Position
			position: "sticky",
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings (the ad content goes here)
			specificConfig: {
				ad: {
					image: {
						src: "/assets/images/ad/ad1.webp",
						alt: "Banner",
						link: "https://haoka.lot-ml.com/plugreg.html?agentid=1423316",
						external: true,
					},
					// Let visitors close the ad
					closable: false,
					// Display limit; -1 means unlimited
					displayCount: -1,
					// Padding
					padding: {
						all: "1rem",
					},
				},
			},
		},
		{
			// Widget: banner ad 2
			type: "advertisement",
			// Show this widget
			enable: false,
			// Position
			position: "sticky",
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings (the ad content goes here)
			specificConfig: {
				ad: {
					title: "Support me",
					content:
						"If something here helped you, consider supporting my writing - it keeps the updates coming.",
					link: {
						text: "Support",
						url: "about/",
						external: false,
					},
					closable: false,
					displayCount: -1,
				},
			},
		},
	],

	// Mobile bottom widgets
	// Shown only on mobile (<768px) at the bottom of the page, independent of the sidebars
	mobileBottomComponents: [
		{
			// Widget: profile
			type: "profile",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
		},
		{
			// Widget: announcement
			type: "announcement",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
		},
		{
			// Widget: categories
			type: "categories",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				// Collapse when there are more than 5 categories
				collapseThreshold: 5,
			},
		},
		{
			// Widget: tags
			type: "tags",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				// Collapse when there are more than 20 tags
				collapseThreshold: 10,
			},
		},
		{
			// Widget: latest updates
			type: "dynamic",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				dynamic: {
					// Number of updates to show
					limit: 2,
				},
			},
		},
		{
			// Widget: site stats
			type: "stats",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
		},
		{
			// Widget: site info
			type: "siteInfo",
			// Show this widget
			enable: true,
			// Show on post pages
			showOnPostPage: true,
			// Widget-specific settings
			specificConfig: {
				siteInfo: {
					// Fallback label when the build platform can't be detected
					unknownBuildPlatform: "Unknown CI",
				},
			},
		},
	],
};
