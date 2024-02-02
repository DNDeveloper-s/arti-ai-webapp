import React, { FC } from 'react';
import Element from './Element';

interface NavDropdownItemProps {
    label: string;
    info?: string;
}

const NavDropdownItem: FC<NavDropdownItemProps> = (props) => {
    return (
        <div className='flex items-center gap-4 justify-between w-full'>
            <span>{props.label}</span> 
            <Element content={props.info} type='span' className='inline-block py-1 px-2 text-xs text-gray-300 bg-gray-800 rounded-md' />
        </div>
    );
}

export default NavDropdownItem;