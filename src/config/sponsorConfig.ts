import type { SponsorConfig } from "../types/sponsorConfig";

export const sponsorConfig: SponsorConfig = {
	// Page title; leave empty to use the i18n translation
	title: "",

	// Page description; leave empty to use the i18n translation
	description: "",

	// What sponsorships are used for
	usage:
		"Sponsorships go toward hosting, writing and new features, and help me keep making things.",

	// Show the list of sponsors
	showSponsorsList: true,

	// Show comments (requires a comment system in commentConfig.ts)
	showComment: true,

	// Show a sponsor button at the bottom of posts
	showButtonInPost: true,

	// Payment methods
	methods: [
		{
			name: "Alipay",
			icon: "fa7-brands:alipay",
			// QR code image path (must be under public/)
			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "Scan with Alipay",
			enabled: true,
		},
		{
			name: "WeChat Pay",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			link: "",
			description: "Scan with WeChat",
			enabled: true,
		},
		{
			name: "ko-fi",
			icon: "simple-icons:kofi",
			qrCode: "",
			link: "https://ko-fi.com/cuteleaf",
			description: "Buy a Coffee for Firefly",
			enabled: true,
		},
		{
			name: "Afdian",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "https://ifdian.net/a/cuteleaf",
			description: "Sponsor via Afdian",
			enabled: true,
		},
	],

	// Sponsors (optional)
	sponsors: [
		// Example: named sponsor
		{
			name: "Example Sponsor",
			avatar:
				"https://weavatar.com/avatar/d252655d40d6874417a720bad0a6c5f77f8f6a1fd2f882f8f338402dc37e4190?s=640",
			amount: "¥50",
			date: "2025-10-01",
		},

		// Example: anonymous sponsor
		{
			name: "Anonymous",
			// avatar: "",
			amount: "¥20",
			date: "2025-10-01",
		},
	],
};
