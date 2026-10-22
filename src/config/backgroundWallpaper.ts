import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// Wallpaper mode: "banner", "fullscreen", "overlay" (translucent full-page), or "none" (solid color)
	mode: "overlay",
	// Enable background video; adds a play button to the navbar
	playerEnable: false,
	/**
	 * Background images
	 * Image paths can be:
	 * 1. In public/ (starts with "/", not optimized): "/assets/images/banner.avif"
	 * 2. In src/ (no leading "/", optimized but slower to build, recommended): "assets/images/banner.avif"
	 * 3. A remote URL: "https://example.com/banner.jpg"
	 * Note: remote and public/ images aren't optimized - keep them small so pages load fast
	 *
	 * The theme's sample images (d1-d6, m1-m6) were removed from this site.
	 * If you add your own, avoid those names: theme updates may ship new samples with the same names
	 * and overwrite your files.
	 *
	 * For a single image or a random-image API, a plain string is simplest:
	 * desktop: "https://t.alcy.cc/pc",   // random-image API
	 * desktop: "assets/images/DesktopWallpaper/d1.avif", // single image
	 *
	 * mobile: "https://t.alcy.cc/mp", // random-image API
	 * mobile: "assets/images/MobileWallpaper/m1.avif", // single image
	 *
	 * Several images (an array) are also supported; one is picked at random on each page load:
	 * desktop: [
	 *   "assets/images/DesktopWallpaper/d1.avif",
	 * ],
	 *
	 * mobile:[
	 *   "assets/images/MobileWallpaper/m1.avif",
	 *   "assets/images/MobileWallpaper/m2.avif",
	 * ],
	 */
	src: {
		// Desktop wallpaper (one image, or several picked at random)
		// desktop: "assets/images/DesktopWallpaper/d1.avif",
		desktop: "assets/images/wallpaper/sakura-desktop.webp",
		// Mobile wallpaper (one image, or several picked at random)
		// mobile: "assets/images/MobileWallpaper/m1.avif",
		mobile: "assets/images/wallpaper/sakura-mobile.webp",
		// Background video URL
		// One video (string) or several played in a loop (array, like the wallpapers above)
		// Remote video URLs work; put local videos in public/assets/videos/
		// playerUrl: "/assets/videos/firefly.mp4",
		playerUrl: "",
	},
	// Settings shared by banner and fullscreen modes
	common: {
		// Wallpaper dimming so banner text stays readable, 0-1; higher is darker
		dimOpacity: 0.2,
		// Multi-video mode: "order" loops in order, "random" shuffles (only when playerUrl is an array)
		playerMode: "random",
		// Home banner text
		homeText: {
			// Show the home banner text
			enable: true,
			// Home banner title
			title: "vInThePrism",
			// Home banner title font size
			titleSize: "4.5rem",
			// Home banner subtitles
			subtitle: [
				"Learning GPUs, one kernel at a time.",
				"AI Infra · CUDA · Training Performance",
			],
			// Home banner subtitle font size
			subtitleSize: "1.5rem",
			typewriter: {
				// Typewriter effect
				// on: cycles through every subtitle
				// off: shows one random subtitle per page load
				enable: true,
				// Typing speed (ms)
				speed: 100,
				// Deleting speed (ms)
				deleteSpeed: 50,
				// Pause after a line is fully shown (ms)
				pauseTime: 2000,
			},
			// Show link icons under the title
			linksEnable: true,
			// Link icons under the home banner title (optional; showName also shows the label)
			// Icons use Iconify names: fa7-brands:github, fa7-solid:envelope, mdi:rss, ...
			links: [
				{
					name: "GitHub",
					icon: "fa7-brands:github",
					url: "https://github.com/vInThePrism",
					showName: true,
				},
				{
					name: "RSS",
					icon: "fa7-solid:rss",
					url: "/rss/",
				},
			],
		},
		// Wallpaper carousel, shared by banner and fullscreen modes (only with several images)
		carousel: {
			// Enable the carousel; when off, one random image is shown per page load
			enable: false,
			// Interval between slides (ms)
			interval: 5000,
			// Transition: 'fade' | 'zoom' | 'slide' | 'kenburns'
			transitionEffect: "zoom",
		},
		// Wave animation (costs performance and memory; enable if you like it)
		waves: {
			enable: {
				// Waves on desktop
				desktop: true,
				// Waves on mobile
				mobile: true,
			},
		},
		// Gradient transition (used automatically when waves are off) from the wallpaper to the background color
		gradient: {
			enable: {
				// Gradient on desktop
				desktop: true,
				// Gradient on mobile
				mobile: true,
			},
			// Gradient height
			height: "10%",
		},
	},
	// Banner mode
	banner: {
		// Image position
		// Any CSS object-position value works, e.g. 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'
		// If unsure, use 'center', 'top', 'bottom', 'left' or 'right'
		position: "0% 20%",
		// Post banner info: "description" shows the description, "meta" shows date, word count and reading time
		postInfo: {
			mode: "description",
		},
		// Navbar
		navbar: {
			// Navbar transparency: "semi" translucent, "semifull" dynamic, "none" opaque
			transparentMode: "semi",
			// Frosted-glass blur; 0 turns it off
			// Note: navbar submenus and floating panels always keep some blur (this value, with a minimum)
			blur: 12,
		},
	},
	// Overlay mode
	overlay: {
		// z-index, keeps the wallpaper in the background
		zIndex: -1,
		// Wallpaper opacity
		opacity: 0.9,
		// Background blur
		blur: 10,
		// Card opacity, 0-1; lower is more transparent
		cardOpacity: 0.75,
	},
	// Fullscreen mode
	// Reuses blur, cardOpacity and zIndex from the overlay settings above;
	// opacity doesn't apply (fullscreen wallpapers are opaque); navbar transparency is set by fullscreen.navbar.transparentMode, separate from banner
	fullscreen: {
		// Layout: "classic" (scrolls with the page) or "hero" (fixed full-screen first view)
		layout: "classic",
		// Image position
		position: "center",
		// Navbar in fullscreen mode
		navbar: {
			// Navbar transparency: "semi" translucent, "semifull" dynamic (transparent at the top of the home page, glass when scrolled; translucent elsewhere)
			transparentMode: "semifull",
			// Navbar frosted-glass blur; 0 turns it off
			blur: 12,
		},
		// Blur the wallpaper while scrolling down the home page (ramps from 0 to overlay.blur)
		// When off, the fullscreen wallpaper stays sharp on that device and the blur slider is hidden
		blurRamp: {
			enable: {
				// Blur ramp on desktop
				desktop: true,
				// Blur ramp on mobile
				mobile: true,
			},
		},
	},
};
