import React, { FC, useEffect, useRef, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';

export interface LiveSelectOption {
    value: any;
    label: string;
}

interface LiveSelectOptionItemProps {
    isActive: boolean,
    enableMouseOver: boolean,
    selected: boolean,
    index: number,
    option: LiveSelectOption,
    handleChange: (option: LiveSelectOption) => void,
    handleFocusIn: (index: number) => void
}
const LiveSelectOptionItem: FC<LiveSelectOptionItemProps> = (props) => {
    const {selected, isActive, enableMouseOver, option, index, handleFocusIn, handleChange} = props;
    const ref = useRef<HTMLDivElement>(null);

    function handleMouseEnter() {
        handleFocusIn(index);
    }

    useEffect(() => {
        if(isActive) ref.current?.scrollIntoView({block: 'nearest'});
    }, [isActive])


    return (
      <div ref={ref} onMouseDown={() => {
          handleChange(option)
      }} onMouseEnter={enableMouseOver ? handleMouseEnter : () => null} onMouseOver={enableMouseOver ? handleMouseEnter : () => null} className={'py-1.5 px-3 select-none cursor-pointer text-sm focus:outline-none ' + (isActive ? ' !bg-gray-100' : '') + (selected ? ' !bg-gray-200' : '')}>
          <span>{option.label}</span>
      </div>
    )
}

interface LiveSelectProps {
    options: LiveSelectOption[];
    name: string;
    defaultValue: number;
    // handleFocusOption: (option: LiveSelectOption, isInFocus: boolean) => void;
    // handleChange: (option: LiveSelectOption) => void;
    handleChange: (name: string, option: LiveSelectOption) => void;
}

const LiveSelect: FC<LiveSelectProps> = ({options, name, defaultValue, handleChange}) => {
    const containerRef = useRef<HTMLInputElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(defaultValue);
    const [activeIndex, setActiveIndex] = useState(selectedIndex);
    const [enableMouseOver, setEnableMouseOver] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const selectedRefIndex = useRef(selectedIndex);

    function handleFocusIn(index: number) {
        // console.log('handleFocusIn', option);
        setActiveIndex(index);
        containerRef.current?.focus();
    }

    function handleKeyDown(e: any) {
        if(e.key === 'ArrowDown') {
            e.preventDefault();
            setEnableMouseOver(false);
            setActiveIndex((prev) => {
                if(prev < options.length - 1) return prev + 1;
                return prev;
            });
        } else if(e.key === 'ArrowUp') {
            e.preventDefault();
            setEnableMouseOver(false);
            setActiveIndex((prev) => {
                if(prev > 0) return prev - 1;
                return prev;
            });
        } else if(e.key === 'Enter') {
            setSelectedIndex(activeIndex);
            selectedRefIndex.current = activeIndex;
            e.target?.blur();
        }
    }

    useEffect(() => {
        function handleMouseMove() {
            setEnableMouseOver(true);
        }

        document.body.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.body.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    function handleInputFocus() {
        setShowOptions(true);
    }

    function handleInputBlur() {
        setActiveIndex(selectedRefIndex.current);
        setShowOptions(false);
    }

    useEffect(() => {
        handleChange(name, options[activeIndex]);
    }, [activeIndex, name, handleChange, options]);

    useEffect(() => {
        handleChange(name, options[selectedIndex]);
    }, [selectedIndex, name, handleChange, options]);

    return (
      <div className='w-full h-full relative'>
          <div className='relative w-full bg-gray-200 rounded cursor-pointer flex items-center overflow-hidden p-1 pl-2 pr-1'>
              <input onFocus={handleInputFocus} onBlur={handleInputBlur} className='cursor-pointer absolute z-10 top-0 left-0 w-full h-full opacity-0 text-opacity-0 text-white' ref={containerRef} onKeyDown={handleKeyDown} type='text' value={options[activeIndex]?.label} />
              <span className='flex-1 pointer-events-none text-sm truncate '>{options[activeIndex]?.label}</span>
              <div className='items-center pointer-events-none flex justify-center flex-shrink-0'>
                  <RxCaretDown />
              </div>
          </div>
          {showOptions && <div className='w-full flex flex-col absolute z-20 top-[102%] left-1/2 rounded shadow-lg bg-white transform -translate-x-1/2 max-h-[200px] overflow-auto'>
              {options.map((option, index) => (
                <LiveSelectOptionItem
                  isActive={activeIndex === index}
                  option={option}
                  index={index}
                  key={option.value}
                  enableMouseOver={enableMouseOver}
                  selected={selectedIndex === index}
                  handleFocusIn={handleFocusIn}
                  handleChange={(option) => {
                      selectedRefIndex.current = index;
                      setSelectedIndex(index);
                  }}
                />
              ))}
          </div>}
      </div>
    )
}

export default LiveSelect;
