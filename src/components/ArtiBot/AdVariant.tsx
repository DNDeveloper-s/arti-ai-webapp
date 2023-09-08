import React, {useRef, useState} from 'react';
import {AiFillDislike, AiFillLike} from 'react-icons/ai';
import {motion} from 'framer-motion';
import Image from 'next/image';
import dummyImage from '@/assets/images/dummy2.webp';
import {IAdVariant} from '@/constants/artibotData';

export default function AdVariant({adVariant, noExpand, ...props}: {adVariant: IAdVariant, [key: string]: any}) {
	const [expand, setExpand] = useState<boolean>(noExpand || false);
	const headingRef = useRef<HTMLHeadingElement>(null);

	// useEffect(() => {
	// 	if(!headingRef.current) return;
	// 	// const height = headingRef.current.offsetTop;
	// 	headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
	// }, [expand])

	return (
		<div key={adVariant['One Liner']} className="ad-variant text-xs md:text-base" {...props}>
			<div className="flex justify-between items-center mb-3">
				<h2 ref={headingRef} className="font-bold font-diatype text-[1.3em] flex items-center cursor-pointer" onClick={(e) => {
					if(!noExpand) setExpand(c => !c)
				}}><span className="inline leading-6">{adVariant['One Liner']}</span>
					{adVariant['Ad Type'] && <span className="text-[0.6em] py-1 px-2 ml-3 font-regular bg-white bg-opacity-10 text-primary rounded-lg upper">{adVariant['Ad Type'].split(' ')[0]}</span>}

				</h2>
				<div className="flex items-center ml-2">
					<AiFillLike className="mr-[0.8em] cursor-pointer text-[1.2em] text-secondaryText" />
					<AiFillDislike className="text-[1.2em] cursor-pointer text-secondaryText" />
				</div>
			</div>
			<motion.div className="px-[1.75em] overflow-hidden" initial={{height: noExpand ? 'auto' : 0}} onAnimationEnd={() => {
				headingRef.current && headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
			}} animate={{height: expand ? 'auto' : 0}}>
				<ol className="list-decimal">
					<li className="pl-1">
						<span className="text-[1.05em] font-medium"><strong>Ad Orientation</strong></span>
						<p className="mt-[0.3em] text-[1em] font-diatype opacity-60">{adVariant['Ad orientation']}</p>
					</li>
					<div className="my-[2em] relative bg-background bg-opacity-50 p-[1em] rounded-lg">
						<Image width={500} height={100} className="mb-3 w-full max-w-[30em]" src={dummyImage} alt="Ad Image" />
						<p className="leading-[1.5em] text-[0.85em] font-diatype opacity-60">{adVariant.Text}</p>
					</div>
					<li className="pl-1 relative">
						<p className="text-[1.05em] font-medium z-10 relative"><strong>Image Description</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60 relative z-10">{adVariant['Image Description']}</p>
						{/*<div className="w-full h-full bg-secondaryText bg-opacity-30 rounded animate-pulse absolute top-0 left-0" />*/}
					</li>
					<li className="pl-1">
						<p className="text-[1.05em] font-medium"><strong>Rationale</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60">{adVariant.Rationale}</p>
					</li>
				</ol>
			</motion.div>
		</div>
	)
}
