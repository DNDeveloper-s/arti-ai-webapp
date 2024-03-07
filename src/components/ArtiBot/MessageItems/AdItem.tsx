import {ChatGPTMessageObj, IAdVariant} from '@/interfaces/IArtiBot';
import React, {useContext, useState} from 'react';
import {IAdCreative} from '@/interfaces/IAdCreative';
import FacebookAdVariant from '../FacebookAdVariant';
import {MdDownload, MdOutlineModeEdit} from 'react-icons/md';
import {GrDeploy} from 'react-icons/gr';
import {EditFacebookAdVariant} from '../EditAdVariant/EditAdVariant';
import {startEditingVariant, stopEditingVariant, useEditVariant} from '@/context/EditVariantContext';
import {updateVariantToDB, useConversation} from '@/context/ConversationContext';
import {SnackbarContext} from '@/context/SnackbarContext';
import Loader from '@/components/Loader';
import {dbImagesPrefixes} from '@/constants';
import uploadImage from '@/services/uploadImage';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import DeployButton from './DeployButton';

export function blobToBase64(blob: Blob) {
	return new Promise((resolve, _) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
}

export function dataUrlToBase64(dataUrl: string) {
	// Split the data URL into parts
	const parts = dataUrl.split(',');

	// Ensure it's a data URL with a base64 part
	if (parts.length === 2 && parts[0].startsWith('data:')) {
		// Extract the base64 data
		return parts[1];
	} else {
		// Handle invalid or unsupported data URL
		console.error('Invalid or unsupported data URL');
		return null;
	}
}

export async function fetchImage(url: string): Promise<string> {
	const imageKey = url.split('/').pop();
	const apiUrl = url.startsWith('blob:') ? url : `https://api.artiai.org/v1/utils/image/${imageKey}`;
	const reader = new window.FileReader();
	const blob = await fetch(apiUrl)
		.then(res => res.blob())
	return await blobToBase64(blob) as Promise<string>;
}

function ConversationAdVariant({variantId}: {variantId: string}) {
	const {dispatch, state: editState} = useEditVariant();
	const {dispatch: conversationDispatch, state, updateVariant} = useConversation();
	const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
	const [updating, setUpdating] = useState(false);
	const [url, setUrl] = useState<string | null>(null);
	const [downloading, setDownloading] = useState(false);

	const variant = state.variant.map[variantId] as IAdVariant ?? null;
	const editMode = editState.variant && editState.variant.id === variantId;

	if(!variant) return null;

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
				saveAs(content, `Ad-Variant_${variantId}.zip`);
			})
			.catch(err => {
				console.error('Failed to create zip file', err);
				setSnackbarData({message: 'Failed to download ad variant', status: 'error'})
				setDownloading(false);
			})
	}

	async function handleEdit() {
		const response = await fetch('https://arti-ai-app.s3.amazonaws.com/65d2cb22fd28b4be40b8cb17_1709139403556.png');

		const blob = await response.blob();

		const reader = new window.FileReader();
		reader.onloadend = () => {
			console.log('result - ', reader.result);
		}

		return;
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

	return (
		<div key={variant.id} className="group/variant flex-shrink-0 relative">
			{!editMode ? <FacebookAdVariant adVariant={variant} className="p-3 !w-[400px] !max-w-unset border !border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '8px', opacity: editMode ? 0 : 1, pointerEvents: editMode ? 'none' : 'all'}} /> :
			<EditFacebookAdVariant 
				showConfirmModal={false}
				setShowConfirmModal={() => {}} 
				handleSaveVariant={handleSaveVariant} 
				handleEditVariantClose={editVariantClose} 
				adVariant={editState.variant as IAdVariant} 
				className="p-3 !w-[400px] !max-w-unset border border-gray-800 h-auto rounded-lg" style={{fontSize: '8px'}} /> }
			{!downloading && !updating && !editMode && <div className='transition-all group-hover/variant:opacity-100 group-hover/variant:pointer-events-auto pointer-events-none opacity-0 absolute bg-black bg-opacity-70 top-0 left-0 w-full h-full flex flex-wrap justify-center gap-5 items-end pb-10'>
				<button onClick={handleEdit} className='cursor-pointer text-white hover:scale-105 text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
					<MdOutlineModeEdit />
					<span>Edit</span>
				</button>
				{/*<button className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>*/}
				{/*	<GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />*/}
				{/*	<span>Deploy</span>*/}
				{/*</button>*/}
				<button onClick={handleDownload} className="cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all">
					<MdDownload className="fill-white stroke-white [&>path]:stroke-white"/>
					<span>Download</span>
				</button>
        <div className='flex justify-center items-center gap-5'>
          <DeployButton variant={variant} />
        </div>
			</div>}
			{updating && <div
				className="flex items-center z-30 justify-center absolute top-0 left-0 w-full h-full bg-black bg-opacity-60">
				<Loader/>
			</div>}
			{downloading && <div
        className="flex items-center z-30 gap-2 justify-center absolute top-0 left-0 w-full h-full bg-black bg-opacity-60">
        <Loader className={'w-5 h-5'} />
        <span>Preparing to Download</span>
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


// {
//     "Version": "2012-10-17",
//     "Id": "Policy1692512740516",
//     "Statement": [
//         {
//             "Sid": "Stmt1692512736599",
//             "Effect": "Allow",
//             "Principal": {
//                 "AWS": "*"
//             },
//             "Action": [
//                 "s3:GetObject",
//                 "s3:GetObjectAcl",
//                 "s3:GetObjectAttributes",
//                 "s3:GetObjectRetention",
//                 "s3:GetObjectVersion",
//                 "s3:GetObjectVersionAttributes",
//                 "s3:GetObjectVersionForReplication",
//                 "s3:GetObjectVersionTagging",
//                 "s3:GetObjectVersionTorrent"
//             ],
//             "Resource": "arn:aws:s3:::srs-billing-storage/*"
//         }
//     ]
// }
