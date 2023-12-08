'use client';

import React, {FC} from 'react';
import {AnimatePresence, motion} from 'framer-motion'
import {LuDownload} from 'react-icons/lu';
import {useRouter} from 'next/navigation';

interface CTA {
	className?: string;
	children: React.ReactElement;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	to?: string;
}
const CTAButton: FC<CTA> = ({className = '', to, children, onClick = () => {}}) => {
	const router = useRouter();

	function handleClick(e) {
		if(to) return router.push(to);
		onClick(e);
	}

	return (
		<AnimatePresence mode="wait">
			<motion.button whileHover={{
				scale: 1.02,
				transition: { duration: 0.15 },
			}} whileTap={{scale: 0.99}} onClick={handleClick} initial={{y: -10, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -10, opacity: 0}}
			               transition={{type: 'spring', damping: 10}}
			               className={'cta-button breathing-button-primary ' + className}>
				{children}
			</motion.button>
		</AnimatePresence>
	)
}

export default CTAButton;
