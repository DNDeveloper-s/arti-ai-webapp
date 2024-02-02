import {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import {AdCreativeVariant} from '@/interfaces/IAdCreative';

interface TabViewProps {
	activeAdTab: AdCreativeVariant,
	setActiveAdTab: Dispatch<SetStateAction<AdCreativeVariant>>,
	items: AdCreativeVariant[];
}

function TabViewItem({container, isActive, label, tabItem, index}) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if(!ref.current || !isActive) return;
		// ref.current.scrollIntoView({
		// 	behavior: 'smooth',
		// 	block: 'nearest',
		// 	inline: 'nearest'
		// });
	}, [isActive])
	return (
		<div ref={ref} {...container} key={tabItem.id}>
			<span {...label}>{'Variant #' + (index + 1)}</span>
		</div>
	)
}

const TabView: FC<TabViewProps> = ({activeAdTab, setActiveAdTab, items}) => {


	const tabItemProps = (tabItem: AdCreativeVariant) => {
		const isActive = tabItem.id === activeAdTab.id;
		return ({
			container: {
				className: 'flex py-3 px-4 rounded-t-lg cursor-pointer hover:scale-[1.04] transition-all flex-col-reverse items-center ' + (isActive ? ' bg-primary ' : ' bg-secondaryBackground '),
				onClick: () => setActiveAdTab(tabItem)
			},
			label: {
				className: 'text-xs text-white whitespace-nowrap' + (isActive ? ' text-opacity-100' : ' text-opacity-60')
			},
			icon: {
				style: {fontSize: '1.7em'}
			}
		})
	}

	return (
		<div className="w-full flex-shrink-0 overflow-hidden py-3 h-auto shadow-gray-200 relative">
			<div className="no-scrollbar flex w-full gap-0 px-4 overflow-x-auto border-b bg-secondaryBackground border-primary">
				{items.map((tabItem, index) => {
					const props = tabItemProps(tabItem);
					return (
						<TabViewItem isActive={tabItem.id === activeAdTab.id} key={tabItem.id} tabItem={tabItem} container={props.container} label={props.label} index={index} />
					)
				})}
			</div>
		</div>
	)
}

export default TabView;
