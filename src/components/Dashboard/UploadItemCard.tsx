'use client';

import React from 'react';
import webImage from '@/assets/images/image1.webp'
import {BsFillFileEarmarkPdfFill} from 'react-icons/bs';
import Image from 'next/image';
import {AttachmentDetails, FILE_TYPE} from '@/interfaces';

interface UploadItemCardProps {
	fileDetails: AttachmentDetails;
	onClick: (val: AttachmentDetails) => void;
}

const UploadItemCard:React.FC<UploadItemCardProps> = (props) => {

	let jsx = null;

	if(props.fileDetails.type === 'pdf') {
		jsx = (
			<>
				<div className="flex-1 flex justify-center items-center">
					<BsFillFileEarmarkPdfFill className="text-6xl text-primary" />
				</div>
				<p className="text-sm opacity-60 max-w-[10rem] text-center line-clamp-2">{props.fileDetails?.name ?? 'File.pdf'}</p>
			</>
		)
	}

	if(props.fileDetails.type === 'image') {
		jsx = (
			<div className="flex-1 flex justify-center items-center">
				<Image width={300} height={300} src={props.fileDetails.url} alt="Arti AI" />
			</div>
		)
	}
	return <div onClick={() => props.onClick(props.fileDetails)} className={'flex-shrink-0 pb-4 h-[10rem] flex flex-col items-center min-w-[10rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		{jsx}
	</div>
}

export default UploadItemCard;
