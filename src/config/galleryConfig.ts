import type { GalleryConfig } from "@/types/galleryConfig";

// 相册配置
export const galleryConfig: GalleryConfig = {
	// 相册列表
	albums: [
		// 示例：在 public/gallery/2026-madison-fall/ 放图片后取消注释
		// {
		// 	id: "2026-madison-fall",
		// 	name: "Madison 的秋天",
		// 	description: "",
		// 	location: "Madison, WI",
		// 	date: "2026-10-01",
		// 	tags: ["生活"],
		// },
	],

	// 瀑布流最小列宽(px)，浏览器根据容器宽度自动计算列数，默认 240
	// 值越小列数越多，值越大列数越少
	columnWidth: 240,
};
