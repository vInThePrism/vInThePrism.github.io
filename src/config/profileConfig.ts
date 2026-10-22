import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// Avatar
	// Image paths can be:
	// 1. In public/ (starts with "/", not optimized): "/assets/images/avatar.webp"
	// 2. In src/ (no leading "/", optimized but slower to build, recommended): "assets/images/avatar.webp"
	// 3. A remote URL: "https://example.com/avatar.jpg"
	avatar: "https://github.com/vInThePrism.png",

	// Name
	name: "V",

	// Bio
	bio: "CS @ UW-Madison · learning AI infra & GPU kernels · notes, thoughts and life",

	// Links
	// Preinstalled icon sets: fa7-brands, fa7-regular, fa7-solid, material-symbols, simple-icons
	// Find icon names at https://icones.js.org/
	// Other icon sets need to be installed first
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true shows the icon and the name; false shows the icon only
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/vInThePrism",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
