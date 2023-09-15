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
				className: 'flex py-3 px-4 rounded-t-lg cursor-pointer hover:scale-[1.04] transition-all flex-col-reverse items-center ' + (isActive ? ' bg-primary ' : ' bg-secondaryBackground '),
				onClick: () => setActiveAdTab(tabItem.id)
			},
			label: {
				className: 'text-xs text-white whitespace-nowrap' + (isActive ? ' text-opacity-100' : ' text-opacity-60')
			},
			icon: {
				style: {fontSize: '1.7em', color: isActive ? 'white' : tabItem.color}
			}
		})
	}

	return (
		<div className="w-full flex-shrink-0 overflow-hidden py-3 h-auto shadow-gray-200 relative">
			<div className="no-scrollbar flex w-full gap-0 px-4 overflow-x-auto border-b bg-secondaryBackground border-primary">
				{artiBotData.tabItems.map(tabItem => {
					const props = tabItemProps(tabItem);
					return (
						<div {...props.container} key={tabItem.id}>
							<span {...props.label}>{tabItem.label}</span>
							{tabItem.icon && <tabItem.icon {...props.icon} />}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default TabView;
