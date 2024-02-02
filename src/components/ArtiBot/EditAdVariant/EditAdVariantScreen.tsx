import React, {FC, useState} from 'react';
import {stopEditingVariant, useEditVariant} from '@/context/EditVariantContext';
import {EditFacebookAdVariant} from '@/components/ArtiBot/EditAdVariant/EditAdVariant';
import {IAdVariant} from '@/interfaces/IArtiBot';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import CTAButton from '@/components/CTAButton';
import Modal from '@/components/Modal';
import FacebookAdVariant from '../FacebookAdVariant';

interface EditAdVariantScreenProps {
	adVariant: IAdVariant;
}

const EditAdVariantScreen: FC<EditAdVariantScreenProps> = (props) => {
	const {dispatch} = useEditVariant();
	const [showPreview, setShowPreview] = useState(false);

	function handleClose() {
		console.log('stop editting')
		stopEditingVariant(dispatch);
	}

	return (
		<div className='overflow-auto h-full'>
			<Modal PaperProps={{className: 'bg-black bg-opacity-90'}} handleClose={() => setShowPreview(false)} open={showPreview}>
				<div className='max-w-[500px]'>
					<FacebookAdVariant adVariant={props.adVariant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '12px'}}  />
				</div>
			</Modal>
			<div className="px-4 w-full py-4 flex justify-between items-center">
				<h2 className="text-xl font-medium font-diatype">Edit Ad Variant</h2>
				<div className={'flex items-center gap-4'}>
					<CTAButton className={'py-1 px-3 rounded text-sm'} onClick={() => setShowPreview(true)}>
						<span>Preview</span>
					</CTAButton>
					<div className='text-lg cursor-pointer' onClick={handleClose}>
						<CloseIcon />
					</div>
				</div>
			</div>
			<div className={'w-[80%] mx-auto'}>
				<EditFacebookAdVariant adVariant={props.adVariant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: '9px'}} />
			</div>
		</div>
	);
};

export default EditAdVariantScreen;
