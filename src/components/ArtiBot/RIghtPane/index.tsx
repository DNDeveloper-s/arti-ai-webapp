import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import TabView from '@/components/ArtiBot/RIghtPane/TabView';
import FeedBackView from '@/components/ArtiBot/RIghtPane/FeedBackView';
import AdVariant from '@/components/ArtiBot/AdVariant';
import {dummyMessages} from '@/components/ArtiBot/ArtiBot';
import {JSONInput, MessageObj, TabId} from '@/constants/artibotData';
import {intTime} from 'yaml/dist/schema/yaml-1.1/timestamp';

interface RightPaneProps {
	adGenerated: MessageObj;
}

const MIN_WIDTH = 450;

const RightPane: FC<RightPaneProps> = ({adGenerated}) => {
	const [activeAdTab, setActiveAdTab] = useState<TabId>('Facebook');
	const resizeHandleRef = useRef<HTMLDivElement>(null);
	const resizeContainerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(MIN_WIDTH);

	const json = (adGenerated.json && JSON.parse(adGenerated.json)) as JSONInput;

	const currentAdVariant = useMemo(() => {
		if(!json) return null;
		return json.Ads.find(c => c['Ad Type'].includes(activeAdTab));
	}, [activeAdTab, json])

	useEffect(() => {
		if(!resizeHandleRef.current || !resizeContainerRef.current) return;
		const handleRef = resizeHandleRef.current;

		let isMouseDown = false;
		let initialData = {
			x: 0,
			y: 0,
			width: 0
		}
		const mouseDownHandler = (e: MouseEvent) => {
			if(!resizeContainerRef.current) return;
			isMouseDown = true;
			initialData.x = e.clientX;
			initialData.y = e.clientY;
			initialData.width = resizeContainerRef.current.clientWidth;
		}

		const mouseUpHandler = () => {
			isMouseDown = false;
		}

		const mouseMoveHandler = (e) => {
			if(isMouseDown) {
				let _width = initialData.width + (initialData.x - e.clientX);
				if(_width < MIN_WIDTH) _width = MIN_WIDTH;
				setWidth(_width);
			}
		}

		handleRef.addEventListener('mousedown', mouseDownHandler)
		addEventListener('mouseup', mouseUpHandler)
		addEventListener('mousemove', mouseMoveHandler)

		return () => {
			removeEventListener('mousemove', mouseMoveHandler)
			removeEventListener('mouseup', mouseUpHandler)
			if(!handleRef) return;
			handleRef.removeEventListener('mousedown', mouseDownHandler)
		}
	}, [])

	return (
		<div className="w-[450px] pl-3 right-0 top-0 h-full z-10 flex-shrink-0 relative" style={{width}} ref={resizeContainerRef}>
			<div ref={resizeHandleRef} className="absolute left-0 top-0 h-full w-2 bg-white bg-opacity-20 cursor-col-resize hover:w-2.5 transition-all" onMouseDown={(e) => {
				console.log('e', e, e.currentTarget)
			}} />
			<div className="pb-10 overflow-y-auto overflow-x-visible h-full flex flex-col relative items-center bg-black">
				<div className="px-4 py-4">
					<h2 className="text-xl font-medium font-diatype">Rendered View</h2>
				</div>
				<TabView activeAdTab={activeAdTab} setActiveAdTab={setActiveAdTab} />

				{currentAdVariant && <AdVariant noExpand={true} adVariant={currentAdVariant} className="mt-10 p-3 border border-gray-800 bg-secondaryBackground rounded-lg max-w-[80%]" style={{fontSize: '8.5px'}}/>}

				<FeedBackView />

			</div>
		</div>
	)
}

export default RightPane;
