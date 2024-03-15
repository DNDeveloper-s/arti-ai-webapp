import React, { FC, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import rough from 'roughjs';
import { parseRoughState, wrapText } from './EditCanvas';
import { RoughCanvas } from 'roughjs/bin/canvas';

interface PreviewCanvasProps {
    canvasState: string;
}
const PreviewCanvas: FC<PreviewCanvasProps> = ({canvasState, handleClick}) => {
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const elements = useMemo(() => {
        return JSON.parse(canvasState)
    }, [canvasState]);

    function renderElement(ctx: CanvasRenderingContext2D, roughCanvas: RoughCanvas, element: Element) {
		const {x1, y1, x2, y2, type, id, roughOptions, customOptions} = element;
		const canvasEl = drawCanvasRef.current;

		if(!canvasEl) return;
		if(type === 'text' && ctx && customOptions) {
			ctx.textBaseline = 'top';
			ctx.font = (customOptions.font ?? '24px Arial');
			const lines = wrapText(ctx, customOptions?.text, x1, y1, customOptions?.width ?? 100, +(customOptions?.fontSize ?? 24) + 4);

			lines.forEach(([line, x, y], i) => {
				ctx.fillStyle = customOptions.fillStyle ?? 'rgba(0,0,0,1)';
				ctx.fillText(line, x, y);
			});
		} else if(type === 'image' && customOptions) {
			const img = new Image();
			img.src = customOptions.src;
			ctx?.drawImage(img, x1, y1, x2 - x1, y2 - y1);
		} else {
			const parsedRough = parseRoughState({ x1, y1, x2, y2, type }, roughOptions);
			parsedRough && roughCanvas.draw(parsedRough);
		}

	}

    useLayoutEffect(() => {
		const canvasEl = drawCanvasRef.current;
		if(!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if(!ctx) return;
		canvasEl.width = 398;
		canvasEl.height = 398;

		ctx?.clearRect(0,0,canvasEl.width, canvasEl.height);

		const roughCanvas = rough.canvas(canvasEl);

		// const img = new Image();
		// img.src = "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/657bbdcc93585b232efbbdbb_1702608351110.png"
		// ctx?.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);

		elements?.sort((a: Element, b: Element) => a.order - b.order).forEach((element: Element) => {
			renderElement(ctx, roughCanvas, element);
		});

		const url = canvasEl.toDataURL('image/png');
	}, [elements]);

    return (
        <canvas className="w-full h-full absolute top-0 left-0 bg-transparent z-10" ref={drawCanvasRef}></canvas>
    )
}

export default PreviewCanvas;