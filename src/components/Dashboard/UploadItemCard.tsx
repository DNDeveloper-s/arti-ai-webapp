import React from 'react';
import webImage from '@/assets/images/image1.webp'
import {BsFillFileEarmarkPdfFill} from 'react-icons/bs';
import Image from 'next/image';

interface UploadItemCardProps {
	fileDetails: {
		url?: string;
		type: 'pdf' | 'image' | 'txt' | 'doc' | string;
	}
}

const UploadItemCard:React.FC<UploadItemCardProps> = (props) => {

	let jsx = null;

	if(props.fileDetails.type === 'pdf') {
		jsx = (
			<>
				<div className="flex-1 flex justify-center items-center">
					<BsFillFileEarmarkPdfFill className="text-6xl text-primary" />
				</div>
				<p className="text-sm opacity-60 max-w-[10rem] text-center line-clamp-2">My File.pdf</p>
			</>
		)
	}

	if(props.fileDetails.type === 'image') {
		jsx = (
			<div className="flex-1 flex justify-center items-center">
				<Image width={300} height={300} src={webImage} alt="Arti AI" />
			</div>
		)
	}
	return <div className={'flex-shrink-0 pb-4 h-[10rem] flex flex-col items-center min-w-[10rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		{jsx}
	</div>
}

export default UploadItemCard;
