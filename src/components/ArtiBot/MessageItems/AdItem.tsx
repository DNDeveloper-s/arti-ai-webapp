import {AdJSONInput, ChatGPTMessageObj, IAdVariant} from '@/interfaces/IArtiBot';
import AdVariant from '@/components/ArtiBot/AdVariant';
import React, {useContext, useState} from 'react';
import {IAdCreative} from '@/interfaces/IAdCreative';
import Markdown from 'react-remarkable';
import FacebookAdVariant from '../FacebookAdVariant';
import { MdOutlineModeEdit } from 'react-icons/md';
import { GrDeploy } from 'react-icons/gr';
import { EditFacebookAdVariant } from '../EditAdVariant/EditAdVariant';
import { startEditingVariant, stopEditingVariant, useEditVariant } from '@/context/EditVariantContext';
import {updateVariantToDB, useConversation} from '@/context/ConversationContext';
import {SnackbarContext} from '@/context/SnackbarContext';
import Loader from '@/components/Loader';
import { dbImagesPrefixes } from '@/constants';
import uploadImage from '@/services/uploadImage';

function ConversationAdVariant({variantId}: {variantId: string}) {
	const {dispatch, state: editState} = useEditVariant();
	const {dispatch: conversationDispatch, state, updateVariant} = useConversation();
	const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
	const [updating, setUpdating] = useState(false);

	const variant = state.variant.map[variantId] as IAdVariant ?? null;
	const editMode = editState.variant && editState.variant.id === variantId;

	if(!variant) return null;

	function handleEdit() {
		if(!variant) return null;
		stopEditingVariant(dispatch);
		startEditingVariant(dispatch, variant);
	}

	function editVariantClose() {
		stopEditingVariant(dispatch);
	}

	async function handleSaveVariant() {
		// updateVariant(editState.variant as IAdVariant);
		if(!editState.variant) {
			return setSnackbarData({message: 'Oops! Failed to Update Variant.', status: 'error'});
		}
		setUpdating(true);
		// const variantState = !!editState.variant?.id && state.variant.map[editState.variant.id];
		// console.log('testing variantState imageUrl - ', variantState ? variantState.imageUrl : null);
		// console.log('testing variantState images - ', variantState ? variantState.images : null);
		// if(!variantState) {
		// 	setUpdating(false);
		// 	return setSnackbarData({message: 'Oops! Failed to Update Variant.', status: 'error'});
		// }
		// if(!variantState.images || variantState.images.length === 0) {
		// 	variantState.images = [{
		// 		url: variantState.imageUrl,
		// 		bgImage: variantState.imageUrl,
		// 		timestamp: new Date().toISOString()
		// 	}];
		// }
		// if(variantState.imageUrl !== editState.variant?.imageUrl) {
		// 	const imageObject = editState.variant?.images?.find(image => image.url === editState.variant?.imageUrl);
		// 	if(!imageObject) {
		// 		return setSnackbarData({message: 'Oops! Failed to Update Variant.', status: 'error'});
		// 	}
		// 	const inVariantState = variantState.images.findIndex(image => image.url === editState.variant?.imageUrl);
		// 	if(inVariantState < 0) {
		// 		variantState.images.push(imageObject);
		// 	} else {
		// 		variantState.images[inVariantState] = imageObject;
		// 	}
		// }
		const newVariant = {...editState.variant};
		// newVariant.images = variantState.images;
		const variantImages = [...(editState.variantImages ?? [])]
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

			if(isCurrentImage) {
				if(image.get('url')?.startsWith('blob:')) {
					// upload image to s3 and update url
					const url = await uploadImage(image.get('url'));
				}
				if(image.get('bgImage')?.startsWith('blob:')) {
					// upload image to s3 and update bgImage
					const url = await uploadImage(image.get('url'));
				}
			}

			const shouldGetNew = cond.every(c => c);

			// newVariant.images[i] = {
			// 	url: image.get('url'),
			// 	bgImage: image.get('bgImage'),
			// 	timestamp: image.get('timestamp')
			// };
		}

		console.log('testing newVariant - ', newVariant, editState.variantImages);

		setUpdating(false);
		return;
		
		const variantFromDB = await updateVariantToDB(conversationDispatch, newVariant as IAdVariant);
		setUpdating(false);
		if(variantFromDB) {
			stopEditingVariant(dispatch);
			return setSnackbarData({message: 'Variant Updated Successfully', status: 'success'});
		} else {
			return setSnackbarData({message: 'Oops! Failed to Update Variant.', status: 'error'});
		}
	}

	return (
		<div key={variant.id} className="group/variant flex-shrink-0 relative">
			{!editMode ? <FacebookAdVariant adVariant={variant} className="p-3 !w-[400px] !max-w-unset border !border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '8px'}} /> : 
			<EditFacebookAdVariant showConfirmModal={false} setShowConfirmModal={() => {}} handleSaveVariant={handleSaveVariant} handleEditVariantClose={editVariantClose} adVariant={editState.variant as IAdVariant} className="p-3 !w-[400px] !max-w-unset border border-gray-800 h-full bg-black rounded-lg" style={{fontSize: '8px'}} /> }
			{!updating && !editMode && <div className='transition-all group-hover/variant:opacity-100 group-hover/variant:pointer-events-auto pointer-events-none opacity-0 absolute bg-black bg-opacity-70 top-0 left-0 w-full h-full flex justify-center gap-5 items-end pb-10'>
				<button onClick={handleEdit} className='cursor-pointer text-white hover:scale-105 text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
					<MdOutlineModeEdit />
					<span>Edit</span>
				</button>
				<button className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
					<GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />
					<span>Deploy</span>
				</button>
			</div>}
			{updating && <div
				className="flex items-center z-30 justify-center absolute top-0 left-0 w-full h-full bg-black bg-opacity-60">
				<Loader/>
			</div>}
		</div>
	)
}

