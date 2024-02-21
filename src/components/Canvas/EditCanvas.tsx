'use client';

import rough from 'roughjs';
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Drawable, Options } from 'roughjs/bin/core';
import { RoughCanvas } from 'roughjs/bin/canvas';
import EditTools, {FontTools, ShapeTools, Tool} from './EditTools';
import Image1 from 'next/image';

const generator = rough.generator({options: {roughness: 0}});

type ElementID = number;

interface Coords {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

interface Element extends Coords {
	id: ElementID;
	type: ElementType
	rough?: Drawable | null;
	position?: Position;
	textOptions?: {
		text: string;
		font: string;
		fontSize: number;
		fontFamily: string;
		fillStyle: string;
		bold: boolean;
		italic: boolean;
	}
}

interface SelectedElement extends Element {
	offsetX?: number;
	offsetY?: number;
}

interface SelectionLineElement extends Coords {
	type: 'line';
	coords: {
		corners: {
			start: Coords;
			end: Coords;
		}
	};
	position?: Position;
}

type Position = 'tl' | 'tm' | 'tr' | 'rm' | 'br' | 'bm' | 'bl' | 'lm' | 'rotate' | 'inside' | 'start' | 'end' | null;

interface SelectionNonLineElement extends Coords {
	type: 'rectangle';
	coords: {
		corners: {
			'tl': Coords;
			'tm': Coords;
			'tr': Coords;
			'rm': Coords;
			'br': Coords;
			'bm': Coords;
			'bl': Coords;
			'lm': Coords;
		};
		container: Coords;
		handle: Coords;
	};
	position?: Position;
}

type SelectionElement = SelectionLineElement | SelectionNonLineElement;

type ElementType =  'selection' | 'line' | 'rectangle' | 'ellipse' | 'circle' | 'text';

function createElement(id: ElementID, elementType: ElementType, x1: number, y1: number, x2: number, y2: number, options?: Options): Element {
	let rough;
	switch(elementType) {
		case 'line':
			rough = generator.line(x1, y1, x2, y2, options);
			break;
		case 'rectangle':
			rough = generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);
			break;
		case 'circle':
			rough = generator.circle(x1, y1, 2 * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), options);
			break;
		case 'ellipse':
			rough = generator.ellipse(x1, y1, 2 * (x2 - x1), 2 * (y2 - y1), options);
			break;
		case 'text':
			return {id, type: elementType, x1, y1, x2, y2};
		default:
			rough = generator.line(x1, y1, x2, y2, options);
			break;
	}
	return {id, type: elementType, x1, y1, x2, y2, rough};
}

const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

function adjustElementCoordinates(element: Pick<Element, 'x1' | 'y1' | 'x2' | 'y2' | 'type'>) {
	const {x1, y1, x2, y2, type} = element;
	switch (type) {
		case 'rectangle':
			const minX = Math.min(x1, x2);
			const maxX = Math.max(x1, x2);
			const minY = Math.min(y1, y2);
			const maxY = Math.max(y1, y2);
			return {x1: minX, x2: maxX, y1: minY, y2: maxY};
		case 'line':
			if(x1 < x2 || (x1 == x2 && y1 < y2)) {
				return {x1, y1, x2, y2};
			}
			return {x1: x2, y1: y2, x2: x1, y2: y1};
		default:
			return {x1, y1, x2, y2};
	}
}

interface Point {
	x: number;
	y: number;
}

interface SelectedRect {
	coords: Coords;
	offsetX?: number;
	offsetY?: number;
	type: ElementType;
}

function orientation(p1: Point, p2: Point, p3: Point) {
	return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);
}

const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
	// First, start by splitting all of our text into words, but splitting it into an array split by spaces
	let words = text.split(' ');
	let line = ''; // This will store the text of the current line
	let testLine = ''; // This will store the text when we add a word, to test if it's too long
	let lineArray = []; // This is an array of lines, which the function will return

	// Lets iterate over each word
	for(var n = 0; n < words.length; n++) {
		// Create a test line, and measure it..
		testLine += `${words[n]} `;
		let metrics = ctx.measureText(testLine);
		let testWidth = metrics.width;
		// If the width of this test line is more than the max width
		if (testWidth > maxWidth && n > 0) {
			// Then the line is finished, push the current line into "lineArray"
			lineArray.push([line, x, y]);
			// Increase the line height, so a new line is started
			y += lineHeight;
			// Update line and test line to use this word as the first word on the next line
			line = `${words[n]} `;
			testLine = `${words[n]} `;
		}
		else {
			// If the test line is still less than the max width, then add the word to the current line
			line += `${words[n]} `;
		}
		// If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
		if(n === words.length - 1) {
			lineArray.push([line, x, y]);
		}
	}
	// Return the line array
	return lineArray;
}

function doLineSegmentsIntersect(segment1: Point[], segment2: Point[]) {
	const [p1, p2] = segment1;
	const [q1, q2] = segment2;

	const orientation1 = orientation(p1, p2, q1);
	const orientation2 = orientation(p1, p2, q2);
	const orientation3 = orientation(q1, q2, p1);
	const orientation4 = orientation(q1, q2, p2);

	if (
		(orientation1 !== 0 && orientation2 !== 0 && ((orientation1 > 0) !== (orientation2 > 0))) &&
		(orientation3 !== 0 && orientation4 !== 0 && ((orientation3 > 0) !== (orientation4 > 0)))
	) {
		return true; // Line segments intersect
	}

	return false; // Line segments do not intersect
}

function lineSegmentIntersectsRectangle(segment: Point[], rectangle: any) {
	const [{x: x1, y: y1}, {x: x2, y: y2}] = segment;
	const [rx, ry, width, height] = rectangle;

	// Check if either endpoint of the line segment is inside the rectangle
	if (
		(x1 >= rx && x1 <= rx + width && y1 >= ry && y1 <= ry + height) ||
		(x2 >= rx && x2 <= rx + width && y2 >= ry && y2 <= ry + height)
	) {
		return true;
	}

	// Check if the line segment intersects any of the rectangle's edges
	if (
		(x1 < rx && x2 > rx && y1 >= ry && y1 <= ry + height) || // Left edge
		(x1 > rx + width && x2 < rx + width && y1 >= ry && y1 <= ry + height) || // Right edge
		(y1 < ry && y2 > ry && x1 >= rx && x1 <= rx + width) || // Top edge
		(y1 > ry + height && y2 < ry + height && x1 >= rx && x1 <= rx + width) // Bottom edge
	) {
		return true;
	}

	// Check if the line segment intersects the rectangle's interior
	if (
		(x1 > rx && x1 < rx + width && ((y1 > ry && y1 < ry + height) || (y2 > ry && y2 < ry + height))) ||
		(x2 > rx && x2 < rx + width && ((y1 > ry && y1 < ry + height) || (y2 > ry && y2 < ry + height)))
	) {
		return true;
	}

	return false;
}

