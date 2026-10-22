import type { SakuraConfig } from "../types/effectsConfig";

// Visual effects (all animations live here)

export const sakuraConfig: SakuraConfig = {
	// Enable falling sakura petals
	enable: false,

	// Number of petals
	sakuraNum: 21,

	// How many times a petal may leave the screen before stopping; -1 loops forever
	limitTimes: -1,

	// Petal size
	size: {
		// Minimum size multiplier
		min: 0.5,
		// Maximum size multiplier
		max: 1.1,
	},

	// Petal opacity
	opacity: {
		// Minimum opacity
		min: 0.3,
		// Maximum opacity
		max: 0.9,
	},

	// Petal speed
	speed: {
		// Horizontal movement
		horizontal: {
			// Minimum horizontal speed
			min: -1.7,
			// Maximum horizontal speed
			max: -1.2,
		},
		// Vertical movement
		vertical: {
			// Minimum vertical speed
			min: 1.5,
			// Maximum vertical speed
			max: 2.2,
		},
		// Rotation speed
		rotation: 0.03,
		// Fade-out speed; should not exceed the minimum opacity
		fadeSpeed: 0.03,
	},

	// z-index so petals render on the right layer
	zIndex: 100,
};
