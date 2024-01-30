import React, {FC} from 'react';
import amplifiedLogo from '@/assets/images/case-study/amplified/logo.jpg';
import amplifiedAdCreative from '@/assets/images/case-study/amplified/raw_1.jpeg';
import everyOneImage from '@/assets/images/case-study/everyone.png';
import Image, {StaticImageData} from 'next/image';
import {AiOutlineInfoCircle, AiOutlineLike} from 'react-icons/ai';
import {GoComment} from 'react-icons/go';
import {TbShare3} from 'react-icons/tb';
import {SlOptions, SlOptionsVertical} from 'react-icons/sl';
import {RxCross1} from 'react-icons/rx';
import {BiLogoPlayStore} from 'react-icons/bi';
import midtownEastImage from '@/assets/images/carousel-images/6.png'
import {Brand} from '@/constants/landingPageData';

interface AdPreviewProps {
	brand: Brand
}

const AdPreview: FC<AdPreviewProps> = ({brand}) => {
	return (
		<div className={'w-full h-full relative ad-preview-card bg-gray-800'} style={{
			'--shadow': '0 0 50px #bebebe45',
		}}>
			<div className={'w-full h-full'}>
				<Image className={'w-full h-full object-contain'} src={brand.adCreative} alt={'Amplified Ad Creative'} />
			</div>
			<div className={'absolute top-0 left-0 w-full h-full pt-3 flex flex-col justify-between'}>
				<div className={'absolute top-0 left-0 w-full h-[35%]'} style={{
					background: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)'
				}} />
				<div className={'flex items-center justify-between px-3 gap-4 z-10'}>
					<div className={'flex items-center gap-4'}>
						<RxCross1 />
						<div className={'w-11 h-11 rounded-full overflow-hidden'}>
							<Image className={'w-full h-full object-cover'} src={brand.logo} alt={'Amplified Logo'} />
						</div>
						<div className={'flex flex-col justify-center gap-1'}>
							<div className={'text-base text-white font-bold overflow-hidden'}>
								<span>{brand.label}</span>
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
						<span className={'mb-1 text-lg font-bold text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]'}>{brand.offer}</span>
						<span className={'text-sm text-white mb-1'}>{brand.offerDescription}</span>
						<button className={'w-full py-2 bg-white text-blue-800 text-base font-light rounded-lg'}>{brand.cta}</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const AdPreview2: FC<AdPreviewProps> = ({brand}) => {
	return (
		<div className={'w-full h-auto bg-white ad-preview-card py-3'} style={{
			'--shadow': '0 0 50px #bebebecf',
		}}>
			<div className={'flex items-center justify-between px-3 gap-4'}>
				<div className={'flex items-center gap-4'}>
					<div className={'w-11 h-11 rounded-full overflow-hidden'}>
						<Image className={'w-full h-full object-cover'} src={brand.logo} alt={'Amplified Logo'} />
					</div>
					<div className={'flex flex-col justify-center gap-1'}>
						<div className={'text-base text-black font-bold overflow-hidden'}>
							<span className={'truncate block max-w-[200px]'}>{brand.label}</span>
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
				<span>{brand.offerDescription}</span>
			</div>
			<div className={'w-full h-auto mt-4'}>
				<Image className={'w-full h-auto'} src={brand.adCreative} alt={'Amplified Ad Creative'} />
			</div>
			<div className={'bg-gray-200 py-4 px-3 flex items-center justify-between'}>
				<div className={'text-black flex flex-col text-sm'}>
					<span>FORM ON FACEBOOK</span>
					<span className={'font-bold'}>{brand.offer}</span>
					<span>{brand.subOffer}</span>
				</div>
				<div>
					<button className={'py-1.5 px-3 bg-gray-300 rounded text-black font-bold cursor-pointer'}>{brand.cta}</button>
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

export const AdPreview3: FC<AdPreviewProps> = ({brand}) => {
	return (
		<div className={'w-full h-auto bg-white ad-preview-card py-3'} style={{
			'--shadow': '0 0 50px #bebebecf',
		}}>
			<div className={'flex items-center justify-between px-3 gap-4'}>
				<div className={'flex items-center gap-4'}>
					<div className={'w-11 h-11 rounded-full overflow-hidden'}>
						<Image className={'w-full h-full object-cover'} src={brand.logo} alt={'Amplified Logo'} />
					</div>
					<div className={'flex flex-col justify-center gap-1'}>
						<div className={'text-base text-black font-bold'}>
							<span>{brand.label}</span>
						</div>
						<div className={'flex items-center gap-2'}>
							<span className={'text-xs font-light text-gray-500'}>Sponsored</span>
							<div className={'w-0.5 h-0.5 bg-gray-400 rounded-full'} />
							<Image className={'w-2 h-2'} src={everyOneImage} alt={'Everyone Image'} />
						</div>
					</div>
				</div>
				<div className={'flex items-center gap-3 text-lg text-black cursor-pointer'}>
					<SlOptions />
					<RxCross1 />
				</div>
			</div>
			<div className={'my-4 px-3'}>
				<div className={'flex gap-4 bg-gray-100 rounded-lg overflow-hidden'}>
					<div className={'w-auto flex-shrink-0 h-[100px]'}>
						<Image className={'w-full h-full'} src={brand.adCreative} alt={'Amplified Ad Creative'} />
					</div>
					<div className={'text-black flex flex-col gap-0.5 text-base justify-center overflow-hidden pr-3'}>
						<span>{brand.offer}</span>
						<span className={'truncate text-sm'}>{brand.offerDescription}</span>
						<span className={'text-sm'}>FORM ON FACEBOOK</span>
					</div>
				</div>
			</div>
			<div className={'w-full border-t border-gray-300'} />
			{/*<div className={'w-full h-auto mt-4'}>*/}
			{/*	<Image className={'w-full h-auto'} src={amplifiedAdCreative} alt={'Amplified Ad Creative'} />*/}
			{/*</div>*/}
			{/*<div className={'bg-gray-200 py-4 px-3 flex items-center justify-between'}>*/}
			{/*	<div className={'text-black flex flex-col text-sm'}>*/}
			{/*		<span>FORM ON FACEBOOK</span>*/}
			{/*		<span className={'font-bold'}>Claim Your FREE Week!</span>*/}
			{/*		<span>Reach your goals faster!</span>*/}
			{/*	</div>*/}
			{/*	<div>*/}
			{/*		<button className={'py-1.5 px-3 bg-gray-300 rounded text-black font-bold cursor-pointer'}>Get Offer</button>*/}
			{/*	</div>*/}
			{/*</div>*/}
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
