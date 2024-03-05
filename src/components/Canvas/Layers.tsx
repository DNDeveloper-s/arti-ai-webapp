import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import DraggableList from 'react-draggable-list';
import {GrDrag} from 'react-icons/gr';
import {Element} from './EditCanvas';
import {IoLayers} from 'react-icons/io5';
import ContextMenu from '../shared/renderers/ContextMenu';
import Portal from '../Portal';
import { useClickAway } from '@/hooks/useClickAway';
import { MdDelete } from 'react-icons/md';

const list = [
	{id: 1, content: 'Layer 1'},
	{id: 2, content: 'Layer 2'},
	{id: 3, content: 'Layer 3'},
	{id: 4, content: 'Layer 4'},
	{id: 5, content: 'Layer 5'},
]

type ItemActions = {
	delete: (itemId: any) => void;
}

interface LayerItemProps {
	item: Element;
	itemSelected: number;
	selected: boolean;
	dragHandleProps: object;
	handleUpdateName: (itemId: any, name: string) => void;
	itemActions: ItemActions;
}
const LayerItem: FC<LayerItemProps> = ({handleUpdateName, itemActions, selected, ...props}) => {
	const [editMode, setEditMode] = React.useState(false);
	const [editValue, setEditValue] = React.useState(props.item.name);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);
	const [show, setShow] = useState(false);
    const [position, setPosition] = React.useState({x: 0, y: 0});

	useEffect(() => {
		if(editMode) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 10)
		}
	}, [editMode]);

    const hideMenu = useCallback(() => {
        setShow(false);
    }, [setShow]);

	function handleNameChange(e: any) {
		setEditValue(e.target.value);
		// handleUpdateName(props.item.id, e.target.value);
	}

	useEffect(() => {
		console.log('testing context menu of layers | show, position - ', show, position)
	}, [show, position])

	useEffect(() => {
		const refEl = containerRef?.current;
        if(!refEl) return;

        function handleContextMenu(e: MouseEvent) {
            e.preventDefault();
            const {pageX, pageY} = e;
			setShow(true);
            setPosition({x: pageX, y: pageY});
        }

        refEl.addEventListener('contextmenu', handleContextMenu);
        return () => {
            refEl.removeEventListener('contextmenu', handleContextMenu);
        }
	}, [])

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if(!contextMenuRef.current?.contains(e.target as Node)) {
				hideMenu();
			}
		}

		if(show) {
			addEventListener('mousedown', handleClickOutside);

			return () => {
				removeEventListener('mousedown', handleClickOutside);
			}
		}

	}, [show])

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

	function handleDeleteClick() {
		itemActions.delete(props.item.id);
		hideMenu();
	}

	return (
		<>
			<div ref={containerRef} className={'h-8 w-full p-2 flex items-center relative text-sm gap-2 text-white ' + (selected ? ' bg-gray-600' : '')}>
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
			<Portal id="contextmenuportal">
				{show ? <div ref={contextMenuRef} className='fixed min-w-[100px] bg-gray-800 shadow-lg text-white overflow-hidden rounded' style={{top: position.y, left: position.x}}>
					<div onClick={handleDeleteClick} className='flex items-center select-none cursor-pointer gap-1.5 py-1.5 px-3 hover:bg-gray-900 active:bg-gray-950'>
						<div className='text-base'>
							<MdDelete />
						</div>
						<span className='text-sm'>Delete</span>
					</div>
				</div> : null}
			</Portal>
		</>
	)
}

export interface LayersProps {
	list: Element[];
	onListChange: (newList: Element[]) => void;
	setElements: (elements: any) => void;
	selectedElement?: number;
	disabled?: boolean;
}

const Layers: FC<LayersProps> = ({disabled, setElements, selectedElement, ...props}) => {
	const scrollListRef = useRef<HTMLDivElement>(null);
	function onListChange(newList: Element[]) {
		// setListItem(newList);
		const sortedList = newList.map((i, ind) => ({...i, order: newList.length - 1 - ind}));
		props.onListChange(sortedList);
	}

	const listItem = useMemo(() => {
		const arr = [...props.list]
		arr.sort((a,b) => b.order - a.order);
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

	const itemActions = useMemo(() => {
		return {
			delete: (itemId: any) => {
				setElements((prevElements: any) => {
					const elIndex = prevElements.findIndex((el:Element) => el.id === itemId);
					const newElements = [...prevElements];
					newElements.splice(elIndex, 1);
					return newElements;
				})
			}
		}
	}, [setElements])

	return (
		<div className={'w-[200px] bg-gray-900 rounded py-3 flex flex-col overflow-hidden max-h-[300px]'}>
			<div className={'px-3 pb-2 flex gap-2 items-center text-sm text-gray-200'}>
				<IoLayers />
				<span className={'font-medium text-gray-300'}>Layers</span>
			</div>
			{disabled ? <div className='flex-1 py-1 px-2 text-xs text-gray-500 justify-center items-center flex'>
				<span>No Elements</span>
			</div> : <div className={'overflow-auto flex-1'} ref={scrollListRef}>
				<DraggableList
					container={() => scrollListRef.current}
					onMoveEnd={onListChange}
					itemKey={'id'}
					list={listItem}
					template={(props) => <LayerItem key={props.item.id} itemActions={itemActions} selected={props.item.id === selectedElement} handleUpdateName={handleUpdateName} {...props} />}
				/>
			</div>}
		</div>
	);
};

export default Layers;
