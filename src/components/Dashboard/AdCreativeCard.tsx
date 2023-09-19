import React, {MouseEventHandler} from 'react';
import {ChatGPTMessageItem} from '@/components/ArtiBot/ArtiBot';
import {ChatGPTMessageObj, ChatGPTRole, JSONInput} from '@/constants/artibotData';
import exampleJSON from '@/database/exampleJSON';
import AdVariant from '@/components/ArtiBot/AdVariant';

interface AdCreativeCardProps {
	onClick: (val: string) => null;
}

const AdCreativeCard:React.FC<AdCreativeCardProps> = (props) => {

	const json = JSON.parse(exampleJSON) as JSONInput;

	return <div onClick={() => props.onClick('')} className={'w-[25rem] flex-shrink-0 pb-4  relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		<div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
		<div className="py-3 px-3 relative flex items-center justify-between z-20">
			<h2 className="text-sm text-primary">Doubt about the creative design</h2>
			<span>
				<span className="text-white text-opacity-30 text-[1.1em]">Generated:</span>
				<span className="text-primary text-[1.1em]">1 day ago</span>
			</span>
		</div>
		<div className={"flex gap-3 px-3"}>
			{json.Ads.map(currentAdVariant => (
				<AdVariant key={currentAdVariant['One Liner']} noExpand={true} adVariant={currentAdVariant} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]" style={{fontSize: '2px'}}/>
			))}
		</div>
	</div>
}

export default AdCreativeCard;
