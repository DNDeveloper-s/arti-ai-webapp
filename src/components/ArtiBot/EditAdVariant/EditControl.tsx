import Loader from '@/components/Loader';
import React, { FC, useEffect, useState } from 'react';
import { RiAiGenerate, RiEditFill, RiRefreshLine } from 'react-icons/ri';
import GeneratedSuggestions from './GeneratedSuggestions';
import { regenerateVariantData, updateVariant, useEditVariant } from '@/context/EditVariantContext';
import { FaUpload } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { REGENERATE_SECTION } from './EditAdVariant';

interface EditControlBaseProps {
    controlKey: REGENERATE_SECTION;
    containerClassName?: string;
    handleClose?: () => void;
    type: 'text' | 'image';
    handleEdit: (cs: CONTROL_STATE, controlKey: REGENERATE_SECTION) => void;
}

interface EditControlWithoutInputEditableProps extends EditControlBaseProps {
    inputEditable?: never;
    content?: never;
    children: React.ReactNode;
}

interface EditControlWithInputEditableProps extends EditControlBaseProps {
    inputEditable: true;
    content: string;
    children?: never;
    rows?: number;
}

type EditControlProps = EditControlWithoutInputEditableProps | EditControlWithInputEditableProps;

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
    EDIT = 'EDIT',
    GENERATE = 'GENERATE',
    IDLE = 'IDLE'
}

