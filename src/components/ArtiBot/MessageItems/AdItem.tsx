import { AdJSONInput, ChatGPTMessageObj, IAdVariant } from '@/interfaces/IArtiBot';
import AdVariant from '@/components/ArtiBot/AdVariant';
import React, { useContext, useState } from 'react';
import { IAdCreative } from '@/interfaces/IAdCreative';
import Markdown from 'react-remarkable';
import FacebookAdVariant from '../FacebookAdVariant';
import { MdOutlineModeEdit } from 'react-icons/md';
import { GrDeploy } from 'react-icons/gr';
import axios, { AxiosError } from 'axios';
import { ROUTES } from '@/config/api-config';
import { EditFacebookAdVariant } from '../EditAdVariant/EditAdVariant';
import { startEditingVariant, stopEditingVariant, useEditVariant } from '@/context/EditVariantContext';
import { SnackbarContext } from '@/context/SnackbarContext';
import Snackbar from '@/components/Snackbar';
import { useConversation } from '@/context/ConversationContext';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';

function ConversationAdVariant({ variantId }: { variantId: string }) {
	const { dispatch, state: editState } = useEditVariant();
	const { state, updateVariant } = useConversation();

	const variant = state.variant.map[variantId] as IAdVariant ?? null;
	const editMode = editState.variant && editState.variant.id === variantId;

	if (!variant) return null;

	function handleEdit() {
		if (!variant) return null;
		stopEditingVariant(dispatch);
		startEditingVariant(dispatch, variant);
	}

	function editVariantClose() {
		stopEditingVariant(dispatch);
	}

	function handleSaveVariant() {
		updateVariant(editState.variant as IAdVariant);
		stopEditingVariant(dispatch);
	}

	return (
		<div key={variant.id} className="group/variant flex-shrink-0 relative">
			{!editMode ? <FacebookAdVariant adVariant={variant} className="p-3 !w-[400px] !max-w-unset border !border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{ fontSize: '8px' }} /> :
				<EditFacebookAdVariant showConfirmModal={false} setShowConfirmModal={() => { }} handleSaveVariant={handleSaveVariant} handleEditVariantClose={editVariantClose} adVariant={editState.variant as IAdVariant} className="p-3 !w-[400px] !max-w-unset border border-gray-800 h-full bg-black rounded-lg" style={{ fontSize: '8px' }} />}
			{!editMode && <div className='transition-all group-hover/variant:opacity-100 group-hover/variant:pointer-events-auto pointer-events-none opacity-0 absolute bg-black bg-opacity-70 top-0 left-0 w-full h-full flex justify-center gap-5 items-end pb-10'>
				<button onClick={handleEdit} className='cursor-pointer text-white hover:scale-105 text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
					<MdOutlineModeEdit />
					<span>Edit</span>
				</button>
				<DeployButton variant={variant} />
			</div>}
		</div>
	)
}

