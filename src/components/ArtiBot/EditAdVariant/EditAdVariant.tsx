import React, {useState, useEffect, useRef, FC} from 'react';
import {AdCreativeVariant} from '@/interfaces/IAdCreative';
import {timeSince, wait} from '@/helpers';
import Image from 'next/image';
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
import { RxFontFamily, RxText } from 'react-icons/rx';
import { IoMdColorPalette } from 'react-icons/io';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
import { updateVariant, useEditVariant } from '@/context/EditVariantContext';
import EditCanvas from '@/components/Canvas/EditCanvas';


export enum REGENERATE_SECTION {
	'DESCRIPTION' = 'text',
	'IMAGE' = 'imageUrl',
	'ONE_LINER' = 'oneLiner'
}

interface RegenerateMap {
	selected?: REGENERATE_SECTION;
}

export interface EditFacebookAdVariantProps extends FacebookAdVariantProps {
	showConfirmModal: boolean;
	setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditFacebookAdVariant: FC<EditFacebookAdVariantProps> = ({showConfirmModal, setShowConfirmModal, mock = new Mock(), adVariant, noExpand, className, handleEditVariantClose, ...props}) => {
	const [expand, setExpand] = useState<boolean>(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [reactionState, setReactionState] = useState<REACTION>();
	const {state: {inError, inProcess, variant}, dispatch} = useConversation();
	const {state: editVariantState, dispatch: editDispatch} = useEditVariant();
	const isLoaded = useRef<Record<string, boolean>>({});
	const [regenerateMap, setRegenerateMap] = useState<RegenerateMap | null>({});
	const [showPreview, setShowPreview] = useState<boolean>(false);
	const [isEdittingImage, setIsEdittingImage] = useState<boolean>(false);

	function handleLike() {
		setReactionState(c => c === REACTION.LIKED ? REACTION.NEUTRAL : REACTION.LIKED);
	}

	function handleDislike() {
		setReactionState(c => c === REACTION.DISLIKED ? REACTION.NEUTRAL : REACTION.DISLIKED);
	}

	const [imageUrl, setImageUrl] = useState<string | null>(mock.is ? null : adVariant.imageUrl);

	useEffect(() => {
		setImageUrl(adVariant.imageUrl)
	}, [imageUrl, mock.is, adVariant.imageUrl])

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
		imageUrl
			? <Image key={editVariantState?.variant?.imageUrl ?? imageUrl} width={600} height={100} className="mb-[0.5em] w-full" src={editVariantState?.variant?.imageUrl ?? imageUrl ?? dummyImage} alt="Ad Image" />
			: lottieAnimationJSX;


	async function handleEdit(cs: CONTROL_STATE, key: REGENERATE_SECTION) {
		setRegenerateMap(c => ({...c, selected: key as REGENERATE_SECTION}));
		if(cs === CONTROL_STATE.GENERATE) {
			// setLoading(true);
			// setShowSuggestions(false);

			// await wait(2000);

			// setLoading(false);
			// setShowSuggestions(true);
		}

		if(cs === CONTROL_STATE.EDIT && key === REGENERATE_SECTION.IMAGE) {
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

	function handleExport(url: string, state: string) {
        if(!editVariantState.variant) return;
        const newVariant = {...editVariantState.variant};

		if(!newVariant.imageMap) {
			newVariant.imageMap = {
				main: newVariant.imageUrl,
				versionInfo: {
					totalVersions: 0,
					list: []
				},
				versions: {},
				generatedImages: []
			};
		}

		const versions = {
			...(newVariant.imageMap.versions ?? {}),
			[`v${(newVariant.imageMap.versionInfo.totalVersions ?? 1)}`]: newVariant.imageMap.versions.latest,
			latest: {
				image: url,
				timestamp: new Date().toISOString()
			}
		}
		const versionInfo = {
			totalVersions: (newVariant.imageMap.versionInfo.totalVersions ?? 0) + 1,
			list: Object.keys(versions)
		}

        newVariant.imageUrl = url;
		newVariant.imageMap.versionInfo = versionInfo;
		newVariant.imageMap.versions = versions;
		newVariant.imageMap.canvasState = state;

        updateVariant(editDispatch, newVariant);
		handleClose();
	}

	const imageUrlToEdit = editVariantState?.variant?.imageMap?.main ?? editVariantState?.variant?.imageUrl ?? imageUrl;

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
				<EditControl type={'text'} handleClose={handleClose} inputEditable={true} content={adVariant.text} controlKey={REGENERATE_SECTION.DESCRIPTION} containerClassName={'text-[1.6em] leading-[1.6] py-[0.6em] px-[1em] my-2 ' + getBlurClassName(REGENERATE_SECTION.DESCRIPTION)} handleEdit={handleEdit} />
				{isEdittingImage ? (
					<>
						<div className='w-full'>
							<EditCanvas canvasState={editVariantState.variant?.imageMap?.canvasState} handleClose={handleClose} handleExport={handleExport} imageUrl={imageUrlToEdit} />
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
			<div className={'flex justify-end w-full mt-1 mb-2 items-center gap-1 text-xs'}>
				<div className={'flex items-center gap-4'}>
					<CTAButton className={'py-1 px-3 rounded text-xs'} onClick={() => setShowPreview(true)}>
						<span>Preview</span>
					</CTAButton>
					<CTAButton className={'py-1 px-3 rounded text-xs'} onClick={handleEditVariantClose}>
						<span>Save</span>
					</CTAButton>
					<div className='text-xs cursor-pointer' onClick={handleEditVariantClose}>
						<span>Close</span>
					</div>
				</div>
			</div>
		</>
	)
}