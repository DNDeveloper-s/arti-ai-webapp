import React, {FC, useState} from 'react';

interface TabItemProps {
	item: TabItem;
	onClick?: (item: TabItem) => void;
	isActive: boolean;
}

const TabItem: FC<TabItemProps> = ({item, isActive, onClick}) => {

	return (
		<div
			className={'px-4 rounded cursor-pointer mr-0.5 text-sm flex gap-1 items-center ' + (isActive ? ' bg-primary ' : ' bg-secondaryBackground ')}
			onClick={() => onClick && onClick(item)}
		>
			{item.icon && <item.icon className="w-4 h-4" fill={"white"} />}
			<span className="whitespace-nowrap">{item.label}</span>
		</div>
	);
}

export interface TabItem {
	label: string;
	icon?: FC<React.SVGProps<SVGSVGElement>>;
	id: string;
}

interface TabsProps {
	items: TabItem[]
	activeItem?: TabItem['id'];
	handleChange?: (item: TabItem) => void;
}

const Tabs: FC<TabsProps> = ({items, activeItem = items[0].id, handleChange}) => {
	const [active, setActive] = useState(activeItem)

	function handleActiveChange(item: TabItem) {
		setActive(item.id);
		handleChange && handleChange(item);
	}

	return (
		<div className="w-full flex bg-gray-800 h-full p-0.5 rounded">
			{items.map(item => <TabItem key={item.id} isActive={active === item.id} onClick={handleActiveChange} item={item} />)}
		</div>
	);
};

export default Tabs;
