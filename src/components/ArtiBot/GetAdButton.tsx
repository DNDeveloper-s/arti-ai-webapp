import React, {FC, useState} from 'react';
import {LuDownload} from 'react-icons/lu';
import {motion} from 'framer-motion';
import Loader from '@/components/Loader';

interface GetAdButtonProps {
	onClick?: (setLoading: React.Dispatch<boolean>) => any;
}

const GetAdButton: FC<GetAdButtonProps> = (props) => {
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<motion.button
			whileHover={{
				scale: 1.05,
				transition: { duration: 0.2 },
			}}
			whileTap={{scale: 0.98}}
			initial={{y: -10, opacity: 0}}
			animate={{y: 0, opacity: 1}}
			transition={{type: 'spring', damping: 10}}
			className="cta-button w-52 h-14 absolute flex justify-center items-center text-lg font-diatype -top-14 md:-top-20 right-10 md:right-20"
			onClick={() => {
				console.log('clicking - ');
				setLoading(true);
				props.onClick && props.onClick(setLoading);
			}}
		>
			{loading ? <Loader /> : <>
				<LuDownload style={{fontSize: '22px'}}/>
				<span className="ml-3 md:ml-5">Get Ad Now</span>
			</>}
		</motion.button>
	)
}

export default GetAdButton;
