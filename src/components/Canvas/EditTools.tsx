"use client";

import { useClickAway } from "@/hooks/useClickAway";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import { BsBorderWidth, BsFonts } from "react-icons/bs";
import { IoColorPaletteOutline, IoLayers } from "react-icons/io5";
import { LuUpload } from "react-icons/lu";
import { MdFormatBold, MdOutlineFormatColorFill } from "react-icons/md";
import {
  PiCircle,
  PiLineSegment,
  PiRectangle,
  PiSelectionPlusLight,
} from "react-icons/pi";
import { RiFontColor, RiFontSize, RiShapeFill } from "react-icons/ri";
import { TbOvalVertical } from "react-icons/tb";
import { SketchPicker } from "react-color";
import fetchFonts from "@/helpers/fonts";
import { FaBold, FaItalic, FaRegImage } from "react-icons/fa6";
import Layers, { LayersProps } from "./Layers";
import Select from "react-select";
import LiveSelect, { LiveSelectOption } from "../shared/renderers/LiveSelect";
import { ElementType } from "./EditCanvas";
import { BiUpload } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
import { color } from "framer-motion";

export interface Tool {
  id: string;
  name: string;
  icon: ReactNode;
}

// ['selection', 'line', 'rectangle', 'ellipse', 'circle', 'text']

const tools = [
  { id: "selection", name: "Selection", icon: <PiSelectionPlusLight /> },
  { id: "shapes", name: "Shapes", icon: <RiShapeFill /> },
  { id: "text", name: "Font", icon: <BsFonts /> },
  { id: "upload", name: "Upload Image", icon: <IoMdImages /> },
  { id: "fill", name: "Fill Color", icon: <MdOutlineFormatColorFill /> },
  { id: "text-fill", name: "Text Fill", icon: <RiFontColor /> },
  { id: "stroke", name: "Stroke Color", icon: <IoColorPaletteOutline /> },
  { id: "layer", name: "Layer", icon: <IoLayers /> },
  // {id: 'stroke-width', name: 'Stroke Width', icon: <BsBorderWidth /> }
];

const shapeTools = [
  { id: "rectangle", name: "Rectangle", icon: <PiRectangle /> },
  { id: "circle", name: "Circle", icon: <PiCircle /> },
  { id: "line", name: "Line", icon: <PiLineSegment /> },
  { id: "ellipse", name: "Ellipse", icon: <TbOvalVertical /> },
];

const uploadImageOptions = [
  { id: "image", name: "Image", icon: <BiUpload /> },
  { id: "bg-image", name: "Background Image", icon: <BiUpload /> },
];

const RGBA = {
  decode: (color: string) => {
    try {
      if (typeof color === "object") return color;

      const rgbaColorRegex =
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(?:\d*\.\d+|\d+\.\d*|\d+)\s*\)$/;
      const isValidRgbaColor = rgbaColorRegex.test("rgba(2, 3, 4, 0.5)");

      if (!isValidRgbaColor) {
        console.log("Error in parsing the RGBA color - ", color);
        return { r: 0, g: 0, b: 0, a: 1 };
      }

      // Remove 'rgba(' and ')' and split the values
      const values = color.slice(5, -1).split(",");

      // Trim spaces from each component
      return {
        r: parseInt(values[0].trim()),
        g: parseInt(values[1].trim()),
        b: parseInt(values[2].trim()),
        a: parseFloat(values[3].trim()),
      };
    } catch (e) {
      console.log("Error in parsing the RGBA color - ", color);
      return { r: 0, g: 0, b: 0, a: 1 };
    }
  },
  encode: (color: { r: number; g: number; b: number; a: number }) => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  },
};

