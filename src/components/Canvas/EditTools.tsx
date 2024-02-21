'use client';

import { useClickAway } from '@/hooks/useClickAway';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { BsBorderWidth, BsFonts } from 'react-icons/bs';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { LuUpload } from 'react-icons/lu';
import {MdFormatBold, MdOutlineFormatColorFill} from 'react-icons/md';
import { PiCircle, PiLineSegment, PiRectangle, PiSelectionPlusLight } from 'react-icons/pi';
import { RiFontSize, RiShapeFill } from 'react-icons/ri';
import { TbOvalVertical } from 'react-icons/tb';
import { SketchPicker } from 'react-color'
import fetchFonts from '@/helpers/fonts';
import {FaBold, FaItalic} from 'react-icons/fa6';

export interface Tool {
    id: string;
    name: string;
    icon: ReactNode;
}

// ['selection', 'line', 'rectangle', 'ellipse', 'circle', 'text']

const tools = [
    {id: 'selection', name: 'Selection', icon: <PiSelectionPlusLight /> },
    {id: 'shapes', name: 'Shapes', icon: <RiShapeFill /> },
    {id: 'text', name: 'Font', icon: <BsFonts /> },
    {id: 'upload', name: 'Upload Image', icon: <LuUpload /> },
    {id: 'fill', name: 'Fill Color', icon: <MdOutlineFormatColorFill /> },
    {id: 'stroke', name: 'Stroke Color', icon: <IoColorPaletteOutline /> },
    // {id: 'stroke-width', name: 'Stroke Width', icon: <BsBorderWidth /> }
]

const shapeTools = [
    {id: 'rectangle', name: 'Rectangle', icon: <PiRectangle /> },
    {id: 'circle', name: 'Circle', icon: <PiCircle /> },
    {id: 'line', name: 'Line', icon: <PiLineSegment /> },
    {id: 'ellipse', name: 'Ellipse', icon: <TbOvalVertical />}
]

