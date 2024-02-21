import {AdJSONInput, ChatGPTMessageObj, IAdVariant} from '@/interfaces/IArtiBot';
import AdVariant from '@/components/ArtiBot/AdVariant';
import React, { useState } from 'react';
import {IAdCreative} from '@/interfaces/IAdCreative';
import Markdown from 'react-remarkable';
import FacebookAdVariant from '../FacebookAdVariant';
import { MdOutlineModeEdit } from 'react-icons/md';
import { GrDeploy } from 'react-icons/gr';
import { EditFacebookAdVariant } from '../EditAdVariant/EditAdVariant';
import { startEditingVariant, useEditVariant } from '@/context/EditVariantContext';

function ConversationAdVariant({variant}: {variant: IAdVariant}) {
	const [editMode, setEditMode] = useState(false);
	const {dispatch} = useEditVariant();

	function handleEdit() {
		setEditMode(true);
		startEditingVariant(dispatch, variant);
	}

	return (
		<div key={variant.id} className="group/variant flex-shrink-0 relative">
			{!editMode ? <FacebookAdVariant adVariant={variant} className="p-3 !w-[400px] !max-w-unset border !border-red-500 border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '8px'}} /> : 
			<EditFacebookAdVariant showConfirmModal={false} setShowConfirmModal={() => {}} handleEditVariantClose={() => {setEditMode(false)}} adVariant={variant} className="p-3 !w-[400px] !max-w-unset border border-gray-800 h-full bg-black rounded-lg" style={{fontSize: '8px'}} /> }
			{!editMode && <div className='transition-all group-hover/variant:opacity-100 group-hover/variant:pointer-events-auto pointer-events-none opacity-0 absolute bg-black bg-opacity-70 top-0 left-0 w-full h-full flex justify-center gap-5 items-end pb-10'>
				<button onClick={handleEdit} className='cursor-pointer text-white hover:scale-105 text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
					<MdOutlineModeEdit />
					<span>Edit</span>
				</button>
				<button className='cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all'>
					<GrDeploy className='fill-white stroke-white [&>path]:stroke-white' />
					<span>Deploy</span>
				</button>
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
					<ConversationAdVariant key={variant.id} variant={variant} />
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