function isElementIntersecting(rect: Coords, element: Element) {
	if(element.type === 'line') {
		return lineSegmentIntersectsRectangle([{x: element.x1, y: element.y1}, {x: element.x2, y: element.y2}], [rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1]);
	} else if(element.type === 'rectangle') {
		return isOverlappingRectangle(rect, {x1: element.x1, y1: element.y1, x2: element.x2, y2: element.y2});
	} else if(element.type === 'text') {
		return isOverlappingRectangle(rect, {x1: element.x1, y1: element.y1, x2: element.x2, y2: element.y2});
	} else if(element.type === 'circle') {
		const _rect = getElementRect(element);
		if(!_rect) return false;
		return isOverlappingRectangle(rect, {x1: _rect.x1, y1: _rect.y1, x2: _rect.x2, y2: _rect.y2});
	} else if(element.type === 'ellipse') {
		const _rect = getElementRect(element);
		if(!_rect) return false;
		return isOverlappingRectangle(rect, {x1: _rect.x1, y1: _rect.y1, x2: _rect.x2, y2: _rect.y2});
	}
}

function isOverlappingRectangle(coords1: Coords, coords2: Coords) {
	const {x1: x1c1, y1: y1c1, x2: x2c1, y2: y2c1} = coords1;
	const {x1: x1c2, y1: y1c2, x2: x2c2, y2: y2c2} = coords2;
	return x1c1 < x2c2 && x2c1 > x1c2 && y1c1 < y2c2 && y2c1 > y1c2;
}

function isWithinRectangle(x: number, y: number, x1: number, y1: number, x2: number, y2: number, name: string) {
	const minX = Math.min(x1, x2);
	const maxX = Math.max(x1, x2);
	const minY = Math.min(y1, y2);
	const maxY = Math.max(y1, y2);
	return x >= minX && x <= maxX && y >= minY && y <= maxY ? name : null;
}

function pointOnLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
	const slope = (y2 - y1) / (x2 - x1);
	const _b = y1 - slope * x1;
	const d = Math.abs((slope * x - y + _b) / Math.sqrt(slope * slope + 1));
	return d <= 5;
}

function isWithinElement(x: number, y: number, element: Pick<Element, 'type' | 'x1' | 'y1' | 'x2' | 'y2'>) {
	let is = false;
	switch (element.type) {
		case "text":
		case "rectangle":
			const {x1, x2, y1, y2} = element;
			const minX = Math.min(x1, x2);
			const maxX = Math.max(x1, x2);
			const minY = Math.min(y1, y2);
			const maxY = Math.max(y1, y2);

			is = x >= minX && x <= maxX && y >= minY && y <= maxY;
			break;
		case 'line':
			const {x1: x1l, y1: y1l, x2: x2l, y2: y2l} = element;
			const slope = (y2l - y1l) / (x2l - x1l);
			const _b = y1l - slope * x1l;
			const d = Math.abs((slope * x - y + _b) / Math.sqrt(slope * slope + 1));
			is = d <= 5;
			break;
		case 'circle':
			const {x1: x1c, y1: y1c, x2: x2c, y2: y2c} = element;
			const dOfCircle = distance(x1c, y1c, x, y);
			const radius = distance(x1c, y1c, x2c, y2c);
			is = dOfCircle <= radius;
			break;
		case 'ellipse':
			const {x1: x1e, y1: y1e, x2: x2e, y2: y2e} = element;
			is = Math.abs(y - y1e) <= Math.abs(y2e - y1e) && Math.abs(x - x1e) <= Math.abs(x2e - x1e)
			break;
		default:
			break;
	}

	return is;
}

function getElementAtPosition(x: number, y: number, elements: Element[]): Element | undefined {
	const arr = elements.reverse().map((element) => ({...element, position: positionWithinElement(x, y, element)}));

	const el = arr.find(c => c.type === 'text');

	return arr.find(c => c.position !== null);
}

function nearPoint(x1: number, y1: number, x2: number, y2: number, name: string) {
	return Math.abs(x1 - x2) <= 5 && Math.abs(y1 - y2) <= 5 ? name : null;
}

function positionWithinElement(x: number, y: number, element: Pick<Element, 'type' | 'x1' | 'y1' | 'x2' | 'y2'>): Position {
	const {type, x1, x2, y1, y2} = element;
	if(type === 'rectangle') {
		const topLeft = nearPoint(x, y, x1, y1, "tl");
		const topRight = nearPoint(x, y, x2, y1, "tr");
		const bottomRight = nearPoint(x, y, x2, y2, "br");
		const bottomLeft = nearPoint(x, y, x1, y2, "bl");
		const inside = isWithinElement(x, y, element) ? 'inside' : null;
		return (topLeft || topRight || bottomRight || bottomLeft || inside) as Position;
	} else if(type === 'text') {
		const topLeft = nearPoint(x, y, x1, y1, "tl");
		const topRight = nearPoint(x, y, x2, y1, "tr");
		const bottomRight = nearPoint(x, y, x2, y2, "br");
		const bottomLeft = nearPoint(x, y, x1, y2, "bl");
		const inside = isWithinElement(x, y, element) ? 'inside' : null;
		return (topLeft || topRight || bottomRight || bottomLeft || inside) as Position;
	} else if(type === 'circle') {
		let coords = getElementRect(element);
		if(!coords) return null;
		const topLeft = nearPoint(x, y, coords.x1, coords.y1, "tl");
		const topRight = nearPoint(x, y, coords.x2, coords.y1, "tr");
		const bottomRight = nearPoint(x, y, coords.x2, coords.y2, "br");
		const bottomLeft = nearPoint(x, y, coords.x1, coords.y2, "bl");
		const inside = isWithinElement(x, y, element) ? 'inside' : null;
		return (topLeft || topRight || bottomRight || bottomLeft || inside) as Position;
	} else if(type === 'ellipse') {
		let coords = getElementRect(element);
		if(!coords) return null;
		const topLeft = nearPoint(x, y, coords.x1, coords.y1, "tl");
		const topRight = nearPoint(x, y, coords.x2, coords.y1, "tr");
		const bottomRight = nearPoint(x, y, coords.x2, coords.y2, "br");
		const bottomLeft = nearPoint(x, y, coords.x1, coords.y2, "bl");
		const inside = isWithinElement(x, y, element) ? 'inside' : null;
		return (topLeft || topRight || bottomRight || bottomLeft || inside) as Position;
	} {
		const startCorner = nearPoint(x, y, x1, y1, "start");
		const endCorner = nearPoint(x, y, x2, y2, "end");
		const inside = isWithinElement(x, y, element) ? 'inside' : null;
		return (startCorner || endCorner || inside) as Position;
	}
}

function positionWithinSelectedRect(x: number, y: number, rectElements: SelectedRect[]) {
	const arr = rectElements.reverse().map((element) => ({...element, position: positionWithinElement(x, y, {...element.coords, type: 'rectangle'})}));

	return arr.find(c => c.position !== null);
}

