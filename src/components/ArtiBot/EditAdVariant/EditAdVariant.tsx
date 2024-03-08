import React, {useState, useEffect, useRef, FC, useContext, useMemo} from 'react';
import {AdCreativeVariant} from '@/interfaces/IAdCreative';
import {timeSince, wait} from '@/helpers';
import Image1 from 'next/image';
import {RiAiGenerate} from 'react-icons/ri';
import { REACTION } from '@/interfaces';
import FacebookAdVariant, { FacebookAdVariantProps } from '../FacebookAdVariant';
import { Mock } from '@/constants/servicesData';
import generatingImage from '@/assets/lottie/generating_image.json';
import errorImage from '@/assets/lottie/error.json';
import dummyImage from '@/assets/images/image4.webp';
import Lottie from 'lottie-react';
import {useConversation} from '@/context/ConversationContext';
import { SlOptions } from 'react-icons/sl';
import Loader from '@/components/Loader';
import EditControl, { CONTROL_STATE } from './EditControl';
import Modal from '@/components/Modal';
import CTAButton from '@/components/CTAButton';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { AD_VARIANT_MODE } from '../VariantItem';
import { FaUpload } from 'react-icons/fa6';
import { LuRefreshCw } from 'react-icons/lu';
import { RxCaretLeft, RxCaretRight, RxFontFamily, RxText } from 'react-icons/rx';
import { IoMdColorPalette } from 'react-icons/io';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
import { resetImageUrl, updateVariant, updateVariantImages, useEditVariant } from '@/context/EditVariantContext';
import EditCanvas from '@/components/Canvas/EditCanvas';
import { VariantImageObj } from '@/interfaces/IArtiBot';
import { SnackbarContext } from '@/context/SnackbarContext';
import { VariantImageMap } from '@/services/VariantImageMap';
import GeneratedSuggestions from './GeneratedSuggestions';
import { NoImage } from '../LeftPane/ConversationListItem';
import SwipeableViews from 'react-swipeable-views';
import PreviewCanvas from '@/components/Canvas/PreviewCanvas';


export enum REGENERATE_SECTION {
	'DESCRIPTION' = 'text',
	'IMAGE' = 'imageUrl',
	'ONE_LINER' = 'oneLiner'
}

interface SampleImageState {
	bgUrl: string;
	canvasState: string;
	id: any;
}

interface CanvasImageItemProps {
	item: SampleImageState;
	onClick: (sampleImageState) => void;
	isActive: boolean;
}

const dummyCanvasState = "[{\"id\":1709810369379,\"name\":\"rectangle\",\"order\":0,\"type\":\"rectangle\",\"x1\":-0.09375,\"y1\":321.375,\"x2\":399.90625,\"y2\":368.375,\"roughOptions\":{\"fillStyle\":\"solid\",\"fill\":\"rgba(31, 168, 221, 0.67)\",\"width\":400,\"stroke\":\"rgba(0, 0, 0, 0)\"}},{\"id\":1709810265567,\"name\":\"Sample Text\",\"order\":1,\"type\":\"text\",\"x1\":125.90625,\"y1\":335.375,\"x2\":278.90625,\"y2\":361.375,\"customOptions\":{\"text\":\"Sample Text\",\"font\":\"26px Avenir Next\",\"fillStyle\":\"rgba(255, 255, 255, 1)\",\"fontSize\":26,\"width\":153,\"fontFamily\":\"Avenir Next\",\"bold\":false,\"italic\":false}}]";

const dummyCanvasState2 = "[{\"id\":1709880821502,\"name\":\"ellipse\",\"order\":1709880821502,\"type\":\"ellipse\",\"x1\":196.90625,\"y1\":346.484375,\"x2\":365.90625,\"y2\":386.984375,\"roughOptions\":{\"fillStyle\":\"solid\",\"fill\":\"rgba(224, 203, 55, 0.53)\",\"width\":169,\"stroke\":\"rgba(0, 0, 0, 0)\"}},{\"id\":1709880856558,\"name\":\"Sample Text\",\"order\":1709880856558,\"type\":\"text\",\"x1\":114.90625,\"y1\":335.984375,\"x2\":289.90625,\"y2\":361.984375,\"customOptions\":{\"text\":\"Sample Text\",\"font\":\"bold 26px Rockwell\",\"fillStyle\":\"rgba(255, 255, 255, 1)\",\"fontSize\":26,\"width\":175,\"fontFamily\":\"Rockwell\",\"bold\":true,\"italic\":false}}]";

