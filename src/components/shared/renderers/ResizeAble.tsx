import React, { FC, useEffect, useRef, useState } from 'react';

interface ResizeAbleProps {
    width?: number;
    onResize?: (width: number, height: number) => void;
    children: React.ReactNode;
    containerClassName?: string;
    handleClassName?: string;
    ContainerProps?: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'className' | 'style'>;
    HandleProps?: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'className' | 'style'>;
}

const MIN_WIDTH = 450;

const ResizeAble: FC<ResizeAbleProps> = (props) => {
	const resizeHandleRef = useRef<HTMLDivElement>(null);
	const resizeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
		if(!resizeHandleRef.current || !resizeContainerRef.current) return;
		const handleRef = resizeHandleRef.current;

		const MAX_WIDTH = window.innerWidth - 400;
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

		const mouseMoveHandler = (e: MouseEvent) => {
			if(isMouseDown && resizeContainerRef.current) {
				let _width = initialData.width + (initialData.x - e.clientX);
				if(_width < MIN_WIDTH) _width = MIN_WIDTH;
				if(_width > MAX_WIDTH) _width = MAX_WIDTH;
				resizeContainerRef.current.style.width = `${_width}px`;
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
	}, []);

    return (
        <div ref={resizeContainerRef} className={'relative w-[450px] ' + (props.containerClassName ?? '')} {...(props.ContainerProps ?? {})}>
            <div ref={resizeHandleRef} className={"absolute left-0 top-0 h-full w-2 bg-white bg-opacity-20 cursor-col-resize hover:w-2.5 transition-all " + (props.handleClassName ?? '')} {...(props.HandleProps ?? {})} />
            {props.children}
        </div>
    )
}

export default ResizeAble;