interface ColorPickerToolProps {
  selected: boolean;
  handleClick: (tool: Tool) => void;
  tool: Tool;
  color?: string;
  handleColorChange: (color: string, completed?: boolean) => void;
  disabled: boolean;
}
const ColorPickerTool: FC<ColorPickerToolProps> = ({
  disabled,
  selected,
  handleClick,
  tool,
  color: _color,
  handleColorChange,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [color, setColor] = useState(_color ?? "rgba(0, 0, 0, 1)");

  const ref = useRef(null);

  const handleClickOutside = () => {
    if (disabled) return;
    setShowOptions(false);
  };

  useClickAway(ref, handleClickOutside);

  function onChange(color: any, completed: boolean = false) {
    // setSelectedShape(tool);
    if (disabled) return;

    const encodedColor = RGBA.encode(color.rgb);
    color?.rgb && encodedColor && setColor(encodedColor);

    handleColorChange(encodedColor, completed);
  }

  function handleToggle() {
    if (disabled) return;
    setShowOptions((c) => !c);
    handleClick(tool);
  }

  return (
    <div style={{ opacity: disabled ? 0.2 : 1 }} ref={ref} className="relative">
      <div
        style={{
          color: color,
          fill: color,
          stroke: color,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={handleToggle}
        className={
          "flex text-xl justify-center items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
          (selected ? " !bg-gray-200" : "")
        }
      >
        {tool.icon}
      </div>
      {showOptions && (
        <div className={"absolute right-0 top-[105%] rounded z-30 "}>
          <SketchPicker
            onChangeComplete={(obj: any) => {
              obj?.rgb && onChange(obj, true);
            }}
            color={RGBA.decode(color)}
            onChange={(obj: any) => onChange(obj)}
          />
        </div>
      )}
    </div>
  );
};

interface ShapeToolProps {
  selected: boolean;
  handleToolClick: (tool: Tool) => void;
}
const ShapeTool: FC<ShapeToolProps> = ({ selected, handleToolClick }) => {
  const [selectedShape, setSelectedShape] = useState<Tool>(shapeTools[0]);
  const [showOptions, setShowOptions] = useState(selected);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowOptions(false);
  };

  useClickAway(ref, handleClickOutside);

  function onChange(tool: Tool) {
    setSelectedShape(tool);
    handleToolClick(tool);
  }

  function handleToggle() {
    setShowOptions((c) => !c);
    handleToolClick(selectedShape);
  }

  return (
    <div ref={ref} className="relative">
      <div
        onClick={handleToggle}
        className={
          "flex justify-center text-3xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
          (selected ? " !bg-gray-200" : "")
        }
      >
        {selectedShape.icon}
      </div>
      {showOptions && (
        <div
          className={
            "absolute left-[calc(100%+15px)] z-30 bg-gray-200 top-0 grid grid-cols-[30px_30px] gap-2 p-2 rounded text-2xl"
          }
        >
          {shapeTools.map((shapeTool) => (
            <div
              key={shapeTool.id}
              onClick={() => onChange(shapeTool)}
              className={
                "p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
                (selectedShape.id === shapeTool.id ? " !bg-gray-200" : "")
              }
            >
              {shapeTool.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ImageToolProps {
  tool: Tool;
  handleImageChange: (
    type: "image" | "bg-image",
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}
const ImageTool: FC<ImageToolProps> = ({ tool, handleImageChange }) => {
  const [showOptions, setShowOptions] = useState(false);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowOptions(false);
  };

  useClickAway(ref, handleClickOutside);

  function handleToggle() {
    setShowOptions((c) => !c);
  }

  return (
    <div ref={ref} className="relative">
      <div
        onClick={handleToggle}
        className={
          "flex justify-center text-3xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
          (showOptions ? " !bg-gray-200" : "")
        }
      >
        {tool.icon}
      </div>
      {showOptions && (
        <div
          className={
            "absolute right-0 bg-gray-200 top-[105%] flex flex-col w-auto whitespace-nowrap z-30 rounded text-xs"
          }
        >
          {uploadImageOptions.map((uploadTool) => (
            <div
              key={uploadTool.id}
              className={
                "px-3 py-2 cursor-pointer hover:bg-gray-100 rounded transition-all"
              }
            >
              <label
                className={
                  "cursor-pointer flex items-center justify-start w-full gap-2"
                }
                htmlFor={uploadTool.id}
              >
                <input
                  onChange={(e) => {
                    handleImageChange(uploadTool.id, e);
                    handleClickOutside();
                  }}
                  name={uploadTool.id}
                  id={uploadTool.id}
                  type="file"
                  hidden
                />
                <div className="text-xl">{uploadTool.icon}</div>
                <span>{uploadTool.name}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const sizesAvailable = [
  4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 52,
  56, 60, 64, 72,
];
const sizesAvailableOptions = sizesAvailable.map((c) => ({
  value: c,
  label: c.toString(),
}));
const defaultFontDetails = {
  fontSize: 16,
  fontFamily: "Arial",
  lineHeight: 16,
  fillStyle: "black",
  bold: false,
  italic: false,
};
const defaultShapeDetails = {
  type: "rectangle",
  fillStyle: "black",
  strokeStyle: "black",
  // lineWidth: 1
};

interface FontOptionsToolProps {
  initialFontDetails?: FontFormat;
  selected: boolean;
  handleFontChange: (props: FontFormat) => void;
}
const FontOptionsTool: FC<FontOptionsToolProps> = (props) => {
  // const [selectedShape, setSelectedShape] = useState<Tool>(shapeTools[0]);
  const [showOptions, setShowOptions] = useState(props.selected);
  const [fontDetails, setFontDetails] = useState(
    props.initialFontDetails ?? defaultFontDetails
  );
  const [fontFamilies, setFontFamilies] = useState<string[]>([]);

  useEffect(() => {
    fetchFonts().then((fontsAvailable) =>
      setFontFamilies((fontsAvailable as string[]) ?? [])
    );
  }, []);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowOptions(false);
  };

  useClickAway(ref, handleClickOutside);

  function onChange(key: keyof FontFormat, value: string) {
    // setSelectedShape(tool);
    // handleToolClick(tool);
    setFontDetails((c) => {
      props.handleFontChange({ ...c, [key]: value });
      return { ...c, [key]: value };
    });
  }

  // useEffect(() =>{
  //     props.handleFontChange(fontDetails);
  // }, [fontDetails])

  function handleToggle() {
    setShowOptions((c) => !c);
    props.handleFontChange(fontDetails);
    // handleToolClick(selectedShape);
  }

  return (
    <div ref={ref} className="relative">
      <div
        onClick={handleToggle}
        className={
          "flex text-xl items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
          (props.selected ? " !bg-gray-200" : "")
        }
      >
        <RiFontSize />
      </div>
      {showOptions && (
        <div
          className={
            "absolute left-[calc(100%+15px)] bg-gray-200 top-0 flex items-center gap-2 p-2 rounded text-base"
          }
        >
          <select
            onChange={(e) => onChange("fontSize", e.target.value)}
            name=""
            id=""
          >
            {sizesAvailable.map((size) => (
              <option
                key={size}
                selected={size.toString() === fontDetails.fontSize.toString()}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => onChange("fontFamily", e.target.value)}
            name=""
            id=""
          >
            {fontFamilies.map((font) => (
              <option
                key={font}
                selected={font === fontDetails.fontFamily}
                value={font}
              >
                {font}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export interface ColorFormat {
  color: string;
  type: "fill" | "stroke";
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
  const [fontDetails, setFontDetails] = useState<FontFormat>(
    props.initialFontDetails ?? defaultFontDetails
  );
  const [fontFamilies, setFontFamilies] = useState<string[]>([]);

  useEffect(() => {
    fetchFonts().then((fontsAvailable) =>
      setFontFamilies((fontsAvailable as string[]) ?? [])
    );
  }, []);

  function handleColorChange(
    color: string,
    type: ColorFormat["type"],
    completed: boolean = false
  ) {
    props.handleFormatChange({ color, type }, completed);
  }

  function onChange(key: keyof FontFormat, value: string | number | boolean) {
    props.handleFormatChange({ ...fontDetails, [key]: value }, true);
    setFontDetails((c) => {
      return { ...c, [key]: value };
    });
  }

  function toggleBold() {
    onChange("bold", !fontDetails.bold);
  }

  function toggleItalic() {
    onChange("italic", !fontDetails.italic);
  }

  return (
    <div className={"flex items-center gap-2 bg-gray-100 rounded h-full"}>
      {/* <div onClick={toggleBold} className={'flex text-base items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (fontDetails.bold ? ' !bg-gray-300' : '')}>
              <FaBold />
          </div>
          <div onClick={toggleItalic} className={'flex text-base items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all ' + (fontDetails.italic ? ' !bg-gray-300' : '')}>
              <FaItalic />
          </div>
          <select onChange={(e) => onChange('fontSize', e.target.value)} name="" id="" className={'bg-gray-100'}>
              {sizesAvailable.map(size => (
                <option key={size} selected={size.toString() === fontDetails.fontSize.toString()} value={size}>{size}</option>
              ))}
          </select> */}
      {/*<select onChange={(e) => onChange('lineHeight', e.target.value)} name="" id="">*/}
      {/*    {sizesAvailable.map(size => (*/}
      {/*      <option key={size} selected={size.toString() === fontDetails.fontSize.toString()} value={size}>{size}</option>*/}
      {/*    ))}*/}
      {/*</select>*/}
      {/* <select onChange={(e) => onChange('fontFamily', e.target.value)} className={'w-[100px] bg-gray-100'} name="" id="">
              {fontFamilies.map(font => (
                <option key={font} selected={font === fontDetails.fontFamily} value={font}>{font}</option>
              ))}
          </select> */}
      {/* <ColorPickerTool color={fontDetails.fillStyle} disabled={false} selected={selected?.id === 'fill'} tool={tools.find(c => ['fill'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color, completed) => handleColorChange(color, 'fill', completed)} /> */}
    </div>
  );
};

interface ShapeToolsProps {
  initialShapeDetails?: ShapeFormat;
  handleFormatChange: (props: ColorToolProps, completed?: boolean) => void;
}
export const ShapeTools: FC<ShapeToolsProps> = (props) => {
  const [selected, setSelected] = useState<Tool | null>(null);
  const [shapeDetails, setShapeDetails] = useState<ShapeFormat>(
    props.initialShapeDetails ?? defaultShapeDetails
  );

  function handleColorChange(
    color: string,
    type: ColorFormat["type"],
    completed: boolean = false
  ) {
    props.handleFormatChange({ color, type }, completed);
    setShapeDetails({ ...shapeDetails, [type]: color });
  }

  return (
    <div
      className={"flex items-center gap-2 py-1 px-2 bg-gray-100 rounded h-full"}
    >
      <ColorPickerTool
        color={shapeDetails.fill}
        disabled={false}
        selected={selected?.id === "fill"}
        tool={tools.find((c) => ["fill"].includes(c.id))!}
        handleClick={(tool: Tool) => {
          setSelected(tool);
        }}
        handleColorChange={(color, completed) =>
          handleColorChange(color, "fill", completed)
        }
      />
      <ColorPickerTool
        color={shapeDetails.stroke}
        disabled={false}
        selected={selected?.id === "stroke"}
        tool={tools.find((c) => ["stroke"].includes(c.id))!}
        handleClick={(tool: Tool) => {
          setSelected(tool);
        }}
        handleColorChange={(color, completed) =>
          handleColorChange(color, "stroke", completed)
        }
      />
    </div>
  );
};

interface LayerToolProps extends LayersProps {
  selected: boolean;
  setSelected: (tool: Tool) => void;
  tool: Tool;
  handleSelectLayer: (itemId: any) => void;
}
export const LayerTools: FC<LayerToolProps> = ({ selected, ...props }) => {
  const [showOptions, setShowOptions] = useState(selected);
  const disabled = !props.list || props.list.length === 0;

  const ref = useRef(null);

  const handleClickOutside = () => {
    // if(disabled) return;
    const count =
      document && document.querySelector("#myportal")?.childElementCount;
    if (count !== undefined && count > 0) return;
    setShowOptions(false);
  };

  useClickAway(ref, handleClickOutside);

  function toggleTool() {
    setShowOptions((c) => !c);
    props.setSelected(props.tool);
  }

  return (
    <div ref={ref} className="relative">
      <div
        onClick={toggleTool}
        className={
          "flex text-3xl justify-center items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
          (selected ? " !bg-gray-200" : "")
        }
      >
        <IoLayers />
      </div>
      {showOptions && (
        <div className={"absolute left-[calc(100%+15px)] top-0 rounded"}>
          <Layers disabled={disabled} {...props} />
        </div>
      )}
    </div>
  );
};

interface EditToolsProps {
  handleChange: (tool: Tool) => void;
  handleFormatChange: (props: ColorToolProps, completed?: boolean) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBgImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  LayerProps: LayersProps;
  initialFontDetails?: FontFormat;
  selectedType?: ElementType;
}

const EditTools: FC<EditToolsProps> = ({ handleFormatChange, ...props }) => {
  const [selected, setSelected] = useState<Tool>(tools[0]);
  const [fontDetails, setFontDetails] = useState<FontFormat>(
    props.initialFontDetails ?? defaultFontDetails
  );
  const [fontFamilies, setFontFamilies] = useState<LiveSelectOption[]>([]);
  const fontDetailsRef = useRef<FontFormat>(
    props.initialFontDetails ?? defaultFontDetails
  );

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

  function handleColorChange(
    color: string,
    type: ColorFormat["type"],
    completed?: boolean
  ) {
    handleFormatChange({ color, type }, completed);
  }

  useEffect(() => {
    fetchFonts().then((fontsAvailable) =>
      setFontFamilies(
        ((fontsAvailable as string[]) ?? []).map((c) => ({
          value: c,
          label: c,
        }))
      )
    );
  }, []);

  const fontDetailsChangedRef = useRef<string | boolean>(false);
  const onChange = useCallback(
    (
      key: keyof FontFormat,
      value: string | number | boolean,
      isShallow?: boolean
    ) => {
      setFontDetails((c) => {
        fontDetailsChangedRef.current = isShallow ? "shallow" : true;
        return { ...c, [key]: value };
      });
    },
    [setFontDetails]
  );

  function toggleBold() {
    onChange("bold", !fontDetails.bold);
  }

  function toggleItalic() {
    onChange("italic", !fontDetails.italic);
  }

  const layerTool = tools.find((c) => c.id === "layer");
  const uploadTool = tools.find((c) => c.id === "upload");

  const handleFontFamilyChange = useCallback(
    (key: string, option: LiveSelectOption) => {
      onChange("fontFamily", option?.value, true);
    },
    [onChange]
  );

  const handleFontSizeChange = useCallback(
    (key: string, option: LiveSelectOption) => {
      onChange("fontSize", option?.value, true);
    },
    [onChange]
  );

  useEffect(() => {
    if (fontDetailsChangedRef.current) {
      handleFormatChange(
        fontDetails,
        fontDetailsChangedRef.current !== "shallow"
      );
      fontDetailsChangedRef.current = false;
    }
  }, [fontDetails]);

  function handleImageChange(
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (type === "image") props.handleImageChange(e);
    else if (type === "bg-image") props.handleBgImageChange(e);
  }

  return (
    <div className="relative bg-white rounded py-2 px-2">
      {/* <div>
                <h1>Edit Tools</h1>
            </div> */}
      <div className="w-[130px] text-black divide-y divide-y-gray-300 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3 w-full">
          <ShapeTool
            key={"shape"}
            handleToolClick={handleToolClick}
            selected={shapeTools.map((c) => c.id).includes(selected.id)}
          />
          {tools
            .filter(
              (c) =>
                !["fill", "stroke", "layer", "upload", "shapes"].includes(c.id)
            )
            .map((tool: Tool) => {
              return (
                <div
                  onClick={(e) => handleToolClick(tool)}
                  key={tool.id}
                  className={
                    "flex text-3xl justify-center items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
                    (selected.id === tool.id ? " !bg-gray-200" : "")
                  }
                >
                  {tool.icon}
                </div>
              );
            })}
          {uploadTool && (
            <ImageTool
              handleImageChange={handleImageChange}
              tool={uploadTool}
            />
          )}
          {layerTool && (
            <LayerTools
              {...props.LayerProps}
              tool={layerTool}
              selected={selected.id === layerTool.id}
              setSelected={setSelected}
            />
          )}
          <div></div>
        </div>
        {props.selectedType === "text" && (
          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <div
              onClick={toggleBold}
              className={
                "flex text-xl py-2 justify-center items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
                (fontDetails.bold ? " !bg-gray-300" : "")
              }
            >
              <FaBold />
            </div>
            <div
              onClick={toggleItalic}
              className={
                "flex text-xl justify-center items-center p-1 cursor-pointer hover:bg-gray-100 rounded transition-all " +
                (fontDetails.italic ? " !bg-gray-300" : "")
              }
            >
              <FaItalic />
            </div>
            <div className="relative">
              <LiveSelect
                name={"fontSize"}
                handleChange={handleFontSizeChange}
                options={sizesAvailableOptions}
                defaultValue={
                  sizesAvailableOptions.findIndex(
                    (c) => c.value === fontDetails.fontSize
                  ) > -1
                    ? sizesAvailableOptions.findIndex(
                        (c) => c.value === fontDetails.fontSize
                      )
                    : 0
                }
              />
            </div>
            <ColorPickerTool
              color={fontDetails.fillStyle}
              disabled={false}
              selected={selected?.id === "text-fill"}
              tool={tools.find((c) => ["text-fill"].includes(c.id))!}
              handleClick={(tool: Tool) => {
                setSelected(tool);
              }}
              handleColorChange={(color, completed) =>
                handleColorChange(color, "fill", completed)
              }
            />
            <div className="col-span-2">
              <LiveSelect
                name={"fontFamily"}
                handleChange={handleFontFamilyChange}
                options={fontFamilies}
                defaultValue={
                  fontFamilies.findIndex(
                    (c) => c.value === fontDetails?.fontFamily
                  ) > -1
                    ? fontFamilies.findIndex(
                        (c) => c.value === fontDetails?.fontFamily
                      )
                    : 0
                }
              />
            </div>
            {/* <div className='col-span-2 text-sm'>
                        <Select defaultValue={{value: fontDetails?.fontSize, label: fontDetails?.fontSize.toString()}} options={sizesAvailableOptions} />
                    </div> */}
          </div>
        )}
        {/* <div className={'col-span-3 flex text-sm justify-center items-center cursor-pointer hover:bg-gray-100 rounded transition-all'}>
                    <LiveSelect handleFocusOption={handleFocusOption} handleChange={(option) => onChange('fontSize', option.value)} options={sizesAvailableOptions} />
                </div> */}
        {/*<div className='h-[2px] bg-gray-200 w-full' />*/}
        {/*<FontOptionsTool selected={selected.id === 'text'} handleFontChange={(fontDetails: FontFormat) => props.handleFormatChange(fontDetails)} />*/}
        {/*<ColorPickerTool disabled={false} selected={selected.id === 'fill'} tool={tools.find(c => ['fill'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color) => handleColorChange(color, 'fill')} />*/}
        {/*<ColorPickerTool disabled={false} selected={selected.id === 'stroke'} tool={tools.find(c => ['stroke'].includes(c.id))!} handleClick={(tool: Tool) => {setSelected(tool)}} handleColorChange={(color) => handleColorChange(color, 'stroke')} />*/}
      </div>
    </div>
  );
};

export default EditTools;
