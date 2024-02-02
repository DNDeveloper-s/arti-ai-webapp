import React, { FC, useState } from 'react';

interface CardAnimationProps {
    PaperClassName?: string;
    handelItemClick?: (index: number) => void;
    PaperProps?: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'className' | 'onClick'>;
    items: CardAnimationItem[];
    autoPlay?: boolean;
    ContainerClassName?: string;
    ContainerProps?: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'className'>;
}

export interface CardAnimationItem {
    id: string;
    el: JSX.Element;
}

// const items = [
//     {id: '1', content: <div className='w-full h-full bg-red-500'>Card 1</div>},
//     {id: '2', content: <div className='w-full h-full bg-blue-500'>Card 2</div>},
//     {id: '3', content: <div className='w-full h-full bg-green-500'>Card 3</div>},
//     {id: '4', content: <div className='w-full h-full bg-slate-500'>Card 4</div>},
//     {id: '5', content: <div className='w-full h-full bg-white'>Card 5</div>},
// ]

const CardAnimation:FC<CardAnimationProps> = (props) => {
    const [active, setActive] = useState(0);

    const baseClassName = 'absolute top-1/2 scale-75 transition-all opacity-0 duration-[0] transform -translate-y-1/2 right-0 left-0 mx-auto max-h-[fit-content] max-w-[fit-content]  ';
    const activeClassName = '!scale-100 z-30 translate-x-0 duration-[250ms] !opacity-100 ';
    const nextItemClassName = 'translate-x-[40%] duration-[250ms]] !opacity-100 ';
    const prevItemClassName =  'translate-x-[-40%] duration-[250ms] !opacity-100 ';
    const intervalIdRef = React.useRef<NodeJS.Timeout>();
    
    const getClassName = (index: number) => {
        const isActive = index === active;
        const isNext = index === active + 1;
        const isPrev = index === active - 1;
        if(active === props.items.length - 1 && index === 0) return baseClassName + nextItemClassName;
        if(active === 0 && index === props.items.length - 1) return baseClassName + prevItemClassName;
        return baseClassName + (isActive ? activeClassName : (isNext ? nextItemClassName : isPrev ? prevItemClassName : ''));
    }

    function startAutoPlay() {
        if(!props.autoPlay) return clearInterval(intervalIdRef.current);
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % props.items.length);
        }, 5000);
        intervalIdRef.current = interval;
        return interval;
    }

    function autoPlay() {
        if(!intervalIdRef.current) return;
        clearInterval(intervalIdRef.current);
        const interval = startAutoPlay();
        return () => interval && clearInterval(interval);
    }

    React.useEffect(autoPlay, [props.autoPlay]);

    const handleClick = (index: number) => {
        if(props.handelItemClick) props.handelItemClick(index);
        setActive(index);
        clearInterval(intervalIdRef.current);
        startAutoPlay();
    }
    
    return (
        <div className={'relative overflow-hidden w-full ' + (props.ContainerClassName)} {...(props.ContainerProps ?? {})}>
            {props.items.map((item, index) => (
                <div key={item.id} className={getClassName(index) + " " + (props.PaperClassName ?? '')} onClick={() => handleClick(index)} {...(props.PaperProps ?? {})}>
                    {item.el}
                </div>
            ))}
        </div>
    )

}

export default CardAnimation;