const dummyCanvasState3 = "[{\"id\":1709810490095,\"name\":\"Sample Text\",\"order\":1709810490095,\"type\":\"text\",\"x1\":281.40625,\"y1\":40.984375,\"x2\":381.40625,\"y2\":96.984375,\"customOptions\":{\"text\":\"Sample Text\",\"font\":\"26px Chalkboard SE\",\"fillStyle\":\"rgba(0,0,0,1)\",\"fontSize\":26,\"width\":100,\"fontFamily\":\"Chalkboard SE\",\"bold\":false,\"italic\":false}}]";

const dummyCanvasState4 = "[{\"id\":1709881257149,\"name\":\"circle\",\"order\":1709881257149,\"type\":\"circle\",\"x1\":197.90625,\"y1\":337.59375,\"x2\":237.90625,\"y2\":355.59375,\"roughOptions\":{\"fillStyle\":\"solid\",\"fill\":\"rgba(231, 32, 32, 1)\",\"stroke\":\"rgba(0, 0, 0, 0)\"}},{\"id\":1709881267315,\"name\":\"rectangle\",\"order\":1709881267315,\"type\":\"rectangle\",\"x1\":80.90625,\"y1\":315.59375,\"x2\":312.90625,\"y2\":362.59375,\"roughOptions\":{\"fillStyle\":\"solid\",\"fill\":\"rgba(231, 32, 32, 1)\",\"stroke\":\"rgba(0, 0, 0, 0)\"}},{\"id\":1709881329616,\"name\":\"Sample Text\",\"order\":1709881329616,\"type\":\"text\",\"x1\":132.90625,\"y1\":328.59375,\"x2\":276.90625,\"y2\":352.59375,\"customOptions\":{\"text\":\"Sample Text\",\"font\":\"24px Tahoma\",\"fillStyle\":\"rgba(255, 255, 255, 1)\",\"fontSize\":24,\"width\":144,\"fontFamily\":\"Tahoma\",\"bold\":false,\"italic\":false}}]";

const CanvasImageItem: FC<CanvasImageItemProps> = ({isActive, item, onClick}) => {

	return (
		<div className={'border border-transparent relative aspect-square rounded ' + (isActive ? '!border-primary' : '')} onClick={() => onClick(item)}>
			{item.bgUrl ? <Image1 src={item.bgUrl} alt="Ad Variant Image" width={600} height={100} className="mb-[0.5em] w-full" /> : 
			<NoImage />}
			<PreviewCanvas canvasState={item.canvasState} />
		</div>
	)
}

interface RegenerateMap {
	selected?: REGENERATE_SECTION;
}


interface CanvasImageViewerProps {
	list: SampleImageState[];
	activeItem?: number;
	onClick: (sampleImageState: SampleImageState) => void;
}
const CanvasImageViewer: FC<CanvasImageViewerProps> = (props) => {
    return (
        <div className='grid grid-cols-2 gap-3 w-full'>
            {props.list.map((item, index) => <CanvasImageItem key={item.id} item={item} onClick={props.onClick} isActive={props.activeItem === index} />)}
            {[1,2].slice(props.list.length).map(c => <div key={c} className='aspect-square rounded bg-black'></div>)}
        </div>
    )
}


export interface EditFacebookAdVariantProps extends FacebookAdVariantProps {
	showConfirmModal: boolean;
	setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
	handleSaveVariant: () => void;
	containerClassName?: string;
}

