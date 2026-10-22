import type { FriendLink, FriendsPageConfig } from "../types/friendsConfig";

// Custom content shown below the friend links goes in src/content/spec/friends.mdx

// Friend links page settings
export const friendsPageConfig: FriendsPageConfig = {
	// Page title; leave empty to use the i18n translation
	title: "",

	// Page description; leave empty to use the i18n translation
	description: "",

	// Show the custom content at the bottom (from friends.mdx)
	showCustomContent: true,

	// Show comments (requires a comment system in commentConfig.ts)
	showComment: true,

	// Shuffle the list once at build time (ignores weights)
	randomizeSort: false,
};

// Friend links
export const friendsConfig: FriendLink[] = [
	{
		title: "Firefly Demo",
		imgurl:
			"https://weavatar.com/avatar/d252655d40d6874417a720bad0a6c5f77f8f6a1fd2f882f8f338402dc37e4190?s=640",
		desc: "The Firefly theme demo site",
		siteurl: "https://blog.cuteleaf.cn",
		tags: ["Blog"],
		weight: 10, // higher weights are listed first
		enabled: true, // show this link
	},
	{
		title: "Firefly Docs",
		imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
		desc: "Firefly theme documentation",
		siteurl: "https://docs-firefly.cuteleaf.cn",
		tags: ["Docs"],
		weight: 9,
		enabled: true,
	},
	{
		title: "Astro",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "The web framework for content-driven websites. ⭐️ Star to support our work!",
		siteurl: "https://github.com/withastro/astro",
		tags: ["Framework"],
		weight: 8,
		enabled: true,
	},
];

// Return enabled links, sorted
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