const EditControl: FC<EditControlProps> = (props) => {
    // const [state, setState] = useState<CONTROL_STATE>(CONTROL_STATE.IDLE);
    const [loading, setLoading] = useState(false);
    const {state, dispatch} = useEditVariant();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [controlState, setControlState] = useState<CONTROL_STATE>(CONTROL_STATE.IDLE);
    const [formValue, setFormValue] = useState<string>(props.content ?? '');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState(null);

    const onChange = (value: string) => {
        setFormValue(value);
    }

    async function handleClick(cs: CONTROL_STATE, extraInput?: string | null) {
        if(!state.variant?.id) return;
        if(loading) return;
        props.handleEdit(cs, props.controlKey);
        if(cs === CONTROL_STATE.EDIT) return setControlState(cs);


        setLoading(true);
        setShowSuggestions(false);
        setSuggestions(null);

        // if(props.controlKey === REGENERATE_SECTION.IMAGE) {
        //     setShowSuggestions(true);
        //     setLoading(false);
        //     return setSuggestions(["https://srs-billing-storage.s3.ap-south-1.amazonaws.com/657bbdcc93585b232efbbdbb_1707307041338.png"]);
        // }

        const _suggestions = await regenerateVariantData(dispatch, state.variant?.id, props.controlKey, extraInput);

        if(props.type === 'image') {
            const newVariant = {...state.variant};

            if(!newVariant.imageMap) {
                newVariant.imageMap = {
                    main: newVariant.imageUrl,
                    versionInfo: {
                        totalVersions: 0,
                        list: []
                    },
                    versions: {},
                    generatedImages: []
                };
            }

            newVariant.imageMap.generatedImages = [...(newVariant.imageMap.generatedImages ?? []), {url: _suggestions, timestamp: new Date().toISOString()}];
            return updateVariant(dispatch, newVariant);
        }

        setLoading(false);
        setSuggestions((c: any) => {
            let a = c;
            if(!(a instanceof Array)) a = [];
            if(_suggestions instanceof Array) return _suggestions;
            a.push(_suggestions)
            return a;
        });
        setShowSuggestions(true);
    }

    function handleSave(suggestion: string) {
        if(!state.variant) return;
        if(props.type !== 'image') {
            const newVariant = {...state.variant};
            newVariant[props.controlKey] = suggestion;
            return updateVariant(dispatch, newVariant);
        }
        const newVariant = {...state.variant};

		if(!newVariant.imageMap) {
			newVariant.imageMap = {
				main: newVariant.imageUrl,
				versionInfo: {
					totalVersions: 0,
					list: []
				},
				versions: {},
				generatedImages: []
			};
		}

		// const versions = {
		// 	...(newVariant.imageMap.versions ?? {}),
		// 	[`v${(newVariant.imageMap.versionInfo.totalVersions ?? 1)}`]: newVariant.imageMap.versions.latest,
		// 	latest: {
		// 		image: url,
		// 		timestamp: new Date().toISOString()
		// 	}
		// }
		// const versionInfo = {
		// 	totalVersions: (newVariant.imageMap.versionInfo.totalVersions ?? 0) + 1,
		// 	list: Object.keys(versions)
		// }

        newVariant.imageUrl = suggestion;
		newVariant.imageMap.main = suggestion;
        return updateVariant(dispatch, newVariant);
    }

    function handleCloseSuggestions() {
        setShowSuggestions(false);
        props.handleClose && props.handleClose();
    }

    function handleSaveEdit() {
        handleSave(formValue);
        setControlState(CONTROL_STATE.IDLE);
        props.handleClose && props.handleClose();
    }

    function handleCloseEdit() {
        setControlState(CONTROL_STATE.IDLE);
        props.handleClose && props.handleClose();
    }

    function handleChangeImage(e: any) {
        const image = e.target.files[0];
        if(image) {
            const imageUrl = URL.createObjectURL(image);
            setImageUrl(imageUrl);
        }
    }

    async function handleCustomizeRegeneration(extraInput?: string | null) {
        handleClick(CONTROL_STATE.GENERATE, extraInput);
    }

    return (
        <>
            <div className={'relative group/edit-control ' + (props.containerClassName ?? '')}>
                {controlState === CONTROL_STATE.IDLE && <div className={"absolute top-0 left-0 w-full h-full rounded bg-black group-hover/edit-control:bg-opacity-80 bg-opacity-0 transition-all flex items-center justify-center gap-1 cursor-pointer " + (loading ? '!bg-opacity-80' : '')}>
                    <div className={"animate-pulse absolute top-0 left-0 w-full h-full border-2 border-dashed border-gray-200 rounded"} />
                    {!loading ? <div className='flex relative items-center gap-3 z-10'>
                        <div onClick={() => handleClick(CONTROL_STATE.EDIT)} className='group-hover/edit-control:opacity-100 opacity-0 transition-all flex items-center gap-2 py-1 px-4 border-2 border-white rounded-lg hover:border-primary hover:text-primary '>
                            <RiEditFill className="text-[1.25em]" />
                            <span className={"transition-opacity text-[0.95em]"}>Edit</span>
                        </div>
                        <div onClick={() => handleClick(CONTROL_STATE.GENERATE)} className='group-hover/edit-control:opacity-100 opacity-0 transition-all flex items-center gap-2 py-1 px-4 border-2 border-white rounded-lg hover:border-primary hover:text-primary '>
                            <RiAiGenerate className="text-[1.25em]" />
                            <span className={"text-[0.95em]"}>Regenerate</span>
                        </div>
                    </div> : <>
                        <Loader className={'w-3 h-3'} />
                        <span className={"text-[1em]"}>Generating</span>
                    </>}
                </div>}
                {!props.inputEditable && props.children}
                {(controlState === CONTROL_STATE.EDIT && props.inputEditable) ? <div className='w-full flex flex-col items-end gap-2'>
                    <textarea onChange={e => onChange(e.target.value)} rows={props.rows ?? 4} className='w-full h-full bg-black py-1 px-2 focus:outline-none focus:ring-2 ring-primary'>
                        {props.content}
                    </textarea>
                     <div className='flex items-center gap-3' onClick={() => {}}>
                        <button onClick={handleSaveEdit} className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Save</button>
                        <button onClick={handleCloseEdit} className=''>Cancel</button>
                    </div>
                </div> : <span>{props.content}</span>}

                {(controlState === CONTROL_STATE.EDIT && props.type === 'image') && <>
                    {/* <div className='absolute text-primary right-full flex text-xl flex-col gap-0.5 top-0 w-10 h-auto bg-gray-800'>
                        <label for="upload-image-control" data-tooltip-id={'edit-ad-variant-tooltip'} data-tooltip-content="Upload Image" className='w-full aspect-square flex justify-center items-center bg-gray-900 cursor-pointer'>
                            <input onChange={handleChangeImage} type="file" hidden id="upload-image-control" />
                            <FaUpload />
                        </label>
                        <div data-tooltip-id={'edit-ad-variant-tooltip'} data-tooltip-content="Regenerate Image" className='w-full aspect-square flex justify-center items-center bg-gray-900 cursor-pointer'>
                            <RiRefreshLine />
                        </div>
                    </div> */}
                    <div className='flex justify-end px-4 items-center gap-3' onClick={() => {}}>
                        <button onClick={handleSaveEdit} className="bg-primary text-white text-xs px-4 py-1.5 leading-[16px] rounded cursor-pointer">Save</button>
                        <button onClick={handleCloseEdit} className=''>Cancel</button>
                    </div>
                </>}
            </div>
            {showSuggestions && state.variant && <GeneratedSuggestions type={props.type} list={props.type === 'image' && state.regeneratedImages ? [...(state.regeneratedImages[state.variant?.id] ?? []), ] : suggestions} controlKey={props.controlKey} handleClose={handleCloseSuggestions} handleSave={handleSave} handleCustomizeRegeneration={handleCustomizeRegeneration} />}
        </>
    )
}

export default EditControl;