export const EditFacebookAdVariant: FC<EditFacebookAdVariantProps> = ({showConfirmModal, containerClassName, setShowConfirmModal, mock = new Mock(), adVariant, noExpand, className, handleEditVariantClose, handleSaveVariant, ...props}) => {
	const [expand, setExpand] = useState<boolean>(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [reactionState, setReactionState] = useState<REACTION>();
	const {state: {inError, inProcess, variant}, dispatch} = useConversation();
	const {state: editVariantState, dispatch: editDispatch} = useEditVariant();
	const isLoaded = useRef<Record<string, boolean>>({});
	const [regenerateMap, setRegenerateMap] = useState<RegenerateMap | null>(null);
	const [showPreview, setShowPreview] = useState<boolean>(false);
	const [isEdittingImage, setIsEdittingImage] = useState<boolean>(false);
	const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
	const [activeTab, setActiveTab] = useState<number>(0);
	const isCreatedImageMapRef = useRef<boolean>(false);

	const [sampleState, setSampleState] = useState<string | null>(null);

	useEffect(() => {
		if(editVariantState.variant && !isCreatedImageMapRef.current) {
			const newVariant = {...editVariantState.variant};

			if(!newVariant.images || newVariant.images.length === 0) {
				const newImageObj = {
					url: newVariant.imageUrl,
					bgImage: newVariant.imageUrl,
					timestamp: new Date().toISOString(),
				}
				const imageMap = new VariantImageMap(newImageObj);
				const images = [imageMap];
				updateVariantImages(editDispatch, images);
			} else {
				const images = newVariant.images.map(g => {
					if(g instanceof VariantImageMap) return g;
					return new VariantImageMap(g);
				});
				updateVariantImages(editDispatch, images);
			}
			isCreatedImageMapRef.current = true;
		}
	}, [editVariantState.variant, editDispatch]);

	const [imageUrl, setImageUrl] = useState<string | null>(mock.is ? null : adVariant.imageUrl);
	// const fallbackImage = editVariantState.fallbackImage ? editVariantState.fallbackImage[adVariant.id] : undefined;

	// useEffect(() => {
	// 	const img = new Image();
	// 	img.src = adVariant.imageUrl;
	// 	img.onload = () => {
	// 		setImageUrl(adVariant.imageUrl);
	// 		// resetImageUrl(editDispatch);
	// 	}
	// }, [fallbackImage, adVariant.imageUrl])

	useEffect(() => {
		setImageUrl(adVariant.imageUrl)
	}, [imageUrl, mock.is, adVariant.imageUrl])

	function handleErrorImage() {
		setImageUrl('error');
	}

	let lottieAnimationJSX = <div className="w-full aspect-square flex flex-col justify-center items-center">
		<Lottie className={"w-32 h-32"} animationData={generatingImage} loop={true} />
		<h6 className="text-white text-opacity-60 text-center px-5 leading-normal">Creating your ad variant image to make your brand shine, one pixel at a time.</h6>
	</div>

	if(inError && inError[adVariant.id]) {
		lottieAnimationJSX = <div className="w-full aspect-square flex flex-col justify-center items-center">
			<Lottie className={"w-32 h-32"} animationData={errorImage} loop={true} />
			<h6 className="text-white text-opacity-60 text-center px-5 leading-normal">Oops! It looks like there was an issue creating your ad variant image. Try creating another one.</h6>
		</div>
	}

	const imageContainerJSX =
		imageUrl === 'error' ? <NoImage className='!text-6xl !flex-col !aspect-square'>
				<span className='text-lg mt-2'>Image not found</span>
			</NoImage> : imageUrl 
			? <Image1 width={600} height={100} className="mb-[0.5em] w-full" src={editVariantState?.variant?.imageUrl ?? imageUrl ?? dummyImage} onError={handleErrorImage} alt="Ad Image" />
			: lottieAnimationJSX;

	// const imageContainerJSX =
	// 	imageUrl
	// 		? <Image key={editVariantState?.variant?.imageUrl ?? imageUrl} width={600} height={100} className="mb-[0.5em] w-full" src={editVariantState?.variant?.imageUrl ?? imageUrl ?? dummyImage} alt="Ad Image" />
	// 		: lottieAnimationJSX;

	async function handleEdit(cs: CONTROL_STATE, key: REGENERATE_SECTION) {
		setRegenerateMap(c => ({...c, selected: key as REGENERATE_SECTION}));

		if(cs === CONTROL_STATE.EDIT && key === REGENERATE_SECTION.IMAGE) {
			const imageIndex = editVariantState?.variantImages?.findIndex(c => c.get('url') === editVariantState.variant?.imageUrl);
			if(imageIndex && imageIndex > -1) {
				setActiveTab(imageIndex);
			}
			setIsEdittingImage(true);
		}
	}

	function getBlurClassName(key: REGENERATE_SECTION) {
		return !regenerateMap?.selected ? '' : regenerateMap?.selected !== key ? ' disable-editting' : '';
	}

	function handleClose() {
		setRegenerateMap(null);
		setIsEdittingImage(false); 
	}

	function handleSaveEdit() {

	}

	function handleExport(url: string, oldUrl?: string | null, state?: string, newImage?: string, bgImage?: string) {
        if(!editVariantState.variant) return;
        const newVariant = {...editVariantState.variant};
		let variantImages = [...(editVariantState.variantImages ?? [])];

		// if(!newVariant.images || newVariant.images.length === 0) {
		// 	const newImageObj = {
		// 		url: newVariant.imageUrl,
		// 		bgImage: newVariant.imageUrl,
		// 		timestamp: new Date().toISOString(),
		// 	}
		// 	newVariant.images = [newImageObj];
		// 	// updateVariant(editDispatch, newVariant);
		// }

		let createdImageObj = {
			bgImage: newImage ?? url,
			url,
			canvasState: state,
			timestamp: new Date().toISOString(),
		}
		if(!newImage) {
			const prevImageObj = variantImages.find(c => c.get('url') === oldUrl);
			const _bgImage = bgImage ?? prevImageObj?.get('bgImage');
			if(prevImageObj && _bgImage) {
				createdImageObj = {
					bgImage: _bgImage,
					url,
					canvasState: state,
					timestamp: new Date().toISOString(),
				}
			} else {
				return setSnackbarData({message: 'Couldn\'t find the background image!', status: 'warning'});
			}
		}

		if(newImage) {
			variantImages = [
				...variantImages,
				new VariantImageMap(createdImageObj)
			];
		} else {
			const index = variantImages.findIndex(c => c.get('url') === oldUrl);
			if(index < 0) return setSnackbarData({message: 'Couldn\'t find the background image!', status: 'warning'});
			variantImages[index] = variantImages[index].update(createdImageObj);
		}
		newVariant.imageUrl = url;

		// console.log('testing variantImages | newVariant - ', newVariant);
		updateVariant(editDispatch, newVariant);
		updateVariantImages(editDispatch, variantImages);

		handleClose();
	}

	function handleImageClick(sampleImage: SampleImageState) {
		// if(!editVariantState.variant) return;
		// const newVariant = {...editVariantState.variant};
		// newVariant.imageUrl = imageObj.get('url') as string;

		// updateVariant(editDispatch, newVariant);

		setSampleState(sampleImage.canvasState);
	}

	const imageObject = useMemo(() => {
		return editVariantState?.variantImages ? editVariantState?.variantImages[activeTab] : undefined;
	}, [editVariantState?.variantImages, activeTab]);

	const imageUrlToEdit = imageObject?.get('bgImage') ?? imageObject?.get('url') ?? editVariantState?.variant?.imageUrl ?? imageUrl ?? adVariant.imageUrl;

	const bgImages: string[] = [...(editVariantState?.variantImages ?? []).map(g => g.get('bgImage')).filter(c => c !== null && c !== undefined)];

	return (
		<>
			<Modal PaperProps={{className: 'bg-black bg-opacity-90'}} handleClose={() => setShowPreview(false)} open={showPreview}>
				<div className='max-w-[500px]'>
					{editVariantState.variant && <FacebookAdVariant forceAdVariant={true} adVariant={editVariantState.variant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '10px'}}  />}
				</div>
			</Modal>
			<Modal PaperProps={{className: 'bg-black bg-opacity-90 !min-h-[unset]'}} handleClose={() => setShowConfirmModal(false)} open={showConfirmModal}>
				<div className='max-w-[300px] bg-black text-white p-4 rounded shadow-lg'>
					<h2 className='text-lg'>You have unsaved changes.</h2>
					<p className='my-5 text-gray-300 text-sm'>Save the Variant changes before leaving?</p>
					<div className='w-full flex py-2 px-4 gap-5 items-center justify-end'>
						<button className={'py-1 px-5 rounded text-base bg-gray-600'} onClick={() => setShowConfirmModal(false)}>
							<span>Leave</span>
						</button>
						<button className={'py-1 px-5 rounded text-base bg-primary'} onClick={() => setShowConfirmModal(false)}>
							<span>Stay</span>
						</button>
					</div>
				</div>
			</Modal>
			<div key={adVariant.id} className={'relative ad-variant text-xs md:text-base !p-0 ' + (className ?? '')} {...props}>
				<div className={"flex justify-between items-center mb-[.3em] px-[1em] pt-[1em]"}>
					<div className="flex items-center gap-[0.5em]">
						<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
						<div>
							<div className="w-[4em] h-[1em] mb-[0.2em] rounded-[.17em] bg-gray-700" />
							<div className="w-[6em] h-[1em] rounded-[.17em] bg-gray-700" />
						</div>
					</div>
					<SlOptions className="text-[1.5em]" />
				</div>
				{/*<div className="mb-[1em] px-[1em]">*/}
				<EditControl type={'text'} handleClose={handleClose} inputEditable={true} content={adVariant.text} controlKey={REGENERATE_SECTION.DESCRIPTION} containerClassName={'text-[1.6em] leading-[1.6] py-[0.6em] px-[1em] my-2 min-h-[82px] ' + getBlurClassName(REGENERATE_SECTION.DESCRIPTION)} handleEdit={handleEdit} />
				{isEdittingImage ? (
					<>
						<div className='relative w-full aspect-square'>
							<div className='absolute z-30 bottom-full left-1/2 transform -translate-x-1/2 h-[40px] flex items-center 	justify-center'>
								<div onClick={() => setActiveTab(c => {
									if(c === 0) return c;
									return c - 1;
								})} className='text-3xl cursor-pointer'>
									<RxCaretLeft />
								</div>
								<div className='text-base px-7'>
									<span>{activeTab + 1} / {bgImages.length}</span>
								</div>
								<div onClick={() => {
									setActiveTab(c => {
										if(c === bgImages.length - 1) return c;
										return c + 1;
									})
								}} className='text-3xl cursor-pointer'>
									<RxCaretRight />
								</div>
							</div>
							<div className='absolute top-0 left-0 w-full aspect-square'>
								<SwipeableViews
									axis="x"
									index={activeTab}
									onChangeIndex={(e) => setActiveTab(e)}
									scrolling={"false"}
									ignoreNativeScroll={true}
									disabled={true}
									style={{height: '100%'}}
									containerStyle={{height: '100%'}}
								>
									{(editVariantState?.variantImages ?? []).map((imageObject, index) => {
										const url = imageObject.get('bgImage') as string;
										return (
											<Image1 key={url} src={url} alt="Image" className='w-full h-full' width={500} height={500} />
										)
									})}
								</SwipeableViews>
							</div> 
							<EditCanvas sampleState={sampleState} key={imageUrlToEdit} imageObject={imageObject} canvasState={imageObject?.get('canvasState')} handleClose={handleClose} handleExport={handleExport} imageUrl={imageUrlToEdit} />
						</div>
						<div className="my-[1em] w-full px-3 py-2 border-2 border-gray-600 bg-gray-800 rounded divide-y divide-gray-700">
							<div className="text-[1.5em] leading-[1.55em] mt-1 mb-2 text-white text-opacity-60 font-medium">
								<span>Pre-made samples:</span>
							</div>
							<div className="flex gap-1 flex-col items-start mt-2 py-3">
								<CanvasImageViewer 
									list={[
										{id: 1, bgUrl: imageObject?.get('bgImage') ?? '', canvasState: dummyCanvasState},
										{id: 2, bgUrl: imageObject?.get('bgImage') ?? '', canvasState: dummyCanvasState2},
										{id: 3, bgUrl: imageObject?.get('bgImage') ?? '', canvasState: dummyCanvasState3},
										{id: 4, bgUrl: imageObject?.get('bgImage') ?? '', canvasState: dummyCanvasState4},
									]} 
									onClick={handleImageClick}
								/>
							</div>
						</div>
					</>
				) : <EditControl type={'image'} handleClose={handleClose} controlKey={REGENERATE_SECTION.IMAGE} containerClassName={'text-[1.6em] ' + getBlurClassName(REGENERATE_SECTION.IMAGE)} handleEdit={handleEdit}>
					{imageContainerJSX}
				</EditControl>}
				<div className={"flex justify-between gap-[.8em] items-center px-[1em] mt-[1em]"}>
					<div className="flex-1">
						<EditControl rows={2} type={'text'} inputEditable={true} content={adVariant.oneLiner} handleClose={handleClose} controlKey={REGENERATE_SECTION.ONE_LINER} containerClassName={'relative px-2 py-2 text-[1.75em] leading-[1.3em] ' + getBlurClassName(REGENERATE_SECTION.ONE_LINER)} handleEdit={handleEdit} />
					</div>
					<div className="flex-shrink-0">
						<span className="cursor-pointer rounded bg-gray-700 px-[0.6em] py-[0.5em] text-[1em]" onClick={() => setExpand(c => !c)}>Learn More</span>
					</div>
				</div>
				<hr className="h-px my-[1em] border-0 bg-gray-700"/>
				<div className="w-full px-[1em] pb-[1em] flex justify-between" style={{zoom: mock.is ? 0.7 : 1}}>
					<div className="ml-[2em] w-[6.5em] h-[2em] rounded bg-gray-700" />
					<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
					<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
					<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
				</div>
			</div>
			{!isEdittingImage && !regenerateMap && <div className={'flex justify-end w-full mt-2 mb-2 items-center gap-1 text-xs'}>
				<div className={'flex items-center gap-4'}>
					<CTAButton className={'py-1 px-3 rounded text-xs'} onClick={() => setShowPreview(true)}>
						<span>Preview</span>
					</CTAButton>
					<CTAButton className={'py-1 px-3 rounded text-xs'} onClick={handleSaveVariant}>
						<span>Save</span>
					</CTAButton>
					<div className='text-xs cursor-pointer' onClick={handleEditVariantClose}>
						<span>Close</span>
					</div>
				</div>
			</div>}
		</>
	)
}