export default function AdItem({messageItem, variantFontSize}: {messageItem: ChatGPTMessageObj, variantFontSize?: number}) {

	// const json = messageItem.json && JSON.parse(messageItem.json) as AdJSONInput;
	const json = messageItem.adCreatives && messageItem.adCreatives[0] as IAdCreative;

	if(!json) return null;

	const str = `<div class="">
		<div>
			<p class="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-[0.4em]">Congratulations! We have
				successfully generated the ad for you. To explore different ad variants and make the best choice, simply
				navigate to the right pane and switch between tabs.</p>
		</div>
		<div class="mt-[0.67em]">
			<span class="font-semibold text-primary text-[1.1em]">Ad Summary</span>
			<p
				class="text-white text-opacity-80 font-diatype text-[0.9em] leading-[1.75em] my-[0.55em]"><!-- Insert your JSON data here -->${json.summary}</p>
		</div>
		<div class="border-t border-gray-600 pt-3 mt-5">
			<ul class="list-disc px-4">
				<li class="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-2">If you find the current
					advertisement unsatisfactory, please feel free to share additional information with us. This will enable us to
					create a better ad for you, and you can easily generate a new one by clicking the 'Regenerate Ad' button.
				</li>
				<li class="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-2">Feel free to provide
					feedback on each ad variant by visiting the "Provide Feedback" section on the right-hand side of the tab.
				</li>
			</ul>
		</div>
	</div>`;

	return (
		<div>
			{/* <Markdown source={str} options={{html: true}} /> */}
			<div>
				<p className="text-white text-opacity-50 font-diatype text-[0.85em] leading-[1.75em] my-[0.4em]">Congratulations! We have
					successfully generated the ad for you. To explore different ad variants and make the best choice, simply
					navigate to the right pane and switch between tabs.</p>
			</div>
			<div className="mt-[1em]">
				<span className="font-semibold text-primary text-[1.1em]">Ad Summary</span>
				<p className="text-white text-opacity-80 font-diatype text-[0.9em] leading-[1.75em] my-[0.55em]">${json.summary}</p>
			</div>
			<div className='flex w-full overflow-auto items-start gap-6 my-[2.5em]'>
				{json.variants.map((variant, index) => (
					<ConversationAdVariant key={variant.id} variantId={variant.id} />
				))}
			</div>
		</div>
	)

	// return (
	// 	<div className="">
	// 		<div>
	// 			<p className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-[0.4em]">Congratulations! We have successfully generated the ad for you. To explore different ad variants and make the best choice, simply navigate to the right pane and switch between tabs.</p>
	// 		</div>
	// 		<div className={"mt-[0.67em]"}>
	// 			<span className="font-semibold text-primary text-[1.2em]">Ad Summary</span>
	// 			<p className="text-white text-opacity-80 font-diatype text-[1em] leading-[1.6em] my-[0.55em]">{json.summary}</p>
	// 		</div>
	// 		<div className={"border-t border-gray-600 pt-3 mt-5"}>
	// 			<ul className="list-disc px-4">
	// 				<li className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-2">If you find the current advertisement unsatisfactory, please feel free to share additional information with us. This will enable us to create a better ad for you, and you can easily generate a new one by clicking the 'Regenerate Ad' button.</li>
	// 				<li className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-2">Feel free to provide feedback on each ad variant by visiting the "Provide Feedback" section on the right-hand side of the tab.</li>
	// 			</ul>
	// 		</div>
	// 	</div>
	// )
}
