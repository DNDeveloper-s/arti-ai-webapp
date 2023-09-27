'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import React, {FC, useState} from 'react';
import CTAButton from '@/components/CTAButton';
import {navbarData} from '@/constants/landingPageData/navbar';

interface NavMenuItemsProps {
}

const NavMenuItems: FC<NavMenuItemsProps> = () => {
	const [expand, setExpand] = useState(false);

	return (
		<>
			<div className="absolute right-4 flex md:order-2">
				<Link href={navbarData.cta.href}>
					<CTAButton className="px-4 py-2 text-sm rounded-lg">
						{navbarData.cta.label}
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
					{navbarData.navItems.map(item => (
						<li
							key={item.id}>
							<Link href={item.href}
							      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
							      aria-current="page">{item.label}</Link>
						</li>
					))}
				</ul>
			</div>
			{/*Mobile Menu Items*/}
			<motion.div animate={{x: expand ? 0 : '100%'}} transition={{type: 'linear'}}
			            className="md:hidden visible w-full h-full bg-background overflow-hidden fixed top-[72px] left-0">
				<ul
					className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
					{navbarData.navItems.map(item => (
						<li
							key={item.id} onClick={() => setExpand(c => !c)}>
							<Link href={item.href}
							      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
							      aria-current="page">{item.label}</Link>
						</li>
					))}
				</ul>
			</motion.div>
		</>
	)
}

export default NavMenuItems;
