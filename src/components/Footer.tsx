import React from 'react';
import Logo from '@/components/Logo';
import {AiFillFacebook, AiFillInstagram, AiFillLinkedin, AiFillTwitterSquare} from 'react-icons/ai';

export default function Footer() {
	return (
		<footer className="rounded-lg shadow bg-secondaryText bg-opacity-10 m-4">
			<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
				<div className="sm:flex sm:items-center sm:justify-between">
					<Logo asLink={true} />
					{/*<ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">*/}
					{/*	<li>*/}
					{/*		<a href="#" className="mr-4 hover:underline md:mr-6">Arti Bot</a>*/}
					{/*	</li>*/}
					{/*	<li>*/}
					{/*		<a href="#" className="mr-4 hover:underline md:mr-6 ">Services</a>*/}
					{/*	</li>*/}
					{/*	<li>*/}
					{/*		<a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>*/}
					{/*	</li>*/}
					{/*	<li>*/}
					{/*		<a href="#" className="mr-4 hover:underline md:mr-6 ">Contact</a>*/}
					{/*	</li>*/}
					{/*</ul>*/}
					<ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
						<li className="items-center flex">
							<a href="#" className="mr-2 hover:underline md:mr-4"><AiFillFacebook className="text-2xl" /></a>
						</li>
						<li className="items-center flex">
							<a href="#" className="mr-2 hover:underline md:mr-4 "><AiFillTwitterSquare className="text-2xl" /></a>
						</li>
						<li className="items-center flex">
							<a href="#" className="mr-2 hover:underline md:mr-4 "><AiFillInstagram className="text-2xl" /></a>
						</li>
						<li className="items-center flex">
							<a href="#" className="mr-2 hover:underline md:mr-4 "><AiFillLinkedin className="text-2xl" /></a>
						</li>
					</ul>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
				<span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a
					href="https://flowbite.com/" className="hover:underline">Arti™</a>. All Rights Reserved.</span>
			</div>
		</footer>


	)
}
