'use client';

import React, {FC, useEffect, useRef, useState} from 'react';
import {timeSince, wait} from '@/helpers';

interface TextAreaProps {
	handleSave: (val: string) => Promise<void>;
	className?: string;
	rows?: number;
	placeholder?: string;
	value?: string;
}

enum SAVE_STATE {
	'SAVED' = 'Saved',
	'SAVING' = 'Saving...',
	'WAITING' = ''
}

const TextArea: FC<TextAreaProps> = ({handleSave, value = '', className, placeholder, rows = 3}) => {
	const changeTimeOutRef = useRef<NodeJS.Timeout>();
	const [saveState, setSaveState] = useState<SAVE_STATE>(SAVE_STATE.WAITING)
	const saveTimeStampRef = useRef<number>();
	const prevValueRef = useRef<string>('');
	const [val, setVal] = useState<string>(value);

	useEffect(() => {
		setVal(value);
	}, [value])

	function handleChange(e: any) {
		setVal(e.target.value);
		clearTimeout(changeTimeOutRef.current);
		if(prevValueRef.current.trim() === e.target.value.trim()) {
			setSaveState(SAVE_STATE.SAVED)
			return;
		}
		setSaveState(SAVE_STATE.WAITING)
		// saveTimeStampRef.current = 0;
		changeTimeOutRef.current = setTimeout(() => {
			// Handle the save here
			prevValueRef.current = e.target.value;
			_handleSave();
		}, 1000);
	}

	async function _handleSave() {
		saveTimeStampRef.current = 0;
		setSaveState(SAVE_STATE.SAVING)

		// await wait(2000);
		await handleSave(prevValueRef.current);
		// 1. Saved
		// 2. Saving
		// 3. Waiting

		saveTimeStampRef.current = Date.now();
		setSaveState(SAVE_STATE.SAVED)
	}


	return (
		<div className={"block p-2.5 pb-6 focus:outline-none w-full text-sm text-back bg-secondaryBackground rounded-lg border border-gray-800 focus:border-primary placeholder-gray-500 dark:text-white relative " + (className ?? '')}>
				<textarea
					id="message"
					rows={rows}
					value={val}
					onChange={handleChange}
					className={'w-full h-full outline-none bg-transparent resize-none'}
					placeholder={placeholder ?? 'Write your feedback here...'}
				/>
			<span className="absolute bottom-2 right-3 text-xs text-white text-opacity-20">{saveState} {Boolean(saveTimeStampRef.current) && saveState === SAVE_STATE.SAVED && (timeSince(saveTimeStampRef.current) + ' ago')}</span>
		</div>
	)
}

export default TextArea;
