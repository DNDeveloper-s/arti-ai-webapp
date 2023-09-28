import {MessageObj} from '@/interfaces/IArtiBot';
import Image from 'next/image';
import {AiFillFileExclamation, AiFillFileText} from 'react-icons/ai';
import {BsFillFileEarmarkPdfFill} from 'react-icons/bs';
import {humanFileSize} from '@/helpers';
import React from 'react';

export default function AttachmentItem({messageItem}: {messageItem: MessageObj}) {

	const renderImage = () => {
		const imagesAttachments = messageItem.attachments?.filter(item => item.type.includes('image/'))
			.map(image => (
				<Image width={1000} height={1000} className="w-full h-32 md:h-64 object-cover" key={image.name + image.size} src={image.url} alt={image.name} />
			))

		if(!imagesAttachments || imagesAttachments.length === 0) return null;

		return (
			<div className="grid grid-col-2 md:grid-cols-3 rounded-xl overflow-hidden gap-1">
				{imagesAttachments}
			</div>
		)
	}

	const renderFile = () => {

		const fileAttachments = messageItem.attachments?.filter(item => !item.type.includes('image/'))
			.map(fileObj => {
				let Icon = <AiFillFileExclamation className="text-6xl text-primary" />;

				if(fileObj.type === 'application/pdf') {
					Icon = <BsFillFileEarmarkPdfFill className="text-6xl text-secondaryText" />
				} else if (fileObj.type === 'text/plain') {
					Icon = <AiFillFileText className="text-6xl text-secondaryText" />
				}

				return (
					<div key={fileObj.name + fileObj.size} className="w-auto flex items-center mb-2 p-4 pr-10 bg-secondaryBackground border border-gray-600 rounded-lg flex-shrink font-diatype">
						{Icon}
						<div className="flex-1 overflow-hidden">
							<p className="text-primary truncate">{fileObj.name}</p>
							<p className="opacity-40 text-xs mt-1">{humanFileSize(fileObj.size)}</p>
						</div>
					</div>
				)
			})

		if(!fileAttachments || fileAttachments.length === 0) return null;

		return (
			<div className="flex flex-col items-start">
				{fileAttachments}
			</div>
		)
	}

	return (
		<>
			{renderImage()}
			{renderFile()}
		</>
	)
}
