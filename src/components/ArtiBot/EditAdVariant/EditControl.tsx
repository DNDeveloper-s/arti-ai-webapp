import Loader from '@/components/Loader';
import React, { FC, useState } from 'react';
import { RiAiGenerate } from 'react-icons/ri';
import GeneratedSuggestions from './GeneratedSuggestions';
import { updateVariant, useEditVariant } from '@/context/EditVariantContext';

interface EditControlProps {
    controlKey: string;
    containerClassName?: string;
    children: React.ReactNode;
    handleClose?: () => void;
    handleGenerate: (controlKey: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>) => void;
}

{/* <div className="text-[1.1em] leading-[1.6] py-[0.6em] px-[1em] relative group my-2">
    <div className="absolute top-0 left-0 w-full h-full rounded bg-black group-hover:bg-opacity-80 bg-opacity-0 transition-all flex items-center justify-center gap-1 cursor-pointer">
        <div className={"animate-pulse absolute top-0 left-0 w-full h-full border-2 border-dashed border-gray-200 rounded"} />
        <RiAiGenerate className="group-hover:opacity-100 opacity-0 transition-opacity text-[1.6em]" />
        <span className={"group-hover:opacity-100 opacity-0 transition-opacity text-[1.5em]"}>Regenerate Ad Description</span>

        <Loader className={'w-4 h-4'} />
        <span className={"text-[1.5em]"}>Generating Ad Description</span>

        <span className={"text-[1.5em] text-gray-200"}>Choose Suggestions for Preview</span>
    </div>
    <span className={'' + (mock.is ? ' line-clamp-3 text-ellipsis' : ' inline-flex')}>{adVariant.text}</span>
</div> */}

export enum CONTROL_STATE {
    GENERATING = "GENERATING",
    GENERATED = "GENERATED",
    ERROR = "ERROR",
    IDLE = "IDLE"
}

const EditControl: FC<EditControlProps> = (props) => {
    // const [state, setState] = useState<CONTROL_STATE>(CONTROL_STATE.IDLE);
    const [loading, setLoading] = useState(false);
    const {state, dispatch} = useEditVariant();
    const [showSuggestions, setShowSuggestions] = useState(false);


    function handleClick() {
        if(loading) return;
        props.handleGenerate(props.controlKey, setLoading, setShowSuggestions);
    }

    function handleSave(suggestion: string) {
        if(!state.variant) return;
        const newVariant = {...state.variant};
        newVariant.text = suggestion;
        updateVariant(dispatch, newVariant);
    }

    function handleCloseSuggestions() {
        setShowSuggestions(false);
        props.handleClose && props.handleClose();
    }

    return (
        <>
            <div className={'relative ' + (props.containerClassName ?? '')}>
                <div className={"absolute top-0 left-0 w-full h-full rounded bg-black group-hover:bg-opacity-80 bg-opacity-0 transition-all flex items-center justify-center gap-1 cursor-pointer " + (loading ? '!bg-opacity-80' : '')}>
                    <div onClick={handleClick} className={"animate-pulse absolute top-0 left-0 w-full h-full border-2 border-dashed border-gray-200 rounded"} />
                    {!loading ? <>
                        <RiAiGenerate className="group-hover:opacity-100 opacity-0 transition-opacity text-[1.6em]" />
                        <span className={"group-hover:opacity-100 opacity-0 transition-opacity text-[1.5em]"}>Regenerate Ad Description</span>
                    </> : <>
                        <Loader className={'w-4 h-4'} />
                        <span className={"text-[1.5em]"}>Generating Ad Description</span>
                    </>}

                    {/*<span className={"text-[1.5em] text-gray-200"}>Choose Suggestions for Preview</span>*/}
                </div>
                {props.children}
            </div>
            {showSuggestions && <GeneratedSuggestions handleClose={handleCloseSuggestions} handleSave={handleSave} />}
        </>
    )
}

export default EditControl;