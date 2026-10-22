// Config barrel - re-exports every config
// so components can import several configs in one statement

import type { NavbarMode } from "../types/siteConfig";
import { siteConfig } from "./siteConfig"; // site settings (used to derive navbarMode)

/** Resolve the navbar mode: navbarMode wins; otherwise map the legacy stickyNavbar (true -> fixed, false -> static) */
export function resolveNavbarMode(navbar: {
	navbarMode?: NavbarMode;
	stickyNavbar?: boolean;
}): NavbarMode {
	if (navbar.navbarMode) return navbar.navbarMode;
	return navbar.stickyNavbar === false ? "static" : "fixed";
}

/** Current navbar mode (resolved from navbarMode / legacy stickyNavbar) for all consumers */
export const navbarMode: NavbarMode = resolveNavbarMode(siteConfig.navbar);

// Type exports
export type {
	AdConfig,
	AnalyticsConfig,
	AnnouncementConfig,
	BackgroundWallpaperConfig,
	BooknavFaviconConfig,
	BooknavGroup,
	BooknavItem,
	BooknavPageConfig,
	CommentConfig,
	CoverImageConfig,
	DisplaySettingsConfig,
	DynamicConfig,
	ExpressiveCodeConfig,
	GalleryAlbum,
	GalleryConfig,
	LicenseConfig,
	MermaidConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PlantUMLConfig,
	ProfileConfig,
	SakuraConfig,
	SidebarLayoutConfig,
	SiteConfig,
	SponsorConfig,
	SponsorItem,
	SponsorMethod,
	WidgetComponentConfig,
	WidgetComponentType,
	WidgetSpecificConfig,
} from "../types/config";
export type {
	BuiltinFontProvider,
	CustomFontProvider,
	FontDefinition,
	FontSelectionConfig,
} from "../types/fontConfig"; // font types
export { analyticsConfig } from "./analyticsConfig"; // analytics
export { announcementConfig } from "./announcementConfig"; // announcement
// Appearance
export { backgroundWallpaper } from "./backgroundWallpaper"; // wallpaper
export { booknavConfig, booknavPageConfig } from "./booknavConfig"; // bookmarks
// Features
export { commentConfig } from "./commentConfig"; // comments
export { coverImageConfig } from "./coverImageConfig"; // cover images
export { displaySettingsConfig } from "./displaySettingsConfig"; // display settings panel
export { dynamicConfig } from "./dynamicConfig"; // updates page
export { sakuraConfig } from "./effectsConfig"; // visual effects (sakura, ...)
export { expressiveCodeConfig } from "./expressiveCodeConfig"; // code highlighting
export { fontConfig, fontsList } from "./fontConfig"; // fonts
export { friendsPageConfig, getEnabledFriends } from "./friendsConfig"; // friend links
export { galleryConfig } from "./galleryConfig"; // photo albums
export { licenseConfig } from "./licenseConfig"; // license
// Components
export { mermaidConfig } from "./mermaidConfig"; // Mermaid diagrams
export { musicPlayerConfig } from "./musicConfig"; // music player
export { navBarConfig, navBarSearchConfig } from "./navBarConfig"; // navbar and search
export { live2dWidgetConfig, spineModelConfig } from "./pioConfig"; // mascot
export { plantumlConfig } from "./plantumlConfig"; // PlantUML diagrams
export { profileConfig } from "./profileConfig"; // profile
// Layout
export { sidebarLayoutConfig } from "./sidebarConfig"; // sidebar layout
// Core
export { siteConfig } from "./siteConfig"; // site settings
export { sponsorConfig } from "./sponsorConfig"; // sponsor page
