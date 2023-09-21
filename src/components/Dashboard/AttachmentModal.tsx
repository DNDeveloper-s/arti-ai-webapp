import {IoCloseSharp} from 'react-icons/io5';
import Modal from '@/components/Modal';
import React, {FC, ReactElement} from 'react';
import {AttachmentDetails, FILE_TYPE, ModalDispatchAction} from '@/interfaces';
import Image, {StaticImageData} from 'next/image';

interface AttachmentModalProps<T = AttachmentDetails> {
	fileDetails: ModalDispatchAction<T>
	open: ModalDispatchAction<T>;
	setOpen: (val: ModalDispatchAction<T>) => void;
}

const AttachmentModal: FC<AttachmentModalProps> = (props) => {

	function handleClose() {
		props.setOpen(false);
	}

	let jsx: ReactElement = <></>;

	if(props.fileDetails && props.fileDetails.type === 'pdf') {
		jsx = (
			<>
				<IoCloseSharp onClick={handleClose} className="absolute cursor-pointer text-white top-4 right-4 z-10 scale-[1.7]" />
				<iframe className="w-[70vw] h-[70vh]" src={props.fileDetails.url + "#toolbar=0"}></iframe>
			</>
		)
	}

	if(props.fileDetails && props.fileDetails.type === 'image') {
		jsx = (
			<div className={"w-[70vw] h-[70vh]"}>
				<IoCloseSharp onClick={handleClose} className="absolute cursor-pointer text-white top-4 right-4 z-10 scale-[1.7]" />
				<Image className="w-full h-full object-contain" src={props.fileDetails.url} alt="Attachment Item" />
			</div>
		)
	}

	return (
		<Modal setOpen={props.setOpen} open={props.open}>
			{jsx}
		</Modal>
	)
}

export default AttachmentModal;
