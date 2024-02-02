import React, {FC, useRef} from 'react';
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
import {Brand, BrandVariant} from '@/constants/landingPageData';
import {motion} from 'framer-motion';
import dummyImage from '@/assets/images/image4.webp';
import useMousePos from '@/hooks/useMousePos';
import {CloseIcon} from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

interface AdPreviewProps {
	brand: Brand
	image?: StaticImageData
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

export const AdPreviewBlack4: FC<AdPreviewProps> = ({brand}) => {
	return (
		<div className={'w-full h-auto bg-gray-800 ad-preview-card py-3'} style={{
			'--shadow': '0 0 50px #bebebe45',
		}}>
			<div className={'flex items-center justify-between px-3 gap-4'}>
				<div className={'flex items-center gap-4'}>
					<div className={'w-11 h-11 rounded-full overflow-hidden'}>
						<Image className={'w-full h-full object-cover'} src={brand.logo} alt={'Amplified Logo'} />
					</div>
					<div className={'flex flex-col justify-center gap-1'}>
						<div className={'text-base text-white font-bold overflow-hidden'}>
							<span className={'truncate block max-w-[200px]'}>{brand.label}</span>
						</div>
						<div className={'flex items-center gap-2'}>
							<span className={'text-xs font-light text-gray-300'}>Sponsored</span>
							<div className={'w-0.5 h-0.5 bg-gray-200 rounded-full'} />
							<Image className={'w-2 h-2'} src={everyOneImage} alt={'Everyone Image'} />
						</div>
					</div>
				</div>
				<div className={'flex items-center gap-3 text-lg text-white cursor-pointer'}>
					<RxCross1 />
					<SlOptionsVertical />
				</div>
			</div>
			<div className={'text-white text-sm mt-3 px-3'}>
				<span>{brand.offerDescription}</span>
			</div>
			<div className={'w-full h-auto mt-4'}>
				<Image className={'w-full h-auto'} src={brand.adCreative} alt={'Amplified Ad Creative'} />
			</div>
			<div className={'bg-gray-700 py-4 px-3 flex items-center justify-between'}>
				<div className={'text-white flex flex-col text-sm'}>
					<span>FORM ON FACEBOOK</span>
					<span className={'font-bold'}>{brand.offer}</span>
					<span>{brand.subOffer}</span>
				</div>
				<div>
					<button className={'py-1.5 px-3 bg-gray-600 rounded text-white font-bold cursor-pointer'}>{brand.cta}</button>
				</div>
			</div>
			<div className={'flex text-sm items-center justify-evenly text-white mt-3 px-3'}>
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

export const AdPreviewBlack5: FC<AdPreviewProps> = ({brand}) => {
	return (
		<div className={'w-full h-auto bg-gray-800 ad-preview-card py-3'} style={{
			'--shadow': '0 0 50px #bebebe45',
		}}>
			<div className={'flex items-center justify-between px-3 gap-4'}>
				<div className={'flex items-center gap-4'}>
					<div className={'w-11 h-11 rounded-full overflow-hidden'}>
						<Image className={'w-full h-full object-cover'} src={brand.logo} alt={'Amplified Logo'} />
					</div>
					<div className={'flex flex-col justify-center gap-1'}>
						<div className={'text-base text-white font-bold'}>
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
					<SlOptions />
					<RxCross1 />
				</div>
			</div>
			<div className={'my-4 px-3'}>
				<div className={'flex gap-4 bg-gray-700 rounded-lg overflow-hidden'}>
					<div className={'w-auto flex-shrink-0 h-[100px]'}>
						<Image className={'w-full h-full'} src={brand.adCreative} alt={'Amplified Ad Creative'} />
					</div>
					<div className={'text-white flex flex-col gap-0.5 text-base justify-center overflow-hidden pr-3'}>
						<span>{brand.offer}</span>
						<span className={'truncate text-sm'}>{brand.offerDescription}</span>
						<span className={'text-sm'}>FORM ON FACEBOOK</span>
					</div>
				</div>
			</div>
			<div className={'w-full border-t border-gray-600'} />
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
			<div className={'flex text-sm items-center justify-evenly text-white mt-3 px-3'}>
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

// export const FacebookAdPreview: FC<AdPreviewProps> = ({brand}) => {
//
// 	return (
// 		<div className={'ad-variant text-xs md:text-base !p-0 '} style={{fontSize: '12px'}}>
// 			<div className={"flex justify-between items-center mb-[.3em] px-[1em] pt-[1em]"}>
// 				<div className="flex items-center gap-[0.5em]">
// 					<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
// 					<div>
// 						<div className="w-[4em] h-[1em] mb-[0.2em] rounded-[.17em] bg-gray-700" />
// 						<div className="w-[6em] h-[1em] rounded-[.17em] bg-gray-700" />
// 					</div>
// 				</div>
// 				<SlOptions className="text-[1.5em]" />
// 			</div>
// 			{/*<div className="mb-[1em] px-[1em]">*/}
// 			<div className="mb-[0.5em] text-[1.1em] leading-[1.6] py-[0.6em] px-[1em] relative">
// 				<span className={'inline-flex'}>{brand.offerDescription}</span>
// 			</div>
// 			<div className="relative">
// 				<Image width={600} height={100} className="mb-[0.5em] w-full" src={brand.adCreative} alt="Ad Image" />
// 			</div>
// 			<div className={"flex justify-between gap-[.8em] items-center px-[1em] mt-[0.5em]"}>
// 				<div className="relative px-1 py-1 text-[1.25em] leading-[1.3em] flex-1">
// 					<span>Fast, Accessible, For Everyone</span>
// 				</div>
// 				<div className="flex-shrink-0">
// 					<span className="cursor-pointer rounded bg-gray-700 px-[0.6em] py-[0.5em] text-[1em]">Learn More</span>
// 				</div>
// 			</div>
// 			<hr className="h-px my-[1em] border-0 bg-gray-700"/>
// 			<div className="w-full pb-[1em] flex justify-between">
// 				<div className="ml-[2em] w-[6.5em] h-[2em] rounded bg-gray-700" />
// 				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
// 				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
// 				<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
// 			</div>
// 		</div>
// 	)
// }

interface FacebookAdPreviewProps {
	variant: BrandVariant
}
export const FacebookAdPreview:FC<FacebookAdPreviewProps> = ({variant}) => {
	const artiCardRef = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(artiCardRef);

	const classes = {
		container: {
			normal: 'arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default',
			modal: 'arti-card transition-transform flex-shrink-0 rounded-lg cursor-default'
		},
		inner: {
			normal: 'p-3 relative h-full bg-gray-950 w-64 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group',
			modal: 'p-3 relative h-full bg-gray-950 w-auto rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype'
		},
		head: {
			normal: 'group-hover:max-h-[300px] max-h-0 overflow-hidden transition-all',
			modal: 'max-h-[300px]'
		},
		bottom: {
			normal: 'group-hover:max-h-[100px] max-h-0 overflow-hidden transition-all',
			modal: 'max-h-[100px]'
		},
		description: {
			normal: "text-[0.7em] leading-[1.3em] line-clamp-3",
			modal: "text-[0.85em] leading-[1.5em] line-clamp-3"
		},
		oneLiner: {
			normal: "text-[0.75em] leading-[1.35em]",
			modal: "text-[0.95em] leading-[1.25em]"
		},
		learnMore: {
			normal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.55em]",
			modal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.75em]"
		}
	}

	const getClassName = (key: keyof typeof classes) => {
		return classes[key].modal;
	}

	return (
		<div className={getClassName('container')} ref={artiCardRef} style={{boxShadow: '0 0 50px #bebebe45', '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			{/*{isModal && <div className="absolute top-2 right-3 p-1 bg-gray-200 text-white rounded-full">*/}
			{/*	<CloseIcon/>*/}
			{/*</div>}*/}
			<div className={getClassName('inner')}>
				{/* Head Section */}
				<div className={getClassName('head')}>
					<div className={"flex justify-between items-center mb-1 pt-1"}>
						<div className="flex items-center gap-1">
							<div className="w-5 h-5 rounded-full bg-gray-700" />
							<div>
								<div className="w-12 h-2 mb-1 rounded bg-gray-700" />
								<div className="w-16 h-2 rounded bg-gray-700" />
							</div>
						</div>
						<SlOptions className="text-xs" />
					</div>
					<div className="my-4">
						<span className={getClassName('description')}>{variant.description}</span>
					</div>
				</div>

				<div className='overflow-hidden rounded w-full h-auto'>
					{/*<Image width={640} height={640} src="https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png" alt="Image" />*/}
					<Image width={640} height={640} src={variant.image} alt="Image" />
				</div>
				{/*<h3 className={"text-xs font-medium text-gray-100 mt-3"}>Empower Your Farming with Precision Technology</h3>*/}
				<div className={"flex justify-between gap-2 items-center my-3"}>
					<span className={getClassName('oneLiner')}>{variant.oneLiner}</span>
					<div className="flex-shrink-0">
						<span className={getClassName('learnMore')}>Learn More</span>
					</div>
				</div>
				<div className={getClassName('bottom')}>
					<hr className="h-px my-3 border-0 bg-gray-700"/>
					<div className="w-full flex justify-between">
						<div className="ml-2 w-10 h-4 rounded-[3px] bg-gray-700" />
						<div className="w-10 h-4 rounded-[3px] bg-gray-700" />
						<div className="w-10 h-4 rounded-[3px] bg-gray-700" />
						<div className="w-4 h-4 rounded-full bg-gray-700" />
					</div>
				</div>
			</div>
		</div>
	)
}

export const FacebookAdPreview2:FC<FacebookAdPreviewProps> = ({variant}) => {
	const artiCardRef = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(artiCardRef);

	const classes = {
		container: {
			normal: 'arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default',
			modal: 'arti-card transition-transform flex-shrink-0 rounded-lg cursor-default'
		},
		inner: {
			normal: 'p-3 relative h-full bg-gray-950 w-64 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group',
			modal: 'p-3 relative h-full bg-gray-950 w-auto rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype'
		},
		head: {
			normal: 'group-hover:max-h-[300px] max-h-0 overflow-hidden transition-all',
			modal: 'max-h-[300px]'
		},
		bottom: {
			normal: 'group-hover:max-h-[100px] max-h-0 overflow-hidden transition-all',
			modal: 'max-h-[100px]'
		},
		description: {
			normal: "text-[0.7em] leading-[1.3em] line-clamp-3",
			modal: "text-[0.85em] leading-[1.5em] line-clamp-3"
		},
		oneLiner: {
			normal: "text-[0.75em] leading-[1.35em]",
			modal: "text-[0.95em] leading-[1.25em]"
		},
		learnMore: {
			normal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.55em]",
			modal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.75em]"
		}
	}

	const getClassName = (key: keyof typeof classes) => {
		return classes[key].modal;
	}

	return (
		<div className={getClassName('container')} ref={artiCardRef} style={{boxShadow: '0 0 50px #bebebe45', '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			{/*{isModal && <div className="absolute top-2 right-3 p-1 bg-gray-200 text-white rounded-full">*/}
			{/*	<CloseIcon/>*/}
			{/*</div>}*/}
			<div className={getClassName('inner')}>
				{/* Head Section */}
				<div className={getClassName('head')}>
					<div className={"flex justify-between items-center mb-1 pt-1"}>
						<div className="flex items-center gap-1">
							<div className="w-5 h-5 rounded-full bg-gray-700" />
							<div>
								<div className="w-12 h-2 mb-1 rounded bg-gray-700" />
								<div className="w-16 h-2 rounded bg-gray-700" />
							</div>
						</div>
						<SlOptions className="text-xs" />
					</div>
				</div>
				<div className={'flex items-center gap-4 my-4'}>
					<div className='overflow-hidden rounded h-[140px] w-auto flex-shrink-0'>
						{/*<Image width={640} height={640} src="https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png" alt="Image" />*/}
						<Image className={'h-full w-auto'} src={variant.image} alt="Image" />
					</div>
					<div>
						<div className="mb-2">
							<span className={getClassName('description')}>{variant.description}</span>
						</div>
						<div className={"flex flex-col justify-center gap-2 items-start mt-3"}>
							<span className={getClassName('oneLiner')}>{variant.oneLiner}</span>
							<div className="flex-shrink-0">
								<span className={getClassName('learnMore')}>Learn More</span>
							</div>
						</div>
					</div>
				</div>


				{/*<h3 className={"text-xs font-medium text-gray-100 mt-3"}>Empower Your Farming with Precision Technology</h3>*/}
				<div className={getClassName('bottom')}>
					<hr className="h-px my-2 border-0 bg-gray-700"/>
					<div className="w-full flex justify-between">
						<div className="ml-2 w-12 h-5 rounded-[3px] bg-gray-700" />
						<div className="w-12 h-5 rounded-[3px] bg-gray-700" />
						<div className="w-12 h-5 rounded-[3px] bg-gray-700" />
						<div className="w-5 h-5 rounded-full bg-gray-700" />
					</div>
				</div>
			</div>
		</div>
	)
}

export const FacebookAdPreviewMini:FC<FacebookAdPreviewProps> = ({variant}) => {
	const artiCardRef = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(artiCardRef);

	const classes = {
		container: {
			normal: 'arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default',
			modal: 'arti-card transition-transform flex-shrink-0 rounded-lg cursor-default'
		},
		inner: {
			normal: 'p-3 relative h-full bg-gray-950 w-64 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group',
			modal: 'p-3 relative h-full bg-gray-950 w-auto rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype'
		},
		head: {
			normal: 'group-hover:max-h-[300px] max-h-0 overflow-hidden transition-all',
			modal: 'max-h-[300px]'
		},
		bottom: {
			normal: 'group-hover:max-h-[100px] max-h-0 overflow-hidden transition-all',
			modal: 'max-h-[100px]'
		},
		description: {
			normal: "text-[0.7em] leading-[1.3em] line-clamp-3",
			modal: "text-[0.75em] leading-[1.45em] line-clamp-3"
		},
		oneLiner: {
			normal: "text-[0.75em] leading-[1.35em]",
			modal: "text-[0.75em] truncate leading-[1.35em]"
		},
		learnMore: {
			normal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.55em]",
			modal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.75em]"
		}
	}

	const getClassName = (key: keyof typeof classes) => {
		return classes[key].modal;
	}

	return (
		<div className={getClassName('container')} ref={artiCardRef} style={{boxShadow: '0 0 50px #bebebe45', '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			{/*{isModal && <div className="absolute top-2 right-3 p-1 bg-gray-200 text-white rounded-full">*/}
			{/*	<CloseIcon/>*/}
			{/*</div>}*/}
			<div className={getClassName('inner')}>
				{/* Head Section */}
				<div className={getClassName('head')}>
					<div className={"flex justify-between items-center mb-1 pt-1"}>
						<div className="flex items-center gap-1">
							<div className="w-5 h-5 rounded-full bg-gray-700" />
							<div>
								<div className="w-12 h-2 mb-1 rounded bg-gray-700" />
								<div className="w-16 h-2 rounded bg-gray-700" />
							</div>
						</div>
						<SlOptions className="text-xs" />
					</div>
					<div className="my-2">
						<span className={getClassName('description')}>{variant.description}</span>
					</div>
				</div>

				<div className='overflow-hidden rounded w-full h-auto aspect-square bg-gray-700'>
					{/*<Image width={640} height={640} src="https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png" alt="Image" />*/}
					<Image width={640} height={640} src={variant.image} alt="Image" className='w-full h-full active:object-contain object-cover' />
				</div>
				{/*<h3 className={"text-xs font-medium text-gray-100 mt-3"}>Empower Your Farming with Precision Technology</h3>*/}
				<div className={"flex justify-between gap-2 items-center my-2"}>
					<span className={getClassName('oneLiner')}>{variant.oneLiner}</span>
					<div className="flex-shrink-0">
						<span className={getClassName('learnMore')}>Learn More</span>
					</div>
				</div>
				<div className={getClassName('bottom')}>
					<hr className="h-px my-2 border-0 bg-gray-700"/>
					<div className="w-full flex justify-between">
						<div className="ml-2 w-10 h-4 rounded-[3px] bg-gray-700" />
						<div className="w-10 h-4 rounded-[3px] bg-gray-700" />
						<div className="w-10 h-4 rounded-[3px] bg-gray-700" />
						<div className="w-4 h-4 rounded-full bg-gray-700" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default AdPreview;
