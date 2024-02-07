import { dummySuggestions } from '@/constants/dummy';
import React, { FC, useRef } from 'react';
import { REGENERATE_SECTION } from './EditAdVariant';
import Image from 'next/image';

interface GeneratedSuggestionsProps {
    handleSave: (suggestion: string) => void;
    handleCustomizeRegeneration: (suggestion?: string | null) => void;
    handleClose: () => void;
    controlKey: REGENERATE_SECTION;
    list: string[] | null;
    type: 'text' | 'image';
}

interface ImageViewerProps {
    list: string[];
    onClick: (selectedIdx: number, item: string) => void;
    selectedIdx: number | null;
}

const ImageViewer: FC<ImageViewerProps> = (props) => {
    return (
        <div className='grid grid-cols-2 gap-3'>
            {props.list.map((item, index) => (
                <div key={item} className={'border border-transparent aspect-square rounded ' + (props.selectedIdx === index ? '!border-primary' : '')} onClick={() => props.onClick(index, item)}>
                    <Image src={item} alt="Ad Variant Image" width={600} height={100} className="mb-[0.5em] w-full" />
                </div>
            ))}
            {[1,2,3,4].slice(props.list.length).map(c => <div key={c} className='aspect-square rounded bg-black'></div>)}
        </div>
    )
}

const GeneratedSuggestions: FC<GeneratedSuggestionsProps> = (props) => {
    const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSave(index: number, suggestion: string) {
        setSelectedIdx(index);
        props.handleSave(suggestion);
    }

    return (
        <div className="my-[1em] w-full px-3 py-2 border-2 border-gray-600 bg-gray-800 rounded divide-y divide-gray-700">
            <div className="text-[1.5em] leading-[1.55em] mt-1 mb-2 text-white text-opacity-60 font-medium">
                <span>Generated Suggestions:</span>
            </div>
            <div className="flex gap-1 flex-col items-start mt-2 py-3">
                {props.list ? (props.type==='image' ? <ImageViewer list={props.list} selectedIdx={selectedIdx} onClick={handleSave} /> : props.list.map((suggestion, index) => (
                    <div key={suggestion} onClick={() => handleSave(index, suggestion)} className={"border w-full border-transparent text-[1.32em] leading-[1.45em] px-2 py-1.5 bg-slate-600 rounded cursor-pointer " + (selectedIdx === index ? '!border-primary' : '')}>
                        <span>{suggestion}</span>
                    </div>
                ))) : (
                    <div className='w-full text-center py-3 px-5'>
                        <span>No suggestions, Please try regenerating the suggestions again.</span>
                    </div>
                )}
                {/* {selectedIdx !== null && <div onClick={handleSave}>
                    <button className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Save</button>
                </div>} */}
            </div>
            <div className="w-full pt-3">
                <div className="text-[1.46em] leading-[1.55em] mb-2 text-white text-opacity-60 font-medium">
                    <span>Customize and Regenerate Suggestions:</span>
                </div>
                <div className="w-full flex">
                    <input ref={inputRef} type="text" className="border border-gray-500 rounded text-xs focus:border-primary focus-visible:outline-none focus:outline-none flex-1 bg-black px-2 py-1 placeholder:text-xs" placeholder="What would you like to generate? (Optional)"/>
                </div>
                <div className="my-3 flex justify-end">
                    <button onClick={() => props.handleCustomizeRegeneration(inputRef.current ? inputRef.current.value : null)} className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Regenerate</button>
                    <button onClick={props.handleClose} className="text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Close</button>
                </div>
            </div>
        </div>
    )
}

export default GeneratedSuggestions;