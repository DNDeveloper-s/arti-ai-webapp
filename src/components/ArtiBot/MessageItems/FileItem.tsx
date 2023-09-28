import {FileObject} from '@/interfaces/IArtiBot';
import React from 'react';
import Image from 'next/image';
import {MdDelete} from 'react-icons/md';
import {AiFillCloseCircle, AiFillFileExclamation, AiFillFileText} from 'react-icons/ai';
import {BsFillFileEarmarkPdfFill} from 'react-icons/bs';

interface FileItemProps {
	fileObj: FileObject;
	setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}
const FileItem: React.FC<FileItemProps> = ({fileObj, setFiles}) => {
	console.log('fileObj - ', fileObj);

	if(fileObj.type.includes('image/')) {
		return (
			<div key={fileObj.id} className="h-full w-auto flex-shrink-0 mr-2 rounded-lg overflow-hidden relative border-2 border-secondaryBackground">
				<Image width={100} height={100} className="w-auto h-full" src={fileObj.url} alt="thanks"/>
				<MdDelete className="absolute top-1 right-1 text-primary cursor-pointer" onClick={() => {
					setFiles(e => {
						if(!e) return e;
						return e.filter((c) => c.name !== fileObj.name && c.size !== fileObj.size);
					})
				}}/>
			</div>
		)
	}

	let Icon = <AiFillFileExclamation className="text-6xl text-primary" />;

	if(fileObj.type === 'application/pdf') {
		Icon = <BsFillFileEarmarkPdfFill className="text-6xl text-primary" />
	} else if (fileObj.type === 'text/plain') {
		Icon = <AiFillFileText className="text-6xl text-primary" />
	}

	return (
		<div key={fileObj.id} className="h-full w-auto p-4 flex-shrink-0 flex justify-center flex-col items-center mr-2 rounded-lg overflow-hidden relative border-2 border-secondaryBackground">
			<AiFillCloseCircle className="absolute top-1 right-1 text-primary cursor-pointer" onClick={() => {
				setFiles(e => {
					if(!e) return e;
					return e.filter((c, ind) => ind !== fileObj.id);
				})
			}}/>
			<div className="flex-1 flex justify-center items-center">
				{Icon}
			</div>
			<p className="text-sm opacity-60 max-w-[10rem] text-center line-clamp-2">{fileObj.name}</p>
		</div>
	)
}

export default FileItem;
