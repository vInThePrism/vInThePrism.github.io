import type { LicenseConfig } from "../types/licenseConfig";

export const licenseConfig: LicenseConfig = {
	// Show license info at the top of posts
	enable: true,

	// License name and link
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",

	// Optional: custom license icon (an Iconify icon name)
	// When empty, the icon is matched from the license name:
	//   the CC family: CC BY / CC BY-SA / CC BY-NC / CC BY-NC-SA / CC BY-ND / CC BY-NC-ND, ...
	//   → fa7-brands:creative-commons
	//   CC0 1.0
	//   → fa7-brands:creative-commons-zero
	//   Public Domain
	//   → fa7-brands:creative-commons-pd
	//   MIT / Apache / BSD / ISC / MPL / GPL / LGPL / AGPL / MulanPSL / Unlicense
	//   → fa7-brands:osi
	//   anything else (All Rights Reserved, WTFPL, ...)
	//   → fa7-regular:copyright
	icon: "",
};
