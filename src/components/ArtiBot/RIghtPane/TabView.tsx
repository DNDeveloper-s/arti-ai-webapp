import {artiBotData, TabId, TabItem} from '@/constants/artibotData';
import {Dispatch, FC, SetStateAction, useState} from 'react';

interface TabViewProps {
	activeAdTab: TabId,
	setActiveAdTab: Dispatch<SetStateAction<TabId>>,
}

const TabView: FC<TabViewProps> = ({activeAdTab, setActiveAdTab}) => {

	const tabItemProps = (tabItem: TabItem) => {
		const isActive = tabItem.id === activeAdTab;
		return ({
			container: {
				className: 'flex py-3 rounded-xl cursor-pointer hover:scale-[1.04] transition-all flex-col-reverse items-center ' + (isActive ? ' scale-[1.04] bg-primary ' : ' bg-secondaryBackground '),
				onClick: () => setActiveAdTab(tabItem.id)
			},
			label: {
				className: 'text-xs text-white mt-2' + (isActive ? ' text-opacity-100' : ' text-opacity-60')
			},
			icon: {
				style: {fontSize: '1.7em', color: isActive ? 'white' : tabItem.color}
			}
		})
	}

	return (
		<div className="w-full flex-shrink-0 overflow-hidden h-[100px] relative">
			<div className="grid grid-cols-[repeat(5,_75px)] gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				{artiBotData.tabItems.map(tabItem => {
					const props = tabItemProps(tabItem);
					return (
						<div {...props.container} key={tabItem.id}>
							<span {...props.label}>{tabItem.label}</span>
							<tabItem.icon {...props.icon} />
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default TabView;
