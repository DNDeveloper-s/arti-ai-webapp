import React, {FC, useState} from 'react';
import {LuDownload} from 'react-icons/lu';
import {motion} from 'framer-motion';
import Loader from '@/components/Loader';
import {FcRefresh} from 'react-icons/fc';
import {HiRefresh} from 'react-icons/hi';
import {Mock} from '@/constants/servicesData';

interface GetAdButtonProps {
	onClick?: (setLoading: React.Dispatch<boolean>) => any;
	adGenerated?: boolean;
	mock?: Mock
}

const GetAdButton: FC<GetAdButtonProps> = ({mock = new Mock(), ...props}) => {
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
			style={{
				// zoom: mock.is ? 0.5 : 1
			}}
			className={('breathing-button rounded absolute -top-10 md:-top-12 right-10 md:right-12 ') + (props.adGenerated ? 'w-40' : 'w-36') + (mock.is ? ' h-auto w-24 ' : ' h-10 ')}
			onClick={() => {
				console.log('clicking - ');
				setLoading(true);
				props.onClick && props.onClick(setLoading);
			}}
		>
			<div className="z-10 border border-gray-600 rounded bg-secondaryBackground w-full h-full flex justify-center items-center text-sm font-diatype">
				{loading ? <Loader /> : <>
					{props.adGenerated ? <HiRefresh style={{fontSize: '22px'}}/> : <LuDownload style={{fontSize: '16px'}}/>}
					<span className={'ml-3 md:ml-3 ' + (mock.is ? ' ml-1' : '')}>{props.adGenerated ? 'Regenerate Ad' : 'Get Ad Now'}</span>
				</>}
			</div>
		</motion.button>
	)
}

export default GetAdButton;
