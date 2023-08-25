'use client'
import React from 'react';
import IdeaSvg from '@/assets/images/Idea.svg';
import Image from 'next/image';

export default function Contact() {

	return (
		<div className="text-primaryText landing-page-section font-diatypew" id="contact">
			<div className="grid gap-10 grid-cols-[1fr_500px]">
				<div>
					<h3 className="text-3xl mb-6">Contact Us</h3>
					<div className="mb-3">
						<label className="text-sm text-secondaryText" htmlFor="">Full Name</label>
						<input type="text" className="w-full mt-1 bg-secondaryText bg-opacity-25 outline-none focus:outline-none rounded-xl text-md py-2 px-3" />
					</div>
					<div className="mb-3">
						<label className="text-sm text-secondaryText" htmlFor="">Email</label>
						<input type="email" className="w-full mt-1 bg-secondaryText bg-opacity-25 outline-none focus:outline-none rounded-xl text-md py-2 px-3" />
					</div>
					<div className="mb-3">
						<label className="text-sm text-secondaryText" htmlFor="">Company</label>
						<input type="text" className="w-full mt-1 bg-secondaryText bg-opacity-25 outline-none focus:outline-none rounded-xl text-md py-2 px-3" />
					</div>
					<div className="mb-3">
						<label className="text-sm text-secondaryText" htmlFor="">Profession</label>
						<input type="text" className="w-full mt-1 bg-secondaryText bg-opacity-25 outline-none focus:outline-none rounded-xl text-md py-2 px-3" />
					</div>
					<div className="mb-3">
						<label className="text-sm text-secondaryText" htmlFor="">Idea</label>
						<textarea className="w-full mt-1 bg-secondaryText bg-opacity-25 outline-none focus:outline-none rounded-xl text-md py-2 px-3">
						</textarea>
					</div>
					<button className="cta-button w-full rounded-xl">Submit</button>
				</div>
				<div className="w-max-[300px] flex items-center">
					<Image className="h-[28rem]" src={IdeaSvg} alt={'Contact ArtiBot'} />
				</div>
			</div>
		</div>
	)
}
