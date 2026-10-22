import type { Live2DWidgetConfig, SpineModelConfig } from "../types/pioConfig";

// Spine mascot
export const spineModelConfig: SpineModelConfig = {
	// Enable the Spine mascot
	enable: false,

	// Spine model
	model: {
		// Spine model file path
		path: "/pio/models/spine/firefly/1310.json",
		// Model scale
		scale: 1.0,
		// X offset
		x: 0,
		// Y offset
		y: 0,
	},

	// Position
	position: {
		// Corner: bottom-left, bottom-right, top-left or top-right (bottom-right may cover the back-to-top button)
		corner: "bottom-left",
		// 0px from the side edge
		offsetX: 0,
		// 0px from the bottom edge
		offsetY: 0,
	},

	// Size
	size: {
		// Container width
		width: 135,
		// Container height
		height: 165,
	},

	// Interaction
	interactive: {
		// Enable interaction
		enabled: true,
		// Animations played at random on click
		clickAnimations: [
			"emoji_0",
			"emoji_1",
			"emoji_2",
			"emoji_3",
			"emoji_4",
			"emoji_5",
		],
		// Messages shown at random on click
		clickMessages: [
			"Hi there!",
			"You've got this today! ✨",
			"Want to go stargazing? 🌟",
			"Remember to take a break~",
			"Anything you want to tell me? 💫",
			"Let's explore something new! 🚀",
			"Every star has its own story~ ⭐",
			"Hope this makes your day a little brighter! 💖",
		],
		// How long a message stays (ms)
		messageDisplayTime: 3000,
		// Idle animations
		idleAnimations: ["idle", "emoji_0", "emoji_1", "emoji_3", "emoji_4"],
		// Interval between idle animations (ms)
		idleInterval: 8000,
	},

	// Responsive
	responsive: {
		// Hide on mobile
		hideOnMobile: true,
		// Mobile breakpoint
		mobileBreakpoint: 768,
	},

	// z-index
	zIndex: 1000, // z-index

	// Opacity
	opacity: 1.0,
};

// Live2D mascot (uses l2d-widget, docs: https://l2d-widget.hacxy.cn)
export const live2dWidgetConfig: Live2DWidgetConfig = {
	// Enable the Live2D mascot
	enable: false,
	// Model: one model, or an array to switch between models
	model: [
		{
			// Local Live2D model path
			path: "/pio/models/live2d/snow_miku/model.json",
			// Motion sound volume, 0-1 (default 0 = muted)
			volume: 0,
			// Model scale
			scale: 1,
			// X offset, -2 to 2; positive moves right
			x: 0,
			// Y offset, -2 to 2; positive moves up
			y: 0,
		},
		{
			// Remote model
			path: "https://model.hacxy.cn/cat-black/model.json",
			volume: 0,
			scale: 1,
			x: 0,
			y: 0,
		},
	],
	// Corner: bottom-left or bottom-right
	position: "bottom-left" as const,
	// Canvas size (px)
	size: { width: 200, height: 200 },
	// Accent color for the menu, status bar and other UI, default 'rgba(96,165,250,0.9)'
	primaryColor: "var(--l2d-msg-bg)",
	// Enter/exit animation duration (ms)
	transitionDuration: 1500,
	// Enter/exit animation type
	transitionType: "slide" as const,
	// Menu
	menus: {
		// Replaces the default menu items entirely
		items: [
			{
				icon: "mdi:home",
				label: "Home",
				action: "home",
			},
			{
				icon: "mdi:arrow-up",
				label: "Back to top",
				action: "scrollToTop",
			},
			{
				icon: "mdi:bed",
				label: "Sleep",
				action: "sleep",
			},
			{
				icon: "mdi:swap-horizontal",
				label: "Switch model",
				action: "switchModel",
			},
			{
				icon: "mdi:github",
				label: "GitHub",
				action: "github",
			},
		],
		// Menu alignment
		align: "right" as const,
	},
	// Speech bubble
	tips: {
		// Enable the speech bubble
		enable: true,
		// Welcome messages
		welcomeMessage: ["Hi there!", "Welcome to my corner of the web!"],
		// Messages shown in rotation
		messages: [
			"Need a hand with anything?",
			"Lovely weather today!",
			"Want to play a game?",
			"Remember to rest!",
		],
		// How long a message stays (ms)
		duration: 3000,
		// Interval between messages (ms)
		interval: 6000,
		// Offset in px from the default position (centered above the model)
		offset: {
			x: 0, // positive moves right, negative left
			y: 0, // positive moves down, negative up
		},
	},
	// Responsive
	responsive: {
		// Hide on mobile
		hideOnMobile: true,
		// Mobile breakpoint
		mobileBreakpoint: 768,
	},
};
