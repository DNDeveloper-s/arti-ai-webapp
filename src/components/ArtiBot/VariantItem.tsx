import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import FacebookAdVariant from '@/components/ArtiBot/FacebookAdVariant';
import FeedBackView from '@/components/ArtiBot/RIghtPane/FeedBackView';
import {AdCreativeVariant} from '@/interfaces/IAdCreative';
import {timeSince} from '@/helpers';
import {Mock} from '@/constants/servicesData';
import { EditFacebookAdVariant } from './EditAdVariant/EditAdVariant';
import {startEditingVariant, stopEditingVariant, useEditVariant} from '@/context/EditVariantContext';
import {updateVariantToDB, useConversation} from '@/context/ConversationContext';
import CTAButton from '../CTAButton';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { GrDeploy } from 'react-icons/gr';
import {MdDownload, MdOutlineModeEdit} from 'react-icons/md';
import { IAdVariant } from '@/interfaces/IArtiBot';
import useConversations from '@/hooks/useConversations';
import { dbImagesPrefixes } from '@/constants';
import { SnackbarContext } from '@/context/SnackbarContext';
import uploadImage from '@/services/uploadImage';
import Loader from '../Loader';
import JSZip from 'jszip';
import {dataUrlToBase64, fetchImage} from '@/components/ArtiBot/MessageItems/AdItem';
import { saveAs } from 'file-saver';

