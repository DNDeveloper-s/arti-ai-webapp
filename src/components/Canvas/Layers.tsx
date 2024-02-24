import React, {FC, useCallback, useEffect, useMemo, useRef} from 'react';
import DraggableList from 'react-draggable-list';
import {GrDrag} from 'react-icons/gr';
import {Element} from './EditCanvas';
import {IoLayers} from 'react-icons/io5';

const list = [
	{id: 1, content: 'Layer 1'},
	{id: 2, content: 'Layer 2'},
	{id: 3, content: 'Layer 3'},
	{id: 4, content: 'Layer 4'},
	{id: 5, content: 'Layer 5'},
]

interface LayerItemProps {
	item: Element;
	itemSelected: number;
	selected: boolean;
	dragHandleProps: object;
	handleUpdateName: (itemId: any, name: string) => void;
}
const LayerItem: FC<LayerItemProps> = ({handleUpdateName, selected, ...props}) => {
	const [editMode, setEditMode] = React.useState(false);
	const [editValue, setEditValue] = React.useState(props.item.name);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if(editMode) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 10)
		}
	}, [editMode]);

	function handleNameChange(e) {
		setEditValue(e.target.value);
		// handleUpdateName(props.item.id, e.target.value);
	}

	// useEffect(() => {
	// 	function handleFocus(e: any) {
	// 		console.log('e.target - ', e.target);
	// 	}
	//
	// 	addEventListener('click', handleFocus);
	//
	// 	return () => {
	// 		removeEventListener('click', handleFocus);
	// 	}
	// }, [])

	return (
		<div className={'h-8 w-full p-2 flex items-center relative text-sm gap-2 text-white ' + (selected ? ' bg-gray-600' : '')}>
			<div {...props.dragHandleProps}>
				<div className={'text-gray-300 cursor-grab'}>
					<GrDrag className={'text-gray-300 [&>path]:stroke-gray-300'}/>
				</div>
			</div>
			{!editMode ? <span onClick={e => {e.detail === 2 && setEditMode(true)}} className={'block select-none flex-1 truncate px-1'}>{props.item.name}</span> :
			<div className={'flex-1 relative'}>
				<input ref={inputRef} type="text" className={'rounded-[1px] px-1 w-full focus:outline-blue-500 focus-within:outline-none border-none bg-transparent text-white'} value={editValue} onChange={handleNameChange}/>
			</div>}
		</div>
	)
}

export interface LayersProps {
	list: Element[];
	onListChange: (newList: Element[]) => void;
	setElements: (elements: any) => void;
	selectedElement?: number;
}

const Layers: FC<LayersProps> = ({setElements, selectedElement, ...props}) => {
	const scrollListRef = useRef<HTMLDivElement>(null);
	function onListChange(newList: Element[]) {
		// setListItem(newList);
		const sortedList = newList.map((i, ind) => ({...i, order: ind}));
		props.onListChange(sortedList);
	}

	const listItem = useMemo(() => {
		const arr = [...props.list]
		arr.sort((a,b) => a.order - b.order);
		return arr;
	}, [props.list]);

	const handleUpdateName = useCallback((itemId: any, name: string) => {
		setElements((prevElements: any) => {
			const elIndex = prevElements.findIndex((el:Element) => el.id === itemId);
			const newElements = [...prevElements];
			newElements[elIndex] = {...newElements[elIndex], name};
			return newElements;
		})
	}, [setElements])

	return (
		<div className={'w-[200px] bg-gray-900 rounded py-3 flex flex-col overflow-hidden max-h-[300px]'}>
			<div className={'px-3 pb-2 flex gap-2 items-center text-sm text-gray-200'}>
				<IoLayers />
				<span className={'font-medium text-gray-300'}>Layers</span>
			</div>
			<div className={'overflow-auto flex-1'} ref={scrollListRef}>
				<DraggableList
					container={() => scrollListRef.current}
					onMoveEnd={onListChange}
					itemKey={'id'}
					list={listItem}
					template={(props) => <LayerItem key={props.item.id} selected={props.item.id === selectedElement} handleUpdateName={handleUpdateName} {...props} />}
				/>
			</div>
		</div>
	);
};

export default Layers;
