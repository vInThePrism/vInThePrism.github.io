import type { AnalyticsConfig } from "../types/analyticsConfig";

export const analyticsConfig: AnalyticsConfig = {
	// Google Analytics ID
	googleAnalyticsId: "",
	// Microsoft Clarity ID
	microsoftClarityId: "",
	// Umami analytics
	umamiAnalytics: {
		// Umami Website ID
		websiteId: "",
		// Umami script URL (self-hosted instances are supported)
		scriptUrl: "https://cloud.umami.is/script.js",
		// Umami session-replay script URL (self-hosted instances are supported)
		replaysScriptUrl: "https://cloud.umami.is/recorder.js",
		// Track outbound links
		trackOutboundLinks: true,
		// Collect browser performance metrics
		collectWebVitals: false,
		// Session replay
		replays: {
			// Enable session replay
			enabled: false,
			// Sampling rate for recorded sessions, 0-1 (e.g. 0.15 records 15% of sessions)
			sampleRate: 0.15,
			// Privacy masking: "moderate" masks all inputs; "strict" also masks all page text
			maskLevel: "moderate",
			// Maximum length of one recording (ms)
			maxDuration: 300000,
			// CSS selectors to exclude from recording, e.g. ".sensitive-widget"
			blockSelector: "",
		},
	},
	// 51la analytics
	la51Analytics: {
		// 51la site ID
		Id: "",
		// Custom SDK URL (to avoid DNS pollution); leave empty for the default
		sdkUrl: "",
		// Data-separation key for multiple site IDs; leave empty to use Id
		ck: "",
		// Enable event analytics
		autoTrack: false,
		// Hash-router mode. This site uses History API routing, so leave it off (default false)
		hashMode: false,
		// Enable screen recording
		screenRecord: true,
	},
};