interface VariantTabProps {
	activeVariant: AdCreativeVariant;
	width: number;
	mock?: Mock;
	showConfirmModal: boolean;
	setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum AD_VARIANT_MODE {
	EDIT = 'EDIT',
	VIEW = 'VIEW'
}

const VariantItem: FC<VariantTabProps> = ({mock = new Mock(), width, activeVariant, ...props}) => {
	const variantRef = useRef<HTMLDivElement>(null);
	const [fontSize, setFontSize] = useState<number>(10);
	const {dispatch, state: editState} = useEditVariant();
	const {state, dispatch: conversationDispatch} = useConversation();
	const editMode = editState.variant && editState.variant.id === activeVariant.id;
	const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
	const [updating, setUpdating] = useState(false);
	const [downloading, setDownloading] = useState(false);

	const variant = state.variant.map[activeVariant.id] as IAdVariant ?? null;

	async function handleDownload() {
		setDownloading(true);
		const zip = new JSZip();
		zip.file("Ad_Text.txt", `Ad Description - ${variant.text}\n\nAd One Liner - ${variant.oneLiner}`)

		const img = zip.folder("images");
		if(img) {
			for(let i = 0; i < variant.images.length; i++) {
				const image = variant.images[i];
				const dataUrl = await fetchImage(image.url);
				const base64 = dataUrlToBase64(dataUrl);
				img.file(`image_${i}.png`, base64, {base64: true});
			}
		} else {
			console.error('Failed to create images folder in zip file')
		}

		zip.generateAsync({type:"blob"})
			.then(function(content) {
				// see FileSaver.js
				setDownloading(false);
				saveAs(content, `Ad-Variant_${variant.id}.zip`);
			})
			.catch(err => {
				console.error('Failed to create zip file', err);
				setSnackbarData({message: 'Failed to download ad variant', status: 'error'})
				setDownloading(false);
			})
	}

	useEffect(() => {
		if(!variantRef.current) return;
		let newHeight = (356 * width) / 340;
		//
		const maxWidth = 340 * (innerHeight / 1.5) / 356;
		variantRef.current.style.maxWidth = maxWidth + 'px';
		if(newHeight > (innerHeight / 1.5)) return;


		// console.log('newHeight - ', newHeight / 57);
		setFontSize(newHeight / 57);
	}, [width])

	async function handleSaveVariant() {
		// updateVariant(editState.variant as IAdVariant);
		if(!editState.variant) {
			return setSnackbarData({message: 'Oops! Failed to Update Variant.', status: 'error'});
		}
		setUpdating(true);

		const newVariant = {...editState.variant};
		// newVariant.images = variantState.images;
		const variantImages = [...(editState.variantImages ?? [])];

		const usedImageUrl = newVariant.imageUrl;

		const images = [];
		for (let i = 0; i < variantImages.length; i++) {
			const image = variantImages[i];

			// Should get new when
			// 1. it's url matches with imageUrl
			// 2. it's url and bgImage both contains allowedBgImagesPrefixes
			const isCurrentImage = image.get('url') === editState.variant?.imageUrl;
			const cond = [
				isCurrentImage,
				dbImagesPrefixes.some(prefix => image.get('url')?.includes(prefix) && image.get('bgImage')?.includes(prefix))
			]

			const shouldGetNew = cond.some(c => c);

			if(shouldGetNew) {
				if(image.get('url')?.startsWith('blob:')) {
					// upload image to s3 and update url
					const fileName = newVariant.id + '_' + Date.now().toString() + '.png'
					const url = await uploadImage(image.get('url'), fileName);
					// const url = 'uploaded to s3 url'
					image.set('url', url);
					if(isCurrentImage) newVariant.imageUrl = url;
				} else {
					if(isCurrentImage) newVariant.imageUrl = image.get('url') ?? newVariant.imageUrl;
				}
				if(image.get('bgImage')?.startsWith('blob:')) {
					// upload image to s3 and update bgImage
					const fileName = newVariant.id + '_' + Date.now().toString() + '.png'
					const url = await uploadImage(image.get('bgImage'), fileName);
					// const url = 'uploaded to s3 bgImage url'
					image.set('bgImage', url);
				}
				images[i] = image.imageObj;
			} else {
				images[i] = image.baseImageObj;
			}
		}

		// console.log('testing newVariant - ', images);
		newVariant.images = images;
		
		const variantFromDB = await updateVariantToDB(conversationDispatch, newVariant as IAdVariant);
		setUpdating(false);
		
		if(variantFromDB) {
			stopEditingVariant(dispatch);
			return setSnackbarData({message: 'Variant Updated Successfully', status: 'success'});
		} else {
			return setSnackbarData({message: 'Oops! Failed to Update Variant.', status: 'error'});
		}
	}

	async function handleEdit() {
		if(!variant) return null;
		stopEditingVariant(dispatch);
		startEditingVariant(dispatch, variant);
	}

	function editVariantClose() {
		stopEditingVariant(dispatch);
	}

	return (
		<>
			{variant && (
				<>
					{/* <div className={'flex w-[80%] justify-between items-center ' + (mock.is ? 'mt-2' : 'mt-4')}>
						<label htmlFor="message" className="block text-sm font-light text-white text-opacity-50 text-left">Ad Preview</label>
						{activeVariant.updatedAt && !mock.is && <span className="whitespace-nowrap">
							<span className="text-white text-opacity-30 text-xs">Generated: </span>
							<span className="text-white text-opacity-80 text-xs">{timeSince(activeVariant.updatedAt) + ' ago'}</span>
						</span>}
					</div> */}
					{/* {!mock.is && !isEditting && <div className={'flex justify-end w-[80%] mt-2 items-center gap-1 text-xs'}>
						<span className="text-white text-opacity-50">Explore Options:</span>
						<button onClick={() => {
							// setMode(AD_VARIANT_MODE.EDIT);
							startEditingVariant(dispatch, activeVariant);
						}} className="bg-primary text-white px-3 py-1 leading-[14px] rounded cursor-pointer">Edit Your Ad</button>
					</div>} */}
					<div ref={variantRef} className={"relative mt-2 w-[80%]"}>
						{!editMode ? <FacebookAdVariant adVariant={variant} className="p-3 !max-w-unset border !border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '8px', opacity: editMode ? 0 : 1, pointerEvents: editMode ? 'none' : 'all'}} /> :
						<EditFacebookAdVariant 
							showConfirmModal={false}
							setShowConfirmModal={() => {}}
							handleSaveVariant={handleSaveVariant} 
							handleEditVariantClose={editVariantClose} 
							adVariant={editState.variant as IAdVariant} 
							className="p-3 !max-w-unset border border-gray-800 h-auto rounded-lg" style={{fontSize: '8px'}} />
						}
						{updating && <div
							className="flex items-center z-30 justify-center absolute top-0 left-0 w-full h-full bg-black bg-opacity-60">
							<Loader />
						</div>}
					</div>
					{/* <div ref={variantRef} className={"mt-2 w-[80%]"}>
						{!isEditting ? <FacebookAdVariant mock={mock} adVariant={activeVariant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: (fontSize) + 'px'}}/> : (
							state.variant && <EditFacebookAdVariant showConfirmModal={props.showConfirmModal} setShowConfirmModal={props.setShowConfirmModal} handleEditVariantClose={handleClose} mock={mock} adVariant={state.variant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-black rounded-lg" style={{fontSize: (fontSize) + 'px'}}/>
						)}
					</div> */}
					{!downloading && !updating && !editMode && <div className='w-[80%] mx-auto mt-2 flex items-center justify-center gap-4'>
						<button onClick={handleEdit} className='cursor-pointer text-white hover:scale-105 text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
							<MdOutlineModeEdit />
							<span>Edit</span>
						</button>
						<button className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
							<GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />
							<span>Deploy</span>
						</button>
            <button onClick={handleDownload} className="cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all">
              <MdDownload className="fill-white stroke-white [&>path]:stroke-white"/>
              <span>Download</span>
            </button>
					</div>}
				</>
			)}

			{/*{!mock.is && activeVariant && <FeedBackView variant={activeVariant}/>}*/}
		</>
	);
};

export default VariantItem;
