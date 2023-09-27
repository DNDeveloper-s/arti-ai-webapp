'use client';

import {motion} from 'framer-motion';
import Logo from '@/components/Logo';
import React from 'react';

export default function ScreenLoader() {

	return (
		<motion.div className="fixed top-0 left-0 bg-background z-40 w-screen h-screen" initial={{'--tw-bg-opacity': 1, pointerEvents: 'all'}} animate={{'--tw-bg-opacity': 0, pointerEvents: 'none'}} transition={{delay: 0.35, type: 'tween', pointerEvents: {delay: 0.45} }}>
			<motion.div initial={{x: '-50%', y: '-50%', top: '50%', left: '50%'}} animate={{x: 0, y: 0, top: 15, left: 15}} transition={{type: 'spring', damping: 15, bounce: 0.15, delay: 0.2}} className="inline-block absolute">
				<div style={{width: 40, height: 40}}>
					<Logo width={'100%'} height={'100%'} />
				</div>
			</motion.div>
		</motion.div>
	)
}