function positionWithinSelectionElement(x: number, y: number, element: SelectionElement) : Position {
	const {x1, y1, x2, y2} = element;
	if(element.type === 'rectangle') {
		const {tl, tm, tr, rm, br, bm, bl, lm} = element.coords.corners;
		const topLeft = isWithinRectangle(x, y, tl.x1, tl.y1, tl.x2, tl.y2, 'tl');
		const topMiddle = isWithinRectangle(x, y, tm.x1, tm.y1, tm.x2, tm.y2, 'tm');
		const topRight = isWithinRectangle(x, y, tr.x1, tr.y1, tr.x2, tr.y2, 'tr');
		const rightMiddle = isWithinRectangle(x, y, rm.x1, rm.y1, rm.x2, rm.y2, 'rm');
		const bottomRight = isWithinRectangle(x, y, br.x1, br.y1, br.x2, br.y2, 'br');
		const bottomMiddle = isWithinRectangle(x, y, bm.x1, bm.y1, bm.x2, bm.y2, 'bm');
		const bottomLeft = isWithinRectangle(x, y, bl.x1, bl.y1, bl.x2, bl.y2, 'bl');
		const leftMiddle = isWithinRectangle(x, y, lm.x1, lm.y1, lm.x2, lm.y2, 'lm');
		const rotateHandle = isWithinRectangle(x, y, element.coords.handle.x1, element.coords.handle.y1, element.coords.handle.x2, element.coords.handle.y2, 'rotate');
		const inside = isWithinRectangle(x, y, x1, y1, x2, y2, 'inside');
		return (topLeft || topMiddle || topRight || rightMiddle || bottomRight || bottomMiddle || bottomLeft || leftMiddle || rotateHandle || inside) as Position;
	} else {
		const {start, end} = element.coords.corners;
		const startCorner = isWithinRectangle(x, y, start.x1, start.y1, start.x2, start.y2, 'start');
		const endCorner = isWithinRectangle(x, y, end.x1, end.y1, end.x2, end.y2, 'end');
		const inside = pointOnLine(x, y, x1, y1, x2, y2) ? 'inside' : null;
		return (startCorner || endCorner || inside) as Position;
	}
}

function isPoint(element: Element) {
	return element.x1 === element.x2 && element.y1 === element.y2;
}

function resizedCoordinates(x: number, y: number, type: ElementType, position: Position, element: Coords, isSelectionRect?: boolean) {
	const {x1, y1, x2, y2} = element;
	const add = isSelectionRect ? 4 : 0;
	switch (position) {
		case "start":
		case "tl":
			if(type === 'circle') {
				const dx = x - x1;
				const dy = y - y1;
				const newSize = Math.max(x2 - x1 - dx, y2 - y1 - dy);
				return {x1: x2 - newSize, y1: y2 - newSize, x2: x2, y2};
			}
			return {x1: x - add, y1: y - add, x2, y2};
		case "tm":
			return {x1, y1: y - add, x2, y2};
		case "tr":
			if(type === 'circle') {
				const dx = x - x2;
				const dy = y - y1;
				const newSize = Math.max(x2 - x1 + dx, y2 - y1 - dy);
				const obj = {x1, y1: y2 - newSize, x2: x1 + newSize, y2};
				if(isSelectionRect) return obj;
			}
			return {x1, y1: y - add, x2: x + add, y2};
		case "rm":
			return {x1, y1, x2, y2: y};
		case "end":
		case "br":
			if(type === 'circle') {
				const dx = x - x2;
				const dy = y - y2;
				const newSize = Math.max(x2 - x1 + dx, y2 - y1 + dy);
				return {x1, y1, x2: x1 + newSize, y2: y1 + newSize};
			}
			return {x1, y1, x2: x + add, y2: y + add};
		case "bm":
			return {x1, y1, x2, y2: y};
		case "bl":
			if(type === 'circle') {
				const dx = x - x1;
				const dy = y - y2;
				const newSize = Math.max(x2 - x1 - dx, y2 - y1 + dy);
				return {x1: x2 - newSize, y1, x2, y2: y1 + newSize};
			}
			return {x1: x - add, y1, x2, y2: y + add};
		case "lm":
			return {x1: x, y1, x2, y2: y};
		default:
			return {x1, y1, x2, y2};
	}

}

const config = {
	controls: ['selection', 'line', 'rectangle', 'ellipse', 'circle', 'text'],
}

enum Action {
	'DRAW' = 'draw',
	'SELECT' = 'select',
	'NONE' = 'none',
	'MOVE' = 'move',
	'RESIZE' = 'resize',
	'WRITE' = 'write',
}

const getSelectionElementCoords = (type: 'line' | 'rectangle', clientX: number, clientY: number, _x1: number, _y1: number, _x2: number, _y2: number) => {
	const cornerWidth = 8;
	const cBy2 = cornerWidth / 2;

	const x1 = _x1 - 5;
	const y1 = _y1 - 5;
	const x2 = _x2 + 5;
	const y2 = _y2 + 5;

	let corners = {};
	if(type === 'line') {
		corners = {
			'start': {x1, y1, x2: x1 + cornerWidth, y2: y1 + cornerWidth},
			'end': {x1: x2, y1: y2, x2: x2 + cornerWidth, y2: y2 + cornerWidth},
		};
	} else {
		corners = {
			'tl': {x1: x1 - cBy2, y1: y1 - cBy2, x2: x1 - cBy2 + 8, y2: y1 - cBy2 + 8},
			'tm': {x1: (x2 + x1) / 2 - cBy2, y1: y1 - cBy2, x2: (x2 + x1) / 2 - cBy2 + 8, y2: y1 - cBy2 + 8},
			'tr': {x1: x2 - cBy2, y1: y1 - cBy2, x2: x2 - cBy2 + 8, y2: y1 - cBy2 + 8},
			'rm': {x1: x2 - cBy2, y1: (y2 + y1) / 2 - cBy2, x2: x2 - cBy2 + 8, y2: (y2 + y1) / 2 - cBy2 + 8},
			'br': {x1: x2 - cBy2, y1: y2 - cBy2, x2: x2 - cBy2 + 8, y2: y2 - cBy2 + 8},
			'bm': {x1: (x2 + x1) / 2 - cBy2, y1: y2 - cBy2, x2: (x2 + x1) / 2 - cBy2 + 8, y2: y2 - cBy2 + 8},
			'bl': {x1: x1 - cBy2, y1: y2 - cBy2, x2: x1 - cBy2 + 8, y2: y2 - cBy2 + 8},
			'lm': {x1: x1 - cBy2, y1: (y2 + y1) / 2 - cBy2, x2: x1 - cBy2 + 8, y2: (y2 + y1) / 2 - cBy2 + 8},
		}
	}

	const coords = {
		corners,
		container: {x1, y1, x2, y2},
		handle: {x1: (x2 + x1) / 2 - cBy2, y1: y1 - 24, x2: (x2 + x1) / 2 + cBy2, y2: y1 - 24 + 8},
	}

	const selectionEl = {
		type: "rectangle",
		coords,
		x1, y1, x2, y2
	}

	const position = positionWithinSelectionElement(clientX, clientY, selectionEl as SelectionElement);

	return {x1, y1, x2, y2, type, coords, position};
}

