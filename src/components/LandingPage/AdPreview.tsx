import React, {FC} from 'react';
import amplifiedLogo from '@/assets/images/case-study/amplified/logo.jpg';
import amplifiedAdCreative from '@/assets/images/case-study/amplified/ad_creative.jpeg';
import everyOneImage from '@/assets/images/case-study/everyone.png';
import Image from 'next/image';
import {AiOutlineInfoCircle, AiOutlineLike} from 'react-icons/ai';
import {GoComment} from 'react-icons/go';
import {TbShare3} from 'react-icons/tb';
import {SlOptionsVertical} from 'react-icons/sl';
import {RxCross1} from 'react-icons/rx';
import {BiLogoPlayStore} from 'react-icons/bi';

interface AdPreviewProps {

}

const AdPreview: FC<AdPreviewProps> = (props) => {
	return (
		<div className={'w-full h-full relative bg-gray-800'}>
			<div className={'w-full h-full'}>
				<Image className={'w-full h-full object-contain'} src={amplifiedAdCreative} alt={'Amplified Ad Creative'} />
			</div>
			<div className={'absolute top-0 left-0 w-full h-full pt-3 flex flex-col justify-between'}>
				<div className={'absolute top-0 left-0 w-full h-[35%]'} style={{
					background: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)'
				}} />
				<div className={'flex items-center justify-between px-3 gap-4 z-10'}>
					<div className={'flex items-center gap-4'}>
						<RxCross1 />
						<div className={'w-11 h-11 rounded-full overflow-hidden'}>
							<Image className={'w-full h-full object-cover'} src={amplifiedLogo} alt={'Amplified Logo'} />
						</div>
						<div className={'flex flex-col justify-center gap-1'}>
							<div className={'text-base text-white font-bold'}>
								<span>AmplifiedEMS</span>
							</div>
							<div className={'flex items-center gap-2'}>
								<span className={'text-xs font-light text-gray-300'}>Sponsored</span>
								<div className={'w-0.5 h-0.5 bg-gray-200 rounded-full'} />
								<Image className={'w-2 h-2'} src={everyOneImage} alt={'Everyone Image'} />
							</div>
						</div>
					</div>
					<div className={'flex items-center gap-3 text-lg text-white cursor-pointer'}>
						<AiOutlineInfoCircle />
						<BiLogoPlayStore />
					</div>
				</div>
				<div className={'relative pb-3'}>
					<div className={'absolute bottom-0 left-0 w-full h-full'} style={{
						background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 60%)'
					}} />
					<div className={'text-white flex flex-col text-sm mt-3 mx-3 z-10 relative'}>
						<span className={'mb-1 text-lg font-bold text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]'}>Claim Your FREE Week!</span>
						<span className={'text-sm text-white mb-1'}>New Year, New You! 🎉 Kickstart your fitness journey with our exclusive FREE WEEK TRIAL! Embrace a healthier, stronger version of yourself in 2024. </span>
						<button className={'w-full py-2 bg-white text-blue-800 text-base font-light rounded-lg'}>Get Offer</button>
					</div>
				</div>
			</div>
		</div>
	);
};

interface AdPreview2Props {

}

export const AdPreview2: FC<AdPreview2Props> = (props) => {
	return (
		<div className={'w-full h-auto bg-white py-3'}>
			<div className={'flex items-center justify-between px-3 gap-4'}>
				<div className={'flex items-center gap-4'}>
					<div className={'w-11 h-11 rounded-full overflow-hidden'}>
						<Image className={'w-full h-full object-cover'} src={amplifiedLogo} alt={'Amplified Logo'} />
					</div>
					<div className={'flex flex-col justify-center gap-1'}>
						<div className={'text-base text-black font-bold'}>
							<span>AmplifiedEMS</span>
						</div>
						<div className={'flex items-center gap-2'}>
							<span className={'text-xs font-light text-gray-500'}>Sponsored</span>
							<div className={'w-0.5 h-0.5 bg-gray-400 rounded-full'} />
							<Image className={'w-2 h-2'} src={everyOneImage} alt={'Everyone Image'} />
						</div>
					</div>
				</div>
				<div className={'flex items-center gap-3 text-lg text-black cursor-pointer'}>
					<RxCross1 />
					<SlOptionsVertical />
				</div>
			</div>
			<div className={'text-black text-sm mt-3 px-3'}>
				<span>New Year, New You! 🎉 Kickstart your fitness journey with our exclusive FREE WEEK TRIAL! Embrace a healthier, stronger version of yourself in 2024. </span>
			</div>
			<div className={'w-full h-auto mt-4'}>
				<Image className={'w-full h-auto'} src={amplifiedAdCreative} alt={'Amplified Ad Creative'} />
			</div>
			<div className={'bg-gray-200 py-4 px-3 flex items-center justify-between'}>
				<div className={'text-black flex flex-col text-sm'}>
					<span>FORM ON FACEBOOK</span>
					<span className={'font-bold'}>Claim Your FREE Week!</span>
					<span>Reach your goals faster!</span>
				</div>
				<div>
					<button className={'py-1.5 px-3 bg-gray-300 rounded text-black font-bold cursor-pointer'}>Get Offer</button>
				</div>
			</div>
			<div className={'flex text-sm items-center justify-evenly text-black mt-3 px-3'}>
				<div className={'flex items-center gap-2'}>
					<AiOutlineLike />
					<span>Like</span>
				</div>
				<div className={'flex items-center gap-2'}>
					<GoComment />
					<span>Comment</span>
				</div>
				<div className={'flex items-center gap-2'}>
					<TbShare3 />
					<span>Share</span>
				</div>
			</div>
		</div>
	);
};

export default AdPreview;
