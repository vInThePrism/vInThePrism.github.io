import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// Announcement title; leave empty to use the default i18n title
	title: "",

	// Announcement text
	content: "Welcome to my little corner 🌸 I'm working through CUDA and GPU performance engineering — new notes land here regularly.",

	// Let visitors dismiss the announcement
	closable: true,

	link: {
		// Show a link
		enable: true,
		// Link text
		text: "About me",
		// Link URL
		url: "/about/",
		// Internal link
		external: false,
	},
};
