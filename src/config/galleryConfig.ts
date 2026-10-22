import type { GalleryConfig } from "@/types/galleryConfig";

// Photo albums
export const galleryConfig: GalleryConfig = {
	// Album list
	albums: [
		// Example: put images in public/gallery/2026-madison-fall/, then uncomment
		// {
		// 	id: "2026-madison-fall",
		// 	name: "Fall in Madison",
		// 	description: "",
		// 	location: "Madison, WI",
		// 	date: "2026-10-01",
		// 	tags: ["Life"],
		// },
	],

	// Minimum masonry column width (px); the browser picks the column count. Default 240
	// Smaller values give more columns, larger values fewer
	columnWidth: 240,
};
