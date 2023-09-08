import React, {useState} from 'react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import CTAButton from '@/components/CTAButton';
import {motion} from 'framer-motion';

export default function Navbar() {
	const router = useRouter();
	const [expand, setExpand] = useState(false);

	const listItems = (
		<ul
			className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
			<li
				onClick={() => setExpand(false)}>
				<Link href="#"
				   className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700"
				   aria-current="page">Home</Link>
			</li>
			<li
				onClick={() => setExpand(false)}>
				<Link href="#product-overview"
				      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700">Services</Link>
			</li>
			<li
				onClick={() => setExpand(false)}>
				<Link href="#why-us"
				      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700">Why Us</Link>
			</li>
			<li
				onClick={() => setExpand(false)}>
				<Link href="#contact"
				      className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700">Contact Us</Link>
			</li>
		</ul>
	)

	return (

		<nav className="font-diatype fixed w-full top-0 left-0 bg-background z-30">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				<Logo style={{opacity: 0}} asLink={true} />
				<div className="flex md:order-2">
					{/*<button type="button"*/}
					{/*        className="text-white bg-primary hover:opacity-75 transition-all focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-primary "*/}
					{/*	onClick={() => {*/}
					{/*		router.push('#contact');*/}
					{/*	}}*/}
					{/*>Register*/}
					{/*</button>*/}
					<CTAButton onClick={() => router.push('#contact')} className="px-4 py-2 text-sm rounded-lg">
						<span>Register</span>
					</CTAButton>
					<button onClick={() => setExpand(c => !c)} data-collapse-toggle="navbar-sticky" type="button"
					        className="ml-4 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					        aria-controls="navbar-sticky" aria-expanded="false">
						<span className="sr-only">Open main menu</span>
						<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
						     viewBox="0 0 17 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							      d="M1 1h15M1 7h15M1 13h15"/>
						</svg>
					</button>
				</div>
				<div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
					{listItems}
				</div>
				<motion.div animate={{x: expand ? '100%' : 0}} className="md:hidden visible w-full h-full bg-background overflow-hidden fixed top-[72px] left-0">
					{listItems}
				</motion.div>
			</div>
		</nav>

)
}
