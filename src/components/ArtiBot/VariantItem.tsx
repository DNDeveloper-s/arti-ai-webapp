import React, {FC, useEffect, useRef, useState} from 'react';
import FacebookAdVariant from '@/components/ArtiBot/FacebookAdVariant';
import FeedBackView from '@/components/ArtiBot/RIghtPane/FeedBackView';
import {AdCreativeVariant} from '@/interfaces/IAdCreative';
import {timeSince} from '@/helpers';
import {Mock} from '@/constants/servicesData';
import { EditFacebookAdVariant } from './EditAdVariant/EditAdVariant';
import {startEditingVariant, stopEditingVariant, useEditVariant} from '@/context/EditVariantContext';
import {useConversation} from '@/context/ConversationContext';
import CTAButton from '../CTAButton';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

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
	const {dispatch, state} = useEditVariant();
	const isEditting = state.variant && state.variant.id === activeVariant.id;

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

	function handleClose() {
		// setMode(AD_VARIANT_MODE.VIEW);
		stopEditingVariant(dispatch);
	}

	return (
		<>
			{activeVariant && (
				<>
					{/* <div className={'flex w-[80%] justify-between items-center ' + (mock.is ? 'mt-2' : 'mt-4')}>
						<label htmlFor="message" className="block text-sm font-light text-white text-opacity-50 text-left">Ad Preview</label>
						{activeVariant.updatedAt && !mock.is && <span className="whitespace-nowrap">
							<span className="text-white text-opacity-30 text-xs">Generated: </span>
							<span className="text-white text-opacity-80 text-xs">{timeSince(activeVariant.updatedAt) + ' ago'}</span>
						</span>}
					</div> */}
					{!mock.is && !isEditting && <div className={'flex justify-end w-[80%] mt-2 items-center gap-1 text-xs'}>
						<span className="text-white text-opacity-50">Explore Options:</span>
						<button onClick={() => {
							// setMode(AD_VARIANT_MODE.EDIT);
							startEditingVariant(dispatch, activeVariant);
						}} className="bg-primary text-white px-3 py-1 leading-[14px] rounded cursor-pointer">Edit Your Ad</button>
					</div>}
					<div ref={variantRef} className={"mt-2 w-[80%]"}>
						{!isEditting ? <FacebookAdVariant mock={mock} adVariant={activeVariant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: (fontSize) + 'px'}}/> : (
							state.variant && <EditFacebookAdVariant showConfirmModal={props.showConfirmModal} setShowConfirmModal={props.setShowConfirmModal} handleEditVariantClose={handleClose} mock={mock} adVariant={state.variant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-black rounded-lg" style={{fontSize: (fontSize) + 'px'}}/>
						)}
					</div>
				</>
			)}

			{/*{!mock.is && activeVariant && <FeedBackView variant={activeVariant}/>}*/}
		</>
	);
};

export default VariantItem;