const DeployButton = ({ variant }: { variant: IAdVariant }) => {
	const [isLoadingPages, setLoadingPages] = useState(false)
	const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;
	const [showPreview, setShowPreview] = useState<boolean>(false);
	const [pagesData, setPagesData] = useState([])
	const [selectedPage, selectPage] = useState(null)

	async function getUserPages() {
		selectPage(null)
		const accessToken = "EAAJKrtHx2ZB8BO1rWSJj32B6JeZCgf8I1jxY9oJJN1ZCCWh8kL1FoGmdWbVfYVfW9TLoZBjGQEiT2I1zZAbcOLveyEHbaUnkdBS1m3OJvJCU8ZBiHnqu2JH2GyMUHxAaYRPl74FfGccLZCuxiZAGZAWlRZB0FGTiv0jagGeDWUvpR7X3ZCRoKLj9xMUbEBZCpkHEqg2oQ6fZBAbotAcDZAK0zEIrnK7IInR6oZBgGc4yGUZD"

		try {
			if (isLoadingPages) return;
			setLoadingPages(true)
			const response = await axios.get(ROUTES.SOCIAL.GET_ALL_PAGES, {
				params: {
					access_token: accessToken,
				}
			});

			setPagesData(response.data.data)
		} catch (error: any) {
			setSnackBarData({ status: 'error', message: error.response.data.message });
		} finally {
			setLoadingPages(false)
		}
	}

	async function handleDeploy() {
		setShowPreview(true)
	}

	return (
		<>
			<button onClick={handleDeploy} className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
				<GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />
				<span>Deploy</span>
			</button>
			<Modal PaperProps={{ className: 'bg-black bg-opacity-90 p-6 w-[800px] h-[600px]' }} handleClose={() => setShowPreview(false)} open={showPreview}>
				<div className=''>
					<div className="flex justify-between content-center">
						<p className="font-bold text-2xl">Select A Page</p>
						<button className="px-8 bg-green-600 text-white rounded-md" onClick={getUserPages}>{isLoadingPages ? <Loader /> : "Refresh"}</button>
					</div>
					<div className='mt-8 flex items-start'>
						{pagesData ? pagesData.map((item, index) => {
							return <button key={item.id} onClick={() => selectPage(item)}>
								<div className={`flex rounded-md ${item.id == selectedPage?.id ? 'bg-slate-600' : 'bg-slate-300'} p-2  pr-8`}>
									<div className="rounded-md py-2 px-4 bg-slate-500 font-bold text-2xl text-white mr-4" >{item.name[0]}</div>
									<div className="flex flex-col items-start">
										<p className={`font-bold ${item.id == selectedPage?.id ? 'text-white' : 'text-black'}`}>{item.name}</p>
										<p className={`${item.id == selectedPage?.id ? 'text-slate-300' : 'text-slate-800'} text-xs`}>{item.id}</p>
									</div>
								</div> </button>
						}) : <p></p>}
						{selectedPage ? <CreatePostView selectedVariant={variant} pageId={selectedPage.id} pageAccessToken={selectedPage.access_token} /> : <></>}
					</div>
				</div>
			</Modal>
			<Snackbar />
		</>
	);
}

const CreatePostView = ({ selectedVariant, pageId, pageAccessToken }: { selectedVariant: IAdVariant, pageId: string, pageAccessToken: string }) => {

	const [errorMessage, setErrorMessage] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [isLoading, setLoading] = useState(false)
	const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;

	let isImageReady = imageUrl && imageUrl.length > 0

	const createPost = async () => {
		try {
			if (isLoading) return;
			setLoading(true)
			const response = await axios.post(ROUTES.SOCIAL.CREATE_POST, {
				post: {
					url: isImageReady ? imageUrl : selectedVariant.imageUrl!,
					message: selectedVariant.text,
				},
				page_id: pageId,
				page_access_token: pageAccessToken,
			}, {
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				}
			});

			if (response.status === 200) {
				setSnackBarData({ status: 'success', message: "Your post was published successfully." });
			}
		} catch (error: any) {
			setSnackBarData({ status: 'error', message: error.response.data.message });
		} finally {
			setLoading(false)
		}
	}

	const onImageUrlChange = (e: any) => {
		setImageUrl(e.target.value)
	}

	return <>
		<div className="flex flex-col p-6 rounded-lg bg-white ml-4 text-black items-center justify-center content-center">
			{selectedVariant ?
				<div>
					<input className="mb-2 border border-black-200 p-2 w-[400px]" placeholder="Enter image URL" onChange={onImageUrlChange} />
					<img className="mb-1 rounded-md h-[200px] w-[200px]" src={isImageReady ? imageUrl : selectedVariant.imageUrl!}></img>
					<p className="mb-4">{selectedVariant.text}</p>
					<p className="text-red-500 text-xs">{errorMessage}</p>
					<button className="bg-blue-500 text-white text p-3 rounded-md w-full mt-1" onClick={createPost}>{isLoading ? 'Posting...' : 'Post'}</button>
				</div>
				: <p>Select a variant!</p>}
		</div>
	</>
}

export default function AdItem({ messageItem, variantFontSize }: { messageItem: ChatGPTMessageObj, variantFontSize?: number }) {

	// const json = messageItem.json && JSON.parse(messageItem.json) as AdJSONInput;
	const json = messageItem.adCreatives && messageItem.adCreatives[0] as IAdCreative;

	if (!json) return null;

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
