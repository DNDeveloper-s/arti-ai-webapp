import {FC} from 'react';
import Image from 'next/image';
import EmptyFolderWebp from '@/assets/images/vectors/EmptyFolder.webp';

interface EmptyFolderIconProps {
	className?: string;
	width?: number;
	height?: number;
}

const EmptyFolderIcon: FC<EmptyFolderIconProps> = (props) => {
	return <Image width={props.width ?? 300} height={props.height ?? 300} src={EmptyFolderWebp} alt="Empty Folder" />
}

export default EmptyFolderIcon;
