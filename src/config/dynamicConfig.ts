import type { DynamicConfig } from "@/types/dynamicConfig";

export const dynamicConfig: DynamicConfig = {
	// Page title; leave empty to use the i18n translation
	title: "",

	// Page description; leave empty to use the i18n translation
	description: "",

	// Where the avatar and name link to (site path or full URL)
	profileUrl: "/about/",

	// Enable comments on each update (requires a comment system in commentConfig.ts)
	showComment: true,

	// Updates per page
	itemsPerPage: 20,

	// JSON data source for updates; defaults to "/api/dynamic.json"
	// Can point to a third-party endpoint, e.g. "https://example.com/api/dynamic.json"
	// Open the default endpoint to see the expected data shape
	// Ignored when memos.enable is true
	apiUrl: "/api/dynamic.json",

	// ========== Memos ==========
	// When enabled, the browser fetches updates live from the Memos API and apiUrl is ignored
	// Remember to configure CORS on your Memos server
	memos: {
		// Use Memos as the data source
		enable: false,

		// Memos instance URL
		apiUrl: "https://memos.example.com",

		// Memos user, e.g. "users/<your-memos-username>", used to filter updates by user
		// Must match the creator field returned by the Memos API exactly (case-sensitive), e.g. "users/admin", not "users/Admin"
		parent: "users/xiaye",
	},
};
