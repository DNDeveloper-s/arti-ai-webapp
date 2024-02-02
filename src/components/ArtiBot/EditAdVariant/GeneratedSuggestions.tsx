import { dummySuggestions } from '@/constants/dummy';
import React, { FC } from 'react';

interface GeneratedSuggestionsProps {
    handleSave: (suggestion: string) => void;
    handleClose: () => void;
}

const GeneratedSuggestions: FC<GeneratedSuggestionsProps> = (props) => {
    const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

    function handleSave(index: number, suggestion: string) {
        setSelectedIdx(index);
        props.handleSave(suggestion);
    }

    return (
        <div className="my-[1em] w-full px-3 py-2 border-2 border-gray-600 bg-gray-800 rounded divide-y divide-gray-700">
            <div className="text-[1.5em] leading-[1.55em] mt-1 mb-2 text-white text-opacity-60 font-medium">
                <span>Generated Suggestions:</span>
            </div>
            <div className="flex gap-1 flex-col items-end mt-2 py-3">
                {dummySuggestions.map((suggestion, index) => (
                    <div key={index} onClick={() => handleSave(index, suggestion)} className={"border border-transparent text-[1.32em] leading-[1.45em] px-2 py-1.5 bg-slate-600 rounded cursor-pointer " + (selectedIdx === index ? '!border-primary' : '')}>
                        <span>{suggestion}</span>
                    </div>
                ))}
                {/* {selectedIdx !== null && <div onClick={handleSave}>
                    <button className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Save</button>
                </div>} */}
            </div>
            <div className="w-full pt-3">
                <div className="text-[1.46em] leading-[1.55em] mb-2 text-white text-opacity-60 font-medium">
                    <span>Customize and Regenerate Suggestions:</span>
                </div>
                <div className="w-full flex">
                    <input type="text" className="border border-gray-500 rounded text-xs focus:border-primary focus-visible:outline-none focus:outline-none flex-1 bg-black px-2 py-1 placeholder:text-xs" placeholder="What would you like to generate? (Optional)"/>
                </div>
                <div className="my-3 flex justify-end">
                    <button className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Regenerate</button>
                    <button onClick={props.handleClose} className="text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Close</button>
                </div>
            </div>
        </div>
    )
}

export default GeneratedSuggestions;