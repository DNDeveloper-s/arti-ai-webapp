import React, {FC} from 'react';
import {motion} from 'framer-motion'
import {LuDownload} from 'react-icons/lu';

interface CTA {
	className?: string;
	children: React.ReactElement;
	onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const CTAButton: FC<CTA> = ({className = '', children, onClick = () => {}}) => {
	return (
		<motion.button whileHover={{
			scale: 1.02,
			transition: { duration: 0.15 },
		}} whileTap={{scale: 0.99}} onClick={onClick} initial={{y: -10, opacity: 0}} animate={{y: 0, opacity: 1}}
		               transition={{type: 'spring', damping: 10}}
		               className={'cta-button ' + className}>
			{children}
		</motion.button>
	)
}

export default CTAButton;
