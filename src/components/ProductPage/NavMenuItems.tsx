'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import React, {FC, useState} from 'react';
import CTAButton from '@/components/CTAButton';
import {navbarData} from '@/constants/productPageData/navbar';
import {AiFillCaretDown} from 'react-icons/ai';

interface NavMenuItemsProps {
	data: typeof navbarData;
}

const NavMobileItem = ({item, handleClose}: {item: typeof navbarData.navItems[0], handleClose: () => void}) => {
	const [expand, setExpand] = useState(false);
	const hasChildren = item.children && item.children.length > 0;
	return (
		<li key={item.id} className={''}>
			<div
				key={item.id} onClick={() => {
				hasChildren ? setExpand(c => !c) : handleClose();
			}}
				className={'flex items-center justify-between relative'}
			>
				<Link href={item.href}
				      className="text-xl transition-all block py-2 pl-3 pr-4 text-primaryText rounded md:p-0 dark:text-primaryText "
				      aria-current="page">{item.label}</Link>
				{hasChildren && <AiFillCaretDown className={'transition-all'} style={{transform: `rotate(${expand ? 180 : 0}deg)`}} />}
			</div>
			{hasChildren && <div
        className={'p-2 overflow-hidden transition-all'}
        style={{
					maxHeight: !expand ? 0 : '400px',
					boxShadow: 'rgb(193 193 193 / 10%) 0px 20px 25px -5px, rgb(163 163 163 / 4%) 0px 10px 10px -5px'
				}}
      >
        <ul className={'divide-y divide-gray-800'}>
					{item.children.map(child => (
						<li
							className={'whitespace-nowrap py-2 pl-2 pr-2 text-base'}
							onClick={handleClose}
							key={child.id}>
							<Link href={child.href}
							      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
							      aria-current="page">{child.label}</Link>
						</li>
					))}
        </ul>
      </div>}
		</li>
	)
}

const NavMenuItems: FC<NavMenuItemsProps> = ({data = navbarData}) => {
	const [expand, setExpand] = useState(false);

	return (
		<>
			<div className="absolute right-4 flex md:order-2">
				<Link className="breathing-button-primary rounded-lg" href={navbarData.cta.href}>
					<CTAButton className=" px-4 py-2 text-sm rounded-lg">
						{data.cta.label}
					</CTAButton>
				</Link>
				<button onClick={() => {
					setExpand(c => !c)
				}} data-collapse-toggle="navbar-sticky" type="button"
				        className="ml-4 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				        aria-controls="navbar-sticky" aria-expanded="false">
					<span className="sr-only">Open main menu</span>
					<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
					     viewBox="0 0 17 14">
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
						      d="M1 1h15M1 7h15M1 13h15"/>
					</svg>
				</button>
			</div>
			<div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
				<ul
					className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
					{data.navItems.map(item => (
						<li
							className={'relative group'}
							key={item.id}>
							<Link href={item.href}
							      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded group-hover:bg-gray-100 md:hover:bg-transparent md:group-hover:text-primary md:p-0 md:dark:group-hover:text-primary dark:text-primaryText dark:group-hover:text-primary md:dark:group-hover:bg-transparent dark:border-gray-700"
							      aria-current="page">{item.label}</Link>
							{item.children && item.children?.length > 0 && <div
                className={'group-hover:opacity-100 opacity-0 pointer-events-none group-hover:pointer-events-auto absolute top-[100%] -left-2 rounded bg-black p-2'}
                style={{
									boxShadow: 'rgb(193 193 193 / 10%) 0px 20px 25px -5px, rgb(163 163 163 / 4%) 0px 10px 10px -5px'
								}}
              >
                <ul className={'divide-y divide-gray-800'}>
									{item.children.map(child => (
										<li
											className={'whitespace-nowrap py-2 pl-2 pr-2 text-sm'}
											key={child.id}>
											<Link href={child.href}
											      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
											      aria-current="page">{child.label}</Link>
										</li>
									))}
                </ul>
              </div>}
						</li>
					))}
				</ul>
			</div>
			{/*Mobile Menu Items*/}
			<motion.div animate={{x: expand ? 0 : '100%'}} transition={{type: 'linear'}}
			            className="md:hidden visible w-full h-full bg-background overflow-hidden fixed top-[60px] left-0">
				<ul
					className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
					{data.navItems.map(item => (
						<NavMobileItem item={item} key={item.id} handleClose={() => setExpand(false)} />
					))}
				</ul>
			</motion.div>
		</>
	)
}

export default NavMenuItems;