interface ColorPickerToolProps {
    selected: boolean;
    handleClick: (tool: Tool) => void;
    tool: Tool;
    color?: string;
    handleColorChange: (color: string, completed?: boolean) => void;
    disabled: boolean
}
const ColorPickerTool:FC<ColorPickerToolProps> = ({disabled, selected, handleClick, tool, color: _color, handleColorChange}) => {
    const [showOptions, setShowOptions] = useState(selected);
    const [color, setColor] = useState(_color ?? '#000');

    const ref = useRef(null);

    const handleClickOutside = () => {
        if(disabled) return;
        setShowOptions(false);
    }

    useClickAway(ref, handleClickOutside);

    function onChange(color: string, completed: boolean = false) {
        // setSelectedShape(tool);
        if(disabled) return;
        setColor(color);
        handleColorChange(color, completed)
    }

    function handleToggle() {
        if(disabled) return;
        setShowOptions(c => !c);
        handleClick(tool);
    }

    return (
      <div style={{opacity: disabled ? 0.2 : 1}} ref={ref} className='relative'>
          <div style={{color: color, fill: color, stroke: color, cursor: disabled ? 'not-allowed' : 'pointer'}} onClick={handleToggle} className={'flex text-xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (selected ? ' !bg-gray-200' : '')}>
              {tool.icon}
          </div>
          {showOptions && <div className={'absolute left-[calc(100%+15px)] top-0 rounded'}>
              <SketchPicker onChangeComplete={(obj: any) => {onChange(obj.hex, true)}} color={color} onChange={(obj: any) => onChange(obj.hex)} />
          </div>}
      </div>
    )
}

interface ShapeToolProps {
    selected: boolean;
    handleToolClick: (tool: Tool) => void;
}
const ShapeTool:FC<ShapeToolProps> = ({selected, handleToolClick}) => {
    const [selectedShape, setSelectedShape] = useState<Tool>(shapeTools[0]);
    const [showOptions, setShowOptions] = useState(selected);

    const ref = useRef(null);

    const handleClickOutside = () => {
        setShowOptions(false);
    }

    useClickAway(ref, handleClickOutside);

    function onChange(tool: Tool) {
        setSelectedShape(tool);
        handleToolClick(tool);
    }

    function handleToggle() {
        setShowOptions(c => !c);
        handleToolClick(selectedShape);
    }

    return (
      <div ref={ref} className='relative'>
          <div onClick={handleToggle} className={'flex text-3xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (selected ? ' !bg-gray-200' : '')}>
              {selectedShape.icon}
          </div>
          {showOptions && <div className={'absolute left-[calc(100%+15px)] bg-gray-200 top-0 grid grid-cols-[30px_30px] gap-2 p-2 rounded text-2xl'}>
              {shapeTools.map(shapeTool => (
                <div key={shapeTool.id} onClick={() => onChange(shapeTool)} className={'p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (selectedShape.id === shapeTool.id ? ' !bg-gray-200' : '')}>
                    {shapeTool.icon}
                </div>
              ))}
          </div>}
      </div>
    )
}

const sizesAvailable = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72];
const defaultFontDetails = {
    fontSize: 16,
    fontFamily: 'Arial',
    lineHeight: 16,
    fillStyle: 'black',
    bold: false,
    italic: false
}
const defaultShapeDetails = {
    type: 'rectangle',
    fillStyle: 'black',
    strokeStyle: 'black',
    // lineWidth: 1
}

interface FontOptionsToolProps {
    initialFontDetails?: FontFormat;
    selected: boolean;
    handleFontChange: (props: FontFormat) => void;
}
const FontOptionsTool: FC<FontOptionsToolProps> = (props) => {
    // const [selectedShape, setSelectedShape] = useState<Tool>(shapeTools[0]);
    const [showOptions, setShowOptions] = useState(props.selected);
    const [fontDetails, setFontDetails] = useState(props.initialFontDetails ?? defaultFontDetails);
    const [fontFamilies, setFontFamilies] = useState<string[]>([]);

    useEffect(() => {
        fetchFonts()
          .then(fontsAvailable => setFontFamilies(fontsAvailable as string[] ?? []))
    }, [])

    const ref = useRef(null);

    const handleClickOutside = () => {
        setShowOptions(false);
    }

    useClickAway(ref, handleClickOutside);

    function onChange(key: keyof FontFormat, value: string) {
        // setSelectedShape(tool);
        // handleToolClick(tool);
        setFontDetails(c => {
            props.handleFontChange({...c, [key]: value});
            return {...c, [key]: value}
        });
    }

    // useEffect(() =>{
    //     props.handleFontChange(fontDetails);
    // }, [fontDetails])

    function handleToggle() {
        setShowOptions(c => !c);
        props.handleFontChange(fontDetails);
        // handleToolClick(selectedShape);
    }

    function handleMouseEnter(font: string, e) {
        console.log('font - ', font);
    }

    return (
      <div ref={ref} className='relative'>
          <div onClick={handleToggle} className={'flex text-xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (props.selected ? ' !bg-gray-200' : '')}>
              <RiFontSize />
          </div>
          {showOptions && <div className={'absolute left-[calc(100%+15px)] bg-gray-200 top-0 flex items-center gap-2 p-2 rounded text-base'}>
              <select onChange={(e) => onChange('fontSize', e.target.value)} name="" id="">
                  {sizesAvailable.map(size => (
                    <option key={size} selected={size.toString() === fontDetails.fontSize.toString()} value={size}>{size}</option>
                  ))}
              </select>
              <select onChange={(e) => onChange('fontFamily', e.target.value)} name="" id="">
                  {fontFamilies.map(font => (
                    <option key={font} onFocus={(e) => handleMouseEnter(font, e)} onMouseEnter={(e) => handleMouseEnter(font, e)} selected={font === fontDetails.fontFamily} value={font}>{font}</option>
                  ))}
              </select>
          </div>}
      </div>
    )
}

export interface ColorFormat {
    color: string;
    type: 'fill' | 'stroke';
}

export interface ShapeFormat {
    // type: 'rectangle' | 'circle' | 'line' | 'ellipse';
    fill?: string;
    stroke?: string;
    // lineWidth: number;
}

export interface FontFormat {
    fontSize: number;
    fontFamily: string;
    bold: boolean;
    fillStyle: string;
    italic: boolean;
    // lineHeight: number;
}

export type ColorToolProps = ColorFormat | FontFormat;

interface FontToolsProps {
    initialFontDetails?: FontFormat;
    handleFormatChange: (props: ColorToolProps, completed?: boolean) => void;
}
export const FontTools: FC<FontToolsProps> = (props) => {
    const [selected, setSelected] = useState<Tool | null>(null);
    const [fontDetails, setFontDetails] = useState<FontFormat>(props.initialFontDetails ?? defaultFontDetails);
    const [fontFamilies, setFontFamilies] = useState<string[]>([]);

    useEffect(() => {
        fetchFonts()
          .then(fontsAvailable => setFontFamilies(fontsAvailable as string[] ?? []))
    }, [])

    function handleColorChange(color: string, type: ColorFormat['type'], completed: boolean = false) {
        props.handleFormatChange({color, type}, completed);
    }

    function onChange(key: keyof FontFormat, value: string | number | boolean) {
        props.handleFormatChange({...fontDetails, [key]: value}, true);
        setFontDetails(c => {
            return {...c, [key]: value}
        });
    }

    function toggleBold() {
        onChange('bold', !fontDetails.bold);
    }

    function toggleItalic() {
        onChange('italic', !fontDetails.italic);
    }

    return (
      <div className={'flex items-center gap-2 py-1 px-2 bg-gray-100 rounded h-full'}>
          <div onClick={toggleBold} className={'flex text-base items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (fontDetails.bold ? ' !bg-gray-300' : '')}>
              <FaBold />
          </div>
          <div onClick={toggleItalic} className={'flex text-base items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (fontDetails.italic ? ' !bg-gray-300' : '')}>
              <FaItalic />
          </div>
          <select onChange={(e) => onChange('fontSize', e.target.value)} name="" id="" className={'bg-gray-100'}>
              {sizesAvailable.map(size => (
                <option key={size} selected={size.toString() === fontDetails.fontSize.toString()} value={size}>{size}</option>
              ))}
          </select>
          {/*<select onChange={(e) => onChange('lineHeight', e.target.value)} name="" id="">*/}
          {/*    {sizesAvailable.map(size => (*/}
          {/*      <option key={size} selected={size.toString() === fontDetails.fontSize.toString()} value={size}>{size}</option>*/}
          {/*    ))}*/}
          {/*</select>*/}
          <select onChange={(e) => onChange('fontFamily', e.target.value)} className={'w-[100px] bg-gray-100'} name="" id="">
              {fontFamilies.map(font => (
                <option key={font} selected={font === fontDetails.fontFamily} value={font}>{font}</option>
              ))}
          </select>
          <ColorPickerTool color={fontDetails.fillStyle} disabled={false} selected={selected?.id === 'fill'} tool={tools.find(c => ['fill'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color, completed) => handleColorChange(color, 'fill', completed)} />
      </div>
    )
}


interface ShapeToolsProps {
    initialShapeDetails?: ShapeFormat;
    handleFormatChange: (props: ColorToolProps, completed?: boolean) => void;
}
export const ShapeTools: FC<ShapeToolsProps> = (props) => {
    const [selected, setSelected] = useState<Tool | null>(null);
    const [shapeDetails, setShapeDetails] = useState<ShapeFormat>(props.initialShapeDetails ?? defaultShapeDetails);

    function handleColorChange(color: string, type: ColorFormat['type'], completed: boolean = false) {
        props.handleFormatChange({color, type}, completed);
        setShapeDetails({...shapeDetails, [type]: color})
    }

    return (
      <div className={'flex items-center gap-2 py-1 px-2 bg-gray-100 rounded h-full'}>
          <ColorPickerTool color={shapeDetails.fill} disabled={false} selected={selected?.id === 'fill'} tool={tools.find(c => ['fill'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color, completed) => handleColorChange(color, 'fill', completed)} />
          <ColorPickerTool color={shapeDetails.stroke} disabled={false} selected={selected?.id === 'stroke'} tool={tools.find(c => ['stroke'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color, completed) => handleColorChange(color, 'stroke', completed)} />
      </div>
    )
}

interface EditToolsProps {
    handleChange: (tool: Tool) => void;
    handleFormatChange: (props: ColorToolProps) => void;
}

const EditTools: FC<EditToolsProps> = (props) => {
    const [selected, setSelected] = useState<Tool>(tools[0]);
    // Upload a new image
    // Selection
    // Text
    // Shapes
    // Font options - fontSize, fontFamily
    // Fill Color
    // Stroke Color
    // Stroke Width

    function handleToolClick(tool: Tool) {
        setSelected(tool);
        props.handleChange(tool);
    }

    function handleColorChange(color: string, type: ColorFormat['type']) {
        props.handleFormatChange({color, type});
    }

    return (
      <div className='relative bg-white rounded py-2 px-1'>
          {/* <div>
                <h1>Edit Tools</h1>
            </div> */}
          <div className='flex flex-col items-center space-y-4 text-black'>
              {tools.filter(c => !['fill', 'stroke'].includes(c.id)).map((tool: Tool) => {

                  if(tool.id === 'shapes') {
                      return <ShapeTool key={'shape'} handleToolClick={handleToolClick} selected={shapeTools.map(c => c.id).includes(selected.id)} />
                  }

                  return (
                    <div onClick={e => handleToolClick(tool)} key={tool.id} className={'flex text-3xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (selected.id === tool.id ? ' !bg-gray-200' : '')}>
                        {tool.icon}
                    </div>
                  )
              })}
              {/*<div className='h-[2px] bg-gray-200 w-full' />*/}
              {/*<FontOptionsTool selected={selected.id === 'text'} handleFontChange={(fontDetails: FontFormat) => props.handleFormatChange(fontDetails)} />*/}
              {/*<ColorPickerTool disabled={false} selected={selected.id === 'fill'} tool={tools.find(c => ['fill'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color) => handleColorChange(color, 'fill')} />*/}
              {/*<ColorPickerTool disabled={false} selected={selected.id === 'stroke'} tool={tools.find(c => ['stroke'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color) => handleColorChange(color, 'stroke')} />*/}
          </div>
      </div>
    )
}

export default EditTools;
