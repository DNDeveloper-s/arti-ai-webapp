import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { useEditVariant } from '@/context/EditVariantContext';

interface TabItem {
	id: number,
	name: string,
}

interface TabViewProps {
	activeAdTab: TabItem,
	setActiveAdTab: Dispatch<SetStateAction<TabItem>>,
	items: TabItem[];
	setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function TabViewItem({ container, isActive, label, tabItem, index }) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!ref.current || !isActive) return;
		// ref.current.scrollIntoView({
		// 	behavior: 'smooth',
		// 	block: 'nearest',
		// 	inline: 'nearest'
		// });
	}, [isActive])
	return (
		<div ref={ref} {...container} key={tabItem.id}>
			<span {...label}>{tabItem.name}</span>
		</div>
	)
}

const TabView: FC<TabViewProps> = ({ activeAdTab: activeTab, setActiveAdTab, items, setShowConfirmModal }) => {
	const { state } = useEditVariant();


	const tabItemProps = (tabItem: TabItem) => {
		const isActive = tabItem.id === activeTab.id;
		return ({
			container: {
				className: 'flex py-3 px-4 rounded-t-lg cursor-pointer hover:scale-[1.04] transition-all flex-col-reverse items-center ' + (isActive ? ' bg-primary ' : ' bg-secondaryBackground '),
				onClick: () => {
					const isEdittingOtherVariant = state.variant && state.variant.id !== tabItem.id;
					if (isEdittingOtherVariant) {
						setShowConfirmModal(true);
						return;
					}
					setActiveAdTab(tabItem)
				}
			},
			label: {
				className: 'text-xs text-white whitespace-nowrap' + (isActive ? ' text-opacity-100' : ' text-opacity-60')
			},
			icon: {
				style: { fontSize: '1.7em' }
			}
		})
	}

	return (
		<div className="w-full flex-shrink-0 overflow-hidden py-3 h-auto shadow-gray-200 relative">
			<div className="no-scrollbar flex w-full gap-0 px-4 overflow-x-auto border-b bg-secondaryBackground border-primary">
				{items.map((tabItem, index) => {
					const props = tabItemProps(tabItem);
					return (
						<TabViewItem isActive={tabItem.id === activeTab.id} key={tabItem.id} tabItem={tabItem} container={props.container} label={props.label} index={index} />
					)
				})}
			</div>
		</div>
	)
}

export default TabView;
