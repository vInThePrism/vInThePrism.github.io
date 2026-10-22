import type { MusicPlayerConfig } from "../types/musicConfig";

// Music player
export const musicPlayerConfig: MusicPlayerConfig = {
	// Show the music player in the navbar
	showInNavbar: false,

	// Show the music player widget in the sidebar
	showInSidebar: false,

	// Source: "meting" uses the Meting API, "local" uses the local playlist below
	mode: "local",

	// Default volume (0-1)
	volume: 0.7,

	// Play mode: 'list' = loop the list, 'one' = loop one track, 'random' = shuffle
	playMode: "list",

	// Show lyrics
	showLyrics: false,

	// Meting API
	meting: {
		// Meting API URL
		// The official API by default; a custom API also works
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// Platform: netease, tencent (QQ Music), kugou, xiami, baidu
		server: "netease",
		// Type: song, playlist, album, search, artist
		type: "playlist",
		// Playlist / album / song ID, or a search keyword
		id: "10046455237",
		// Auth token (optional)
		auth: "",
		// Fallback APIs (used when the main API fails)
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// Local playlist (used when mode is 'local')
	// 1. Pass the path of a lyrics file
	// lrc: "/assets/music/lrc/my-song.lrc",
	// 2. Or the lyrics text itself
	// lrc: "[00:00.00]Lyrics...",
	local: {
		playlist: [
			{
				name: "Example Track",
				artist: "Unknown Artist",
				url: "/assets/music/example.mp3",
				cover: "/assets/music/cover/example.webp",
				lrc: "",
			},
		],
	},
};
