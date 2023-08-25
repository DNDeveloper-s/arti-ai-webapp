import React from 'react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function Navbar() {

	return (

		<nav className="font-diatype fixed w-full z-20 top-0 left-0">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				<Logo asLink={true} />
				<div className="flex md:order-2">
					<button type="button"
					        className="text-white bg-primary hover:opacity-75 transition-all focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-primary ">Register
					</button>
					<button data-collapse-toggle="navbar-sticky" type="button"
					        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
					<ul
						className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
						<li>
							<a href="#"
							   className="transition-all block py-2 pl-3 pr-4 text-primaryText bg-blue-700 rounded md:bg-transparent md:text-primary md:p-0 md:dark:text-primary"
							   aria-current="page">Home</a>
						</li>
						<li>
							<Link href="#product-overview"
							   className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700">Services</Link>
						</li>
						<li>
							<Link href="#product-overview"
							   className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700">Product Overview</Link>
						</li>
						<li>
							<Link href="#contact"
							   className="transition-all block py-2 pl-3 pr-4 text-primaryText rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-primaryText dark:hover:text-primary md:dark:hover:bg-transparent dark:border-gray-700">Contact Us</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>

)
}
