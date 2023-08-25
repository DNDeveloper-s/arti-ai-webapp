import React from 'react';
import Image from 'next/image';
import {SlOptionsVertical} from 'react-icons/sl';
import {AiFillPlusCircle} from 'react-icons/ai';
import {BsFillFileEarmarkFill} from 'react-icons/bs';
import {colors} from '@/config/theme';

export default function ArtiBot() {

	return (
		<div className="bg-secondaryText bg-opacity-20 flex flex-col font-diatype">
			<div className="flex justify-between h-16 py-2 px-6 box-border items-center bg-primary bg-opacity-10">
				<div className="flex items-center">
					<Image width={40} height={40} className="rounded-full mr-4" src="https://ui-avatars.com/api/?name=Arti+Bot&size=64&background=random&rounded=true" alt=""/>
					<h3 className="text-lg">Arti Bot</h3>
				</div>
				<div>
					<SlOptionsVertical />
				</div>
			</div>
			<div className="flex-1 flex flex-col-reverse">
				<div className="flex items-start px-5 py-4">
					<Image className="rounded-full mr-1" width={45} height={45} src="https://ui-avatars.com/api/?name=Arti+Bot&size=128&background=random&rounded=true" alt=""/>
					<div className="ml-3">
						<div className="flex items-center mb-2">
							<h4 className="text-lg mr-5">Arti Bot</h4>
							<span className="text-xs text-secondaryText">10/06/2023 6:25 PM</span>
						</div>
						<div>
							<p className="text-md text-primaryText opacity-60">
								The chat will support a conversation between a user and an AI powered chatbot. For each user message sent, we make an API call to the chatbot to generate the response. At a high level, the chat should support following functionalities:
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-start px-5 py-4">
					<Image className="rounded-full mr-1" width={45} height={45} src="https://ui-avatars.com/api/?name=Saurabh+Singh&size=128&background=random&rounded=true" alt=""/>
					<div className="ml-3">
						<div className="flex items-center mb-2">
							<h4 className="text-lg mr-5">Saurabh Singh</h4>
							<span className="text-xs text-secondaryText">10/06/2023 6:25 PM</span>
						</div>
						<div>
							<p className="text-md text-primaryText opacity-60">
								Hello there, Tell me something more about it.
							</p>
							<p className="text-md text-primaryText opacity-60">Can we spend more time on it?</p>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full h-[4.5rem] items-center px-3 bg-primary bg-opacity-10">
				<AiFillPlusCircle className="text-2xl mr-2" />
				<BsFillFileEarmarkFill className="text-xl" />
				<div className="flex-1 rounded-full bg-background h-[70%] mx-3">
					<input type="text" className="outline-none active:outline-none bg-transparent w-full h-full p-3 px-6" placeholder="Type here..."/>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={19}
					height={19}
					fill={colors.primaryText}
				>
					<path
						d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
					/>
				</svg>
			</div>
		</div>
	)
}