const getSelectionElementsToRender = (type: 'line' | 'rectangle', roughCanvas: RoughCanvas, _x1: number, _y1: number, _x2: number, _y2: number) => {
	const cornerWidth = 8;
	const cBy2 = cornerWidth / 2;

	if(type === 'line') {
		// const line = generator.line(x1, y1, x2, y2);
		// roughCanvas.draw(line);
		const x1 = _x1 - cBy2;
		const y1 = _y1 - cBy2;
		const x2 = _x2 - cBy2;
		const y2 = _y2 - cBy2;

		const rectStart = generator.rectangle(x1, y1, cornerWidth, cornerWidth, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectStart);

		const rectEnd = generator.rectangle(x2, y2, cornerWidth, cornerWidth, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectEnd);

	} else {
		const x1 = _x1 - 5;
		const y1 = _y1 - 5;
		const x2 = _x2 + 5;
		const y2 = _y2 + 5;

		const rect = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {strokeWidth: 1, strokeLineDash: [3,5], stroke: 'black', fillWeight: 20});
		roughCanvas.draw(rect);

		const rectTl = generator.rectangle(x1 - cBy2, y1 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectTl);

		const rectTm = generator.rectangle((x2 + x1) / 2 - cBy2, y1 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectTm);

		const rotateHandle = generator.circle((x2 + x1) / 2, y1 - 24, 10, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rotateHandle);

		const rectTr = generator.rectangle(x2 - cBy2, y1 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectTr);

		const rectRm = generator.rectangle(x2 - cBy2, (y2 + y1) / 2 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectRm);

		const rectBl = generator.rectangle(x1 - cBy2, y2 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectBl);

		const rectBm = generator.rectangle((x2 + x1) / 2 - cBy2, y2 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectBm);

		const rectBr = generator.rectangle(x2 - cBy2, y2 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectBr);

		const rectLm = generator.rectangle(x1 - cBy2, (y2 + y1) / 2 - cBy2, 8, 8, {strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', stroke: 'black'});
		roughCanvas.draw(rectLm);
	}
}

function getSelectionRectCoordinates(element: Element) {
	const {x1, y1, x2, y2, type} = element;

	switch(type) {
		case "circle":
			const minX = Math.min(x1, x2);
			const maxX = Math.max(x1, x2);
			const minY = Math.min(y1, y2);
			const maxY = Math.max(y1, y2);
			return {x1: minX, y1: minY, x2: maxX, y2: maxY};
		default:
			return {x1, y1, x2, y2};
	}
}

const useHistory = (initialState: any) => {
	const [index, setIndex] = useState(0);
	const [history, setHistory] = useState<any>([initialState]);

	const setState = (action: any, overwrite = false, updateLastIndex = false) => {
		setHistory((prevHistory: any) => {
			const newState = typeof action === 'function' ? action(prevHistory[index]) : action;
			if(overwrite) {
				const historyCopy = [...prevHistory];
				const ind = updateLastIndex ? prevHistory.length - 1 : index;
				historyCopy[ind] = newState;
				return historyCopy;
			} else {
				const updatedHistory = [...prevHistory].slice(0, index + 1);
				return ([...updatedHistory, newState])
			}
		})
		if(!overwrite) {
			setIndex(prev => prev + 1);
		}
	}

	const undo = useCallback(() => {
		if(index > 0) {
			setIndex(prev => prev - 1);
		}
	}, [index])

	const redo = useCallback(() => {
		if(index < history.length - 1) {
			setIndex(prev => prev + 1);
		}
	}, [history.length, index])

	return [history[index], setState, undo, redo];
}

function useMousePos(ref: any) {
	const [val, setVal] = useState({
		canvasX: 0,
		canvasY: 0
	});

	useEffect(() => {
		if(ref.current) {
			const calc = ref.current.getBoundingClientRect();
			setVal({
				canvasX: calc.left + window.scrollX,
				canvasY: calc.top + window.scrollY
			})
		}
	}, [ref])

	return val;
}

const getElementRect = (element: Pick<Element, 'type' | 'x1' | 'y1' | 'x2' | 'y2'>) => {
	const {x1, y1, x2, y2, type} = element;
	switch(type) {
		case 'text':
		case 'rectangle':
			return {x1: x1 - 4, y1: y1 - 4, x2: x2 + 4, y2: y2 + 4};
		case 'circle':
			const radius = distance(x1, y1, x2, y2);
			return {x1: x1 - radius - 4, y1: y1 - radius - 4, x2: x1 + radius + 4, y2: y1 + radius + 4};
		case 'ellipse':
			const _coords = {
				x1: x1 - (x2 - x1) - 4,
				y1: y1 - (y2 - y1) - 4,
				x2: x2 + 4,
				y2: y2 + 4
			}
			// const radius = distance(x1, y1, x2, y2);
			return {x1: _coords.x1, y1: _coords.y1, x2: _coords.x2, y2: _coords.y2};
		default:
			break;
	}
}

function createElementRect(x: number, y: number, type: ElementType, x1: number, y1: number, x2: number, y2: number) {
	let rect= null;
	switch(type) {
		case 'text':
		case 'rectangle':
		case 'line':
			const coords = {x1: x1 - 4, y1: y1 > y2 ? y1 + 4 : y1 - 4, x2: x2 + 4, y2: y1 > y2 ? y2 - 4 : y2 + 4};
			rect = {coords, type, offsetX: x - coords.x1, offsetY: y - coords.y1};
			break;
		case 'circle':
			const radius = distance(x1, y1, x2, y2);
			rect = {coords: {x1: x1 - radius - 4, y1: y1 - radius - 4, x2: x1 + radius + 4, y2: y1 + radius + 4}, type, offsetX: x - (x1 - radius - 4), offsetY: y - (y1 - radius - 4)};
			break;
		case 'ellipse':
			const _coords = {
				x1: x1 - (x2 - x1) - 4,
				y1: y1 - (y2 - y1) - 4,
				x2: x2 + 4,
				y2: y2 + 4
			}
			// const radius = distance(x1, y1, x2, y2);
			rect = {coords: _coords, type, offsetX: x - _coords.x1, offsetY: y - _coords.y1};
			break;
		default:
			break;
	}
	return rect;
}

function updateElementRect(type: ElementType, x1: number, y1: number, x2: number, y2: number) {
	let rect= null;
	switch(type) {
		case 'text':
		case 'rectangle':
			const coords = {x1: x1 - 4, y1: y1 - 4, x2: x2 + 4, y2: y2 + 4};
			rect = {coords, type, offsetX: 0, offsetY: 0};
			break;
		case 'circle':
			const radius = distance(x1, y1, x2, y2);
			rect = {coords: {x1: x1 - radius - 4, y1: y1 - radius - 4, x2: x1 + radius + 4, y2: y1 + radius + 4}, type, offsetX: 0, offsetY: 0};
			break;
		default:
			break;
	}
	return rect;
}

function getElementCoordinatedWithElementRect(rectCoords: Coords, type: ElementType, element: Element) {
	switch(type) {
		case 'line':
			return {x1: rectCoords.x1 + 4, y1: element.y1 > element.y2 ? rectCoords.y1 - 4 : rectCoords.y1 + 4, x2: rectCoords.x2 - 4, y2: element.y1 > element.y2 ? rectCoords.y2 + 4 : rectCoords.y2 - 4};
		case 'text':
		case 'rectangle':
			return {x1: rectCoords.x1 + 4, y1: rectCoords.y1 + 4, x2: rectCoords.x2 - 4, y2: rectCoords.y2 - 4};
		case 'circle':
			const radius = distance(rectCoords.x1 + 4, rectCoords.y1 + 4, rectCoords.x2 - 4, rectCoords.y1 + 4) / 2;
			return {x1: rectCoords.x1 + radius + 4, y1: rectCoords.y1 + radius + 4, x2: rectCoords.x2 - 4, y2: ((rectCoords.y2 - 4) + (rectCoords.y1 - 4)) / 2};
		case 'ellipse':
			// const width = element.x2 - element.x1;
			// const height = element.y2 - element.y1;
			return {
				x1: ((rectCoords.x2 + 4) + (rectCoords.x1 - 4)) / 2,
				y1: ((rectCoords.y2 + 4) + (rectCoords.y1 - 4)) / 2,
				x2: rectCoords.x2 - 4,
				y2: rectCoords.y2 - 4
			};
		default:
			return element;
	}
}


export default function EditCanvas({imageUrl, handleExport}: {imageUrl: string | null, handleExport: (url: string) => void}) {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const drawCanvasRef = useRef<HTMLCanvasElement>(null);

	const [elements, setElements, undo, redo] = useHistory([]);
	const [action, setAction] = useState<Action>(Action.NONE);
	const [elementType, setElementType] = useState<ElementType>('line');
	const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
	const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const {canvasX, canvasY} = useMousePos(drawCanvasRef);
	const {canvasX: canvasX1, canvasY: canvasY1} = useMousePos(canvasRef);
	const [selectionElements, setSelectionElements] = useState<Element[]>([]);
	const [elementRects, setElementRects] = useState<SelectedRect[]>([]);

	// const [selectionCanvasElement, setSelectionCanvasElement] = useState<SelectionElement | null>(null);

	const updateElement = useCallback((id: number | string, x1: number, y1: number, x2: number, y2: number, type: ElementType, options?: any | Options, cb?: (element: Element) => void, updateLastIndex?: boolean)=> {
		setElements((elements: any) => {
			const newElements = [...elements];
			const index = newElements.findIndex(c => c.id === id);
			if(type === 'text') {
				const ctx = drawCanvasRef.current?.getContext('2d');
				if(!ctx) return;
				ctx.textBaseline = 'top';
				ctx.font = options.font ?? '24px Arial';
				const textMetrics = ctx.measureText(options?.text);

				const fontSize = options.fontSize ?? 24;
				const fontFamily = options.fontFamily ?? 'Arial';
				let textWidth = options.width ?? 100;

				const lines = wrapText(ctx, options.text, x1, y1, textWidth, +fontSize + 4);
				if(lines.length === 1) {
					textWidth = textMetrics.width;
				}

				const createdElement = createElement(id, type, x1, y1, x1 + (textWidth ?? 0), lines[lines.length - 1][2] + +fontSize);
				newElements[index] = {
					...(createdElement),
					textOptions: {
						text: options.text,
						font: options.font,
						fillStyle: options.fillStyle ?? newElements[index].textOptions?.fillStyle ?? 'black',
						fontSize,
						width: options.width ?? 100,
						fontFamily,
						bold: options.bold ?? false,
						italic: options.italic ?? false,
					}
				}
			} else {
				newElements[index] = createElement(id, type, x1, y1, x2, y2, Object.keys((options ?? {})).includes('text') || !options ? newElements[index].rough.options : {...newElements[index].rough.options, ...(options ?? {})});
			}
			cb && cb(newElements[index]);
			return newElements;
		}, true, updateLastIndex);
	}, [setElements]);

	useEffect(() => {
		const textArea = textAreaRef.current;
		if(action === Action.WRITE && textArea) {
			setTimeout(() => {
				if(textAreaRef.current) {
					textAreaRef.current.focus()
					textAreaRef.current.value = selectedElement?.textOptions?.text ?? '';
				}
			}, 10)
		}
	}, [action, selectedElement]);

	function handleMouseDown(e: any) {
		const clientX = e.pageX - canvasX;
		const clientY = e.pageY - canvasY;

		const clientX1 = e.pageX - canvasX1;
		const clientY1 = e.pageY - canvasY1;
		if(action === Action.WRITE) return;

		if(elementType === 'selection') {
			const selectionElement = getElementAtPosition(clientX, clientY, selectionElements);
			const element = getElementAtPosition(clientX, clientY, elements);
			const targetRectElement = positionWithinSelectedRect(clientX, clientY, elementRects);
			if(selectionElement) {
				setAction(Action.MOVE);
				setSelectionElements(selectionElements => [{...selectionElement, offsetX: clientX1 - selectionElement.x1, offsetY: clientY1 - selectionElement.y1}]);
				setSelectedElements(prevElements => prevElements.map(el => {
					const element = elements.find(c => c.id === el.id);
					return {...element, offsetX: clientX1 - element.x1, offsetY: clientY1 - element.y1}
				}))
				setElementRects(prevRects => prevRects.map(({coords, type}) => {
					return {coords, type, offsetX: clientX1 - coords.x1, offsetY: clientY1 - coords.y1}
				}))
			} else if(element) {
				// if(targetRectElement?.position) {

				// setElementRects([{type: element.type, coords: {x1: element.x1 - 4, y1: element.y1 - 4, x2: element.x2 + 4, y2: element.y2 + 4}, offsetX: clientX1 - element.x1 + 4, offsetY: clientY1 - element.y1 + 4}]);
				// }
				targetRectElement?.position ? setAction(targetRectElement?.position === 'inside' ? Action.MOVE : Action.RESIZE) : setAction(Action.MOVE);
				setElements((prevState: any) => prevState);
				setSelectedElement({...element, offsetX: clientX1 - element.x1, offsetY: clientY1 - element.y1});
				const rect = createElementRect(clientX, clientY, element.type, element.x1, element.y1, element.x2, element.y2);
				if(rect) setElementRects([rect]);
			} else {
				setSelectionElements([]);
				setSelectedElement(null);
				setElementRects([]);
				setAction(Action.SELECT);
				const id = selectionElements.length;
				const element = createElement(id, elementType, clientX, clientY, clientX, clientY);
				setSelectionElements((prev) => [...prev, element]);
			}
			// if(selectionCanvasElement) {
			// const el = getSelectionElementCoords(selectionCanvasElement.type !== 'line' ? 'rectangle' : 'line', clientX, clientY, selectionCanvasElement.x1, selectionCanvasElement.y1, selectionCanvasElement.x2, selectionCanvasElement.y2);
			// setSelectionCanvasElement(el as SelectionElement);
			// setAction(el.position === 'inside' ? Action.MOVE : Action.RESIZE);
			// }
		} else if(elementType === 'text') {
			setAction(Action.WRITE);
			const id = elements.length;
			const element = createElement(id, elementType, clientX, clientY, clientX, clientY);
			setElements((prev) => [...prev, element]);
			setSelectedElement(element);
		} else {
			setAction(Action.DRAW);
			const id = elements.length;
			const element = createElement(id, elementType, clientX, clientY, clientX, clientY);
			setElements((prev) => [...prev, element]);
			setSelectedElement(element);
		}
	}

	function handleMouseUp(e: any) {
		const clientX = e.pageX - canvasX;
		const clientY = e.pageY - canvasY;
		if(selectedElement) {
			if(
				selectedElement.type === 'text' &&
				e.detail === 2
			) {
				setAction(Action.WRITE);
				return;
			}
		}
		if((action === Action.DRAW || action === Action.RESIZE) && selectedElement) {
			const element = elements.find(c => c.id === selectedElement.id);
			if(!element) return;
			if(isPoint(element)) {
				setElements(elements.filter(c => c.id !== element.id));
			} else {
				const {x1, y1, x2, y2} = adjustElementCoordinates(element);
				updateElement(element.id, x1, y1, x2, y2, element.type, {...(element.textOptions ?? {}), text: element.textOptions?.text, font: element.textOptions?.font});
			}
		}
		if(action === Action.WRITE) {
			// return;
		}
		// setSelectedElements([]);
		// setSelectionElements([]);
		// if(action === Action.RESIZE && selectionCanvasElement) {
		// setSelectionCanvasElement({...selectionCanvasElement, position: null});
		// }
		setAction(Action.NONE);
		// setSelectedElement(null);
	}

	function handleMouseMove(e: any) {
		const clientX = e.pageX - canvasX;
		const clientY = e.pageY - canvasY;

		if(elementType === 'selection') {
			const selectionElement = getElementAtPosition(clientX, clientY, selectionElements);
			if(selectionElement) {
				document.body.style.cursor = 'move';
			} else {
				const element = positionWithinSelectedRect(clientX, clientY, elementRects);
				switch(element?.position) {
					case "br":
					case "tl":
					case "start":
					case "end":
						document.body.style.cursor = 'nwse-resize';
						break;
					case "bm":
					case "tm":
						document.body.style.cursor = 'ns-resize';
						break;
					case "bl":
					case "tr":
						document.body.style.cursor = 'nesw-resize';
						break;
					case "lm":
					case "rm":
						document.body.style.cursor = 'ew-resize';
						break;
					case "inside":
						document.body.style.cursor = 'move';
						break;
					case "rotate":
						document.body.style.cursor = 'grab';
						break;
					default:
						document.body.style.cursor = 'default';
						break;
				}
			}

			// setSelectedElement({...element, offsetX: clientX - element.x1, offsetY: clientY - element.y1});
		} else {
			document.body.style.cursor = 'default';
		}
		const selectionElementSelected = selectionElements[selectionElements.length - 1] ? isWithinElement(clientX, clientY, selectionElements[selectionElements.length - 1]) : false;
		if(action === Action.DRAW && selectedElement) {
			updateElement(selectedElement.id, selectedElement.x1, selectedElement.y1, clientX, clientY, elementType);
		} else if(action === Action.MOVE) {
			// const element = selectedElement as SelectedElement;
			// const {offsetX, offsetY} = element;
			// const x1 = clientX - (offsetX ?? 0);
			// const y1 = clientY - (offsetY ?? 0);
			// const x2 = x1 + (element.x2 - element.x1);
			// const y2 = y1 + (element.y2 - element.y1);

			if(elementRects && elementRects.length > 0) {
				const newRects = [...elementRects].map(({coords: element, offsetX, offsetY, type}) => {
					const x1 = clientX - (offsetX ?? 0);
					const y1 = clientY - (offsetY ?? 0);
					const x2 = x1 + (element.x2 - element.x1);
					const y2 = y1 + (element.y2 - element.y1);
					return {coords: {x1, y1, x2, y2}, type, offsetX, offsetY};
				}).filter(c => c !== null);
				setElementRects(newRects);
			}

			if(selectionElementSelected) {
				const element = selectionElements[selectionElements.length - 1] as SelectedElement;
				if(element) {
					const {offsetX, offsetY} = element;
					const x1 = clientX - (offsetX ?? 0);
					const y1 = clientY - (offsetY ?? 0);
					const x2 = x1 + (element.x2 - element.x1);
					const y2 = y1 + (element.y2 - element.y1);
					const newElements = [element];
					newElements[newElements.length - 1] = {...element, ...(createElement(element.id, 'rectangle', x1, y1, x2, y2, {strokeLineDash: [3,5]}))};
					setSelectionElements(newElements);
				}


				for(let i = 0; i < selectedElements.length; i++) {
					const element = selectedElements[i];
					const {offsetX, offsetY} = element;
					const x1 = clientX - (offsetX ?? 0);
					const y1 = clientY - (offsetY ?? 0);
					const x2 = x1 + (element.x2 - element.x1);
					const y2 = y1 + (element.y2 - element.y1);
					updateElement(element.id, x1, y1, x2, y2, element.type, {...(element.textOptions ?? {}),text: element.textOptions?.text, font: element.textOptions?.font});
				}
			} else if(selectedElement) {
				const element = selectedElement;
				const {offsetX, offsetY} = element;
				const x1 = clientX - (offsetX ?? 0);
				const y1 = clientY - (offsetY ?? 0);
				const x2 = x1 + (element.x2 - element.x1);
				const y2 = y1 + (element.y2 - element.y1);
				updateElement(element.id, x1, y1, x2, y2, element.type, {...(element.textOptions ?? {}), text: element.textOptions?.text, font: element.textOptions?.font});
			}
			// selectedElements.forEach(element => {
			// 	// const element = selectedElement as SelectedElement;
			// 	const {offsetX, offsetY} = element;
			// 	const x1 = clientX - (offsetX ?? 0);
			// 	const y1 = clientY - (offsetY ?? 0);
			// 	const x2 = x1 + (element.x2 - element.x1);
			// 	const y2 = y1 + (element.y2 - element.y1);
			// 	updateElement(element.id, x1, y1, x2, y2, element.type, {text: element.textOptions?.text, font: element.textOptions?.font});
			// })
			// const el = getSelectionElementCoords(element.type !== 'line' ? 'rectangle' : 'line', clientX, clientY, x1, y1, x2, y2);
			// setSelectionCanvasElement(el as SelectionElement);
		} else if(action === Action.RESIZE && selectedElement) {
			const {id, type, position, textOptions, ...coordinates} = selectedElement;
			if(position) {
				// const {x1, y1, x2, y2} = resizedCoordinates(clientX, clientY, type, position, coordinates);
				// updateElement(id, x1, y1, x2, y2, type, {...textOptions, width: x2 - x1});

				if(elementRects.length === 1) {
					let newRects = [...elementRects];
					const {x1, y1, x2, y2} = resizedCoordinates(clientX, clientY, type, position, newRects[0].coords, true);
					const rect = getElementCoordinatedWithElementRect({x1, y1, x2, y2}, type, selectedElement);
					updateElement(id, rect.x1, rect.y1, rect.x2, rect.y2, type, {...textOptions, width: rect.x2 - rect.x1});
					newRects[0] = {
						...newRects,
						type,
						coords: {x1, y1, x2, y2},
					}
					setElementRects(newRects);
				}
			}
		} else if(action === Action.SELECT) {
			const newElements = [...selectionElements];
			const element = newElements.at(-1);
			if(!element) return;
			// const {x1, y1, x2, y2} = adjustElementCoordinates({x1: element.x1, y1: element.y1, x2: clientX1, y2: clientY1, type: 'rectangle'});
			newElements[newElements.length - 1] = createElement(element.id, 'rectangle', element.x1, element.y1, clientX, clientY, {strokeLineDash: [3,5]});

			const {x1, y1, x2, y2} = adjustElementCoordinates({x1: element.x1, y1: element.y1, x2: clientX, y2: clientY, type: 'rectangle'});
			const intersectedElements = elements.filter((_element: any) => isElementIntersecting({x1, y1, x2, y2}, _element));

			const rects = intersectedElements.filter(({x1, x2, y1, y2}) => x1 !== x2 || y1 !== y2).map(selectedElement => {
				const {x1, y1, x2, y2} = selectedElement;
				return createElementRect(clientX, clientY, selectedElement.type, x1, y1, x2, y2);
				// return {
				// 	coords: {x1: x1 - 4, y1: y1 - 4, x2: x2 + 4, y2: y2 + 4},
				// 	type: selectedElement.type
				// }
			})
			setElementRects(rects);

			setSelectedElements(intersectedElements);
			setSelectionElements(newElements);
		}
	}

	useEffect(() => {

		function handleKeyDown(e: any) {
			if(e.ctrlKey && e.key === 'z') {
				undo();
				setElementRects([]);
			}
			if(e.ctrlKey && e.key === 'y') {
				redo();
				setElementRects([]);
			}
		}

		addEventListener('keydown', handleKeyDown);
		return () => removeEventListener('keydown', handleKeyDown);
	}, [redo, undo]);

	useLayoutEffect(() => {
		const canvasEl = canvasRef.current;
		if(!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		canvasEl.width = canvasRef.current.clientWidth;
		canvasEl.height = canvasRef.current.clientHeight;

		ctx?.clearRect(0,0,canvasEl.width, canvasEl.height);

		const roughCanvas = rough.canvas(canvasEl);

		selectionElements.forEach(({type, x1, y1, rough, id}) => {
			rough && roughCanvas.draw(rough);
		});

		if(elementRects.length > 0) {
			elementRects.forEach((elementRect) => {
				const {coords: {x1, y1, x2, y2}} = elementRect;
				roughCanvas.rectangle(x1, y1, x2 - x1, y2 - y1, {strokeLineDash: [3, 5], roughness: 0});
			})
		}
	}, [selectionElements, elementRects]);

	useLayoutEffect(() => {
		const canvasEl = drawCanvasRef.current;
		if(!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		canvasEl.width = drawCanvasRef.current.clientWidth;
		canvasEl.height = drawCanvasRef.current.clientHeight;

		ctx?.clearRect(0,0,canvasEl.width, canvasEl.height);

		const roughCanvas = rough.canvas(canvasEl);

		// const img = new Image();
		// img.src = "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/657bbdcc93585b232efbbdbb_1702608351110.png"
		// ctx?.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);

		elements?.sort((a: Element, b: Element) => a.id - b.id).forEach(({textOptions, type, x1, y1, rough, id}) => {
			if(action === Action.WRITE && selectedElement?.id === id) return;
			if(type === 'text' && ctx && textOptions) {
				ctx.textBaseline = 'top';
				ctx.font = (textOptions.font ?? '24px Arial');
				const lines = wrapText(ctx, textOptions.text, x1, y1, textOptions.width ?? 100, +(textOptions.fontSize ?? 24) + 4);

				lines.forEach(([line, x, y], i) => {
					ctx.fillStyle = textOptions.fillStyle ?? 'black';
					ctx.fillText(line, x, y);
				});

				// ctx.textBaseline = 'top';
				// ctx.font = textOptions.font ?? '24px sans-serif';
				// ctx.fillStyle = textOptions.fillStyle ?? 'black';
				// ctx.fillText(textOptions.text, x1, y1);
			} else {
				rough && roughCanvas.draw(rough);
			}
		});
	}, [elements, selectedElement, action]);

	// useEffect(() => {
	// 	if(!selectedElements) return setElementRects([]);
	// 	const _elementRects = selectedElements.filter(({x1, x2, y1, y2}) => x1 !== x2 || y1 !== y2).map(selectedElement => {
	// 		const {x1, y1, x2, y2} = selectedElement;
	// 		return {
	// 			coords: {x1: x1 - 4, y1: y1 - 4, x2: x2 + 4, y2: y2 + 4}
	// 		}
	// 	})
	// 	setElementRects(_elementRects);
	// }, [selectedElement, selectedElements]);

	function handleBlur(e: any) {
		selectedElement && updateElement(selectedElement.id, selectedElement.x1, selectedElement.y1, selectedElement.x2, selectedElement.y2, 'text', {...selectedElement.textOptions, text: e.target.value});
		setSelectedElement(null);
		setAction(Action.NONE);
	}

	function handleToolChange(tool: Tool) {
		if(config.controls.includes(tool.id)) {
			setElementType(tool.id as ElementType);
		}
	}

	function handleFormatChange(props: any, completed: boolean) {
		console.log('formatChange - ', completed);
		if(completed) {
			setElements((prevState: any) => prevState);
		}
		if(selectedElement) {
			const element = elements.find(c => c.id === selectedElement.id);
			if(props.color) {
				let options = {fill: props.color, fillStyle: 'solid'};
				if(props.type === 'stroke') {
					options = {stroke: props.color}
				}
				if(element.type === 'text') {
					options = {...(element.textOptions ?? {}), text: element.textOptions.text, font: element.textOptions.font, fillStyle: props.color};
				}
				element && updateElement(element.id, element.x1, element.y1, element.x2, element.y2, element.type, options, () => {}, true);
			} else if(props.fontSize || props.fontFamily) {
				if(element?.type === 'text') {
					const options = {width: element.textOptions.width, italic: props.italic, bold: props.bold, text: element.textOptions.text, fontSize: props.fontSize, fontFamily: props.fontFamily, font: `${props.italic ? 'italic ' : ''}${props.bold ? 'bold ' : ''}${props.fontSize}px ${props.fontFamily}`, fillStyle: element.textOptions.fillStyle};
					element && updateElement(element.id, element.x1, element.y1, element.x2, props.fontSize, element.type, options, (element) => {
						const rect = createElementRect(0, 0, element.type, element.x1, element.y1, element.x2, element.y2);
						if(rect) setElementRects([rect]);
					}, true);
				}
			}
		}
	}

	function exportCanvas() {
		const canvasEl = drawCanvasRef.current;
		if(!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		canvasEl.width = drawCanvasRef.current.clientWidth;
		canvasEl.height = drawCanvasRef.current.clientHeight;
		canvasEl.style.backgroundColor = 'transparent';

		ctx?.clearRect(0,0,canvasEl.width, canvasEl.height);

		const roughCanvas = rough.canvas(canvasEl);

		if(imageUrl) {
			const img = new Image();
			img.src = imageUrl;
			img.setAttribute('crossorigin', 'anonymous');

			img.onload = () => {
				ctx?.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);

				elements?.sort((a: Element, b: Element) => a.id - b.id).forEach(({textOptions, type, x1, y1, rough, id}) => {
					if(action === Action.WRITE && selectedElement?.id === id) return;
					if(type === 'text' && ctx && textOptions) {
						ctx.textBaseline = 'top';
						ctx.font = (textOptions.font ?? '24px Arial');
						const lines = wrapText(ctx, textOptions.text, x1, y1, textOptions.width ?? 100, +(textOptions.fontSize ?? 24) + 4);

						lines.forEach(([line, x, y], i) => {
							ctx.fillStyle = textOptions.fillStyle ?? 'black';
							ctx.fillText(line, x, y);
						});

						// ctx.textBaseline = 'top';
						// ctx.font = textOptions.font ?? '24px sans-serif';
						// ctx.fillStyle = textOptions.fillStyle ?? 'black';
						// ctx.fillText(textOptions.text, x1, y1);
					} else {
						rough && roughCanvas.draw(rough);
					}
				});

				const url = canvasEl.toDataURL('image/png', 1);

				handleExport(url);
			}

			return;
		}
	}

	return (
		<>
			<div className="w-full aspect-square relative">
				{/* <div className='absolute top-0 left-1/2 z-20'>
					<select onChange={e => setElementType(e.target.value as ElementType)} name="" id="">
						{config.controls.map((control) => (
							<option selected={control === elementType} className='capitalize' key={control} value={control}>{control}</option>
						))}
					</select>
					<button onClick={undo} className='mx-2'>Undo</button>
					<button onClick={redo}>Redo</button>
				</div> */}
				{action === Action.WRITE && selectedElement && <textarea spellCheck={false} ref={textAreaRef}
                                                                 style={{
					                                                         position: 'absolute',
					                                                         top: selectedElement.y1 - 9,
					                                                         left: selectedElement.x1 - 3,
					                                                         padding: '4px 7px 4px 3px',
					                                                         zIndex: 30,
					                                                         fontSize: `${(selectedElement.textOptions?.fontSize ?? 24)}px`,
					                                                         lineHeight: `${+(selectedElement.textOptions?.fontSize ?? 24) + 4}px`,
					                                                         border: 'none',
					                                                         fontWeight: `${selectedElement.textOptions?.bold ? 'bold' : 'normal'}`,
					                                                         fontStyle: `${selectedElement.textOptions?.italic ? 'italic' : 'normal'}`,
					                                                         // width: elementRects[0].coords.x2 - elementRects[0].coords.x1,
					                                                         // height: elementRects[0].coords.y2 - elementRects[0].coords.y1,
					                                                         width: elementRects[0] ? elementRects[0].coords.x2 - elementRects[0].coords.x1 : 100,
					                                                         height: elementRects[0] ? elementRects[0].coords.y2 - elementRects[0].coords.y1 : 50,
					                                                         resize: 'none',
					                                                         background: 'transparent',
					                                                         outline: 'none',
					                                                         fontFamily: `${selectedElement.textOptions?.fontFamily ?? 'Arial'}`,
					                                                         color: `${selectedElement.textOptions?.fillStyle ?? 'black'}`,
				                                                         }}
                                                                 onBlur={handleBlur}
        ></textarea>}
				{action !== Action.WRITE && selectedElement && elementRects.length === 1 && <div className={'text-black text-base'} style={{
					height: '35px',
					borderRadius: 4,
					position: 'fixed',
					zIndex: 50,
					top: canvasY + elementRects[0].coords.y1 - 40,
					left: canvasX + elementRects[0].coords.x2,
					transform: 'translateX(-100%)'
				}}>
					{selectedElement.type === 'text' && <FontTools initialFontDetails={selectedElement?.textOptions ? selectedElement?.textOptions : undefined}
                                                         handleFormatChange={handleFormatChange}/>}
					{selectedElement.type !== 'text' && <ShapeTools initialShapeDetails={selectedElement?.rough?.options} handleFormatChange={handleFormatChange} />}
        </div>}
				<canvas
					// onMouseDown={handleMouseDown}
					// onMouseUp={handleMouseUp}
					// onMouseMove={handleMouseMove}
					className="w-full h-full absolute top-0 left-0 bg-transparent z-10" ref={drawCanvasRef}
				></canvas>
				<canvas
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onMouseMove={handleMouseMove}
					className="w-full h-full absolute top-0 left-0 bg-transparent z-20" ref={canvasRef}
				></canvas>
				{imageUrl && <div className="relative w-full h-full pointer-events-none">
          <Image1 src={imageUrl} alt="Image" className='w-full h-full' width={500} height={500} />
        </div>}
			</div>
			<div className='absolute left-[calc(100%+10px)] top-1/2 transform -translate-y-1/2 z-20'>
				<EditTools handleFormatChange={handleFormatChange} handleChange={handleToolChange} />
			</div>
			<div className='flex justify-end px-4 items-center gap-3 mt-3' onClick={() => {}}>
				<button onClick={exportCanvas} className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Save</button>
				<button onClick={() => {}} className='text-xs'>Cancel</button>
			</div>
		</>
	)
}

