'use client'

import React, {CSSProperties, FC, ReactElement, useState} from 'react';
import Portal from '@/components/Portal';
import {AnimatePresence, motion} from 'framer-motion';
import {AttachmentDetails, ModalDispatchAction} from '@/interfaces';

interface ModalProps {
	children?: ReactElement;
	PaperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	BackdropProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
	setOpen: React.Dispatch<ModalDispatchAction<any>>;
	open: ModalDispatchAction<any>;
}

const Modal: FC<ModalProps> = ({BackdropProps, open, setOpen, children, PaperProps}) => {

	const props: any = {
		BackdropProps: {
			...BackdropProps,
			className: 'z-10 relative w-screen h-screen bg-black bg-opacity-60 transition-all ' + (BackdropProps?.className ?? '')
		},
		PaperProps: {
			...PaperProps,
			className: 'z-20 bg-black absolute min-h-[20rem] min-w-[20rem] modal-shadow transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' + (PaperProps?.className ?? ''),
		},
	}

	return (
			<Portal>
				<AnimatePresence mode="wait">
					{open && <motion.div key={1} onClick={() => setOpen(false)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} {...props.BackdropProps} />}
				</AnimatePresence>
				<AnimatePresence mode="wait">
					{open && <motion.div transition={{ease: 'linear', duration: 0.2}} key={2} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} {...props.PaperProps}>
						{children}
          </motion.div>}
				</AnimatePresence>
			</Portal>
	)
}

export default Modal;
