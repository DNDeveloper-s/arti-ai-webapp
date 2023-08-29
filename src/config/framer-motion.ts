export const framerContainer = {
	hidden: { opacity: 0, y: -20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.05,
			staggerDirection: -1
		}
	}
}

export const framerContainerReverse = {
	hidden: { opacity: 0, y: -10 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.05,
			staggerDirection: 1
		}
	}
}

export const framerItem = (opacity = 1, y = -10) => ({
	hidden: { opacity: 0, y },
	show: { opacity, y: 0 }
})
