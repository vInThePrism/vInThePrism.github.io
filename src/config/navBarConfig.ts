import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// Navbar - links are generated in this order
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// Base links
	const links: NavBarLink[] = [];

	// Home
	links.push(LinkPresets.Home);

	// Sections
	links.push({
		name: "Learning",
		url: "/archive/?category=Learning",
		icon: "material-symbols:school-rounded",
	});

	links.push({
		name: "Thoughts",
		url: "/archive/?category=Thoughts",
		icon: "material-symbols:lightbulb-2-rounded",
	});

	links.push({
		name: "Life",
		url: "#",
		icon: "material-symbols:local-florist-rounded",
		children: [
			{
				name: "Essays",
				url: "/archive/?category=Life",
				icon: "material-symbols:edit-note-rounded",
			},
			LinkPresets.Dynamic,
			LinkPresets.Gallery,
		],
	});

	links.push({
		name: "Archive",
		url: "#",
		icon: "material-symbols:archive",
		children: [LinkPresets.Archive, LinkPresets.Categories, LinkPresets.Tags],
	});

	links.push(LinkPresets.Projects);

	links.push(LinkPresets.About);

	return { links } as NavBarConfig;
};

// Navbar search
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// Link presets - customize the name, icon and URL of each navbar link
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "Home",
		url: "/",
		icon: "material-symbols:home",
	},
	Archive: {
		name: "Archive",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "Categories",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "Tags",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Series: {
		name: "Series",
		url: "/series/",
		icon: "material-symbols:layers",
	},
	Friends: {
		name: "Friends",
		url: "/friends/",
		icon: "material-symbols:link-2-rounded",
		pageKey: "friends",
	},
	Guestbook: {
		name: "Guestbook",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	Dynamic: {
		name: "Updates",
		url: "/dynamic/",
		icon: "material-symbols:forum-rounded",
		pageKey: "dynamic",
	},
	Projects: {
		name: "Projects",
		url: "/projects/",
		icon: "material-symbols:rocket-launch",
		pageKey: "projects",
	},
	Gallery: {
		name: "Gallery",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Booknav: {
		name: "Bookmarks",
		url: "/booknav/",
		icon: "material-symbols:bookmarks",
		pageKey: "booknav",
	},
	Bilibili: {
		name: "Bilibili",
		url: "/bilibili/",
		icon: "fa7-brands:bilibili",
		pageKey: "bilibili",
	},
	Bangumi: {
		name: "Bangumi",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	VNDB: {
		name: "VNDB",
		url: "/vndb/",
		icon: "material-symbols:chrome-reader-mode-rounded",
		pageKey: "vndb",
	},
	MAL: {
		name: "AnimeList",
		url: "/myanimelist/",
		icon: "material-symbols:menu-book",
		pageKey: "mal",
	},
	Sponsor: {
		name: "Sponsor",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	About: {
		name: "About",
		url: "/about/",
		icon: "material-symbols:person",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
