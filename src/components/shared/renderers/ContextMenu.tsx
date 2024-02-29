import Portal from '@/components/Portal';
import { useClickAway } from '@/hooks/useClickAway';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import React, { FC, useCallback, useEffect } from 'react';

interface ContextMenuProps {
    ref: React.RefObject<HTMLDivElement>;
    name: string;
}

const ContextMenu: FC<ContextMenuProps> = ({ref, name}) => {
    const [show, setShow] = React.useState(false);
    const [position, setPosition] = React.useState({x: 0, y: 0});

    const hideMenu = useCallback(() => {
        setShow(false);
    }, [setShow]);


    useClickAway(ref, hideMenu);

    useEffect(() => {
        console.log('ref - ', ref, name);
        const refEl = ref?.current;
        if(!refEl) return;

        function handleContextMenu(e: MouseEvent) {
            e.preventDefault();
            console.log('context menu');
            const {pageX, pageY} = e;
            setPosition({x: pageX, y: pageY});
        }

        refEl.addEventListener('mousedown', handleContextMenu);
        refEl.addEventListener('contextmenu', handleContextMenu);
        return () => {
            refEl.removeEventListener('mousedown', handleContextMenu);
            refEl.removeEventListener('contextmenu', handleContextMenu);
        }
    }, [ref?.current, name])


    return (
        <Portal>
            {show ? <div className='absolute bg-gray-800 text-white p-2 rounded' style={{top: position.y, left: position.x}}>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </div> : null}
        </Portal>
    )
}

export default ContextMenu;