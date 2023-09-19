'use client'

import React, {CSSProperties, FC, ReactElement, useState} from 'react';
import Portal from '@/components/Portal';
import {AnimatePresence, motion} from 'framer-motion';

export enum Position {
	LEFT = 'top-0 left-0 h-full -translate-x-full',
	RIGHT = 'top-0 right-0 h-full translate-x-full',
	TOP = 'top-0 left-0 w-full -translate-y-full',
	BOTTOM = 'bottom-0 left-0 w-full translate-y-full'
}

const animateKeys = {
	[Position.LEFT]: {from: {x: '-100%'}, to: {x: 0}},
	[Position.RIGHT]: {from: {x: '100%'}, to: {x: 0}},
	[Position.TOP]: {from: {y: '-100%'}, to: {y: 0}},
	[Position.BOTTOM]: {from: {y: '100%'}, to: {y: 0}},
}

interface DrawerProps {
	position?: Position;
	children?: ReactElement;
	PaperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	BackdropProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
	setOpen: React.Dispatch<boolean>;
	open: boolean;
}

const Drawer: FC<DrawerProps> = ({BackdropProps, open, setOpen, children, PaperProps, position = Position.RIGHT}) => {

	const props: any = {
		BackdropProps: {
			...BackdropProps,
			className: 'z-10 relative w-screen h-screen bg-black bg-opacity-60 transition-all ' + (BackdropProps?.className ?? '')
		},
		PaperProps: {
			...PaperProps,
			className: 'z-20 bg-black absolute min-h-[20rem] min-w-[20rem] transform ' + position + ' ' + (PaperProps?.className ?? ''),
		},
	}

	return (
			<Portal>
				<AnimatePresence mode="wait">
					{open && <motion.div key={1} onClick={() => setOpen(false)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} {...props.BackdropProps} />}
				</AnimatePresence>
				<AnimatePresence mode="wait">
					{open && <motion.div transition={{ease: 'linear', duration: 0.2}} key={2} initial={{opacity: 0, ...animateKeys[position].from}} animate={{opacity: 1, ...animateKeys[position].to}} exit={{opacity: 0, ...animateKeys[position].from}} {...props.PaperProps}>
						{children}
          </motion.div>}
				</AnimatePresence>
			</Portal>
	)
}

export default Drawer;
