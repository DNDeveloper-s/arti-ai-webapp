import React, {FC} from 'react';
import CTAButton from '@/components/CTAButton';
import Link from 'next/link';

interface TryForFreeButtonProps {

}

const TryForFreeButton: FC<TryForFreeButtonProps> = (props) => {
	return (
		<Link href="/#arti-bot" className="breathing-button-primary z-30 border-2 !fixed bottom-8 right-8 border-primary !bg-primary flex items-center gap-3 py-3 px-6 rounded-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlSpace="preserve"
				width={512}
				height={512}
				style={{
					enableBackground: "new 0 0 512 512",
				}}
				className="fill-white stroke-white w-6 h-6"
				viewBox="0 0 24 24"
			>
				<path
					d="M18 1H6a5.006 5.006 0 0 0-5 5v8a5.009 5.009 0 0 0 4 4.9V22a1 1 0 0 0 1.555.832L12.3 19H18a5.006 5.006 0 0 0 5-5V6a5.006 5.006 0 0 0-5-5zm-2 12H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2zm2-4H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z"
					data-original="#000000"
				/>
			</svg>
			<span>Try for free</span>
		</Link>
	);
};

export default TryForFreeButton;
