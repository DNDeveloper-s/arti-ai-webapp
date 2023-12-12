import React, {FC, useEffect, useRef, useState} from 'react';
import {PiCaretRightBold} from 'react-icons/pi';
import Image from 'next/image';
import {SlOptions} from 'react-icons/sl';
import useMousePos from '@/hooks/useMousePos';

interface TestimonialsProps {

}

const Testimonial = {
	AdCreative: function() {
		const artiCardRef = useRef<HTMLDivElement>(null);
		const mousePos = useMousePos(artiCardRef);

		return (
			<div className="arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default" ref={artiCardRef} style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
				<div className="p-3 relative h-full bg-gray-950 w-64 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
					{/* Head Section */}
					<div className="group-hover:max-h-[300px] max-h-0 overflow-hidden transition-all">
						<div className={"flex justify-between items-center mb-1 pt-1"}>
							<div className="flex items-center gap-1">
								<div className="w-5 h-5 rounded-full bg-gray-700" />
								<div>
									<div className="w-12 h-2 mb-1 rounded bg-gray-700" />
									<div className="w-16 h-2 rounded bg-gray-700" />
								</div>
							</div>
							<SlOptions className="text-xs" />
						</div>
						<div className="mb-3">
							<span className="text-[0.7em] inline-flex leading-[1.3em]">Unlock the full potential of your crops with our smart irrigation systems. Optimize water usage, enhance crop health, and achieve maximum yield. Visit our website to learn more!</span>
						</div>
					</div>

					<div className='overflow-hidden rounded w-full h-auto'>
						<Image width={640} height={640} src="https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png" alt="Image" />
					</div>
					{/*<h3 className={"text-xs font-medium text-gray-100 mt-3"}>Empower Your Farming with Precision Technology</h3>*/}
					<div className={"flex justify-between gap-2 items-center mt-3"}>
						<span className={"text-[0.75em] leading-[1.35em]"}>Empower Your Farming with Precision Technology</span>
						<div className="flex-shrink-0">
							<span className="cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.55em]">Learn More</span>
						</div>
					</div>
					<div className="group-hover:max-h-[100px] max-h-0 overflow-hidden transition-all">
						<hr className="h-px my-2 border-0 bg-gray-700"/>
						<div className="w-full flex justify-between">
							<div className="ml-2 w-9 h-3 rounded-[3px] bg-gray-700" />
							<div className="w-9 h-3 rounded-[3px] bg-gray-700" />
							<div className="w-9 h-3 rounded-[3px] bg-gray-700" />
							<div className="w-3 h-3 rounded-full bg-gray-700" />
						</div>
					</div>
				</div>
			</div>
		)
	},
	Review: function() {
		const artiCardRef = useRef<HTMLDivElement>(null);
		const mousePos = useMousePos(artiCardRef);

		return (
			<div className="arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default" ref={artiCardRef} style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
				<div className="p-3 relative flex h-[150px] flex-col justify-between bg-gray-950 w-64 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
					{/* Head Section */}
					<div>
						<span className="text-[0.85em]">Explained very nicely and in easy way and also becomes easy to remember after seeing videos</span>
					</div>
					<div>
						<span className="text-[0.9em]">@Maa Moni</span>
					</div>
				</div>
			</div>
		)
	}
}

const Testimonials: FC<TestimonialsProps> = (props) => {
	return (
		<div className="pt-10 pb-20">
			<div className="flex flex-col items-center justify-center">
				<h4 className="inline-flex font-medium bg-clip-text !text-transparent bg-gradient-to-r from-[#ed02eb] to-[#dcd6fe] pb-3">Experience the Evolution of Our Ad Creatives</h4>
				<h2 className="text-4xl font-medium bg-clip-text !text-transparent bg-gradient-to-r from-gray-200/60 via-gray-200 to-gray-200/60 pb-4">Bringing Innovation to Advertising</h2>
			</div>
			<div className="h-[372px] relative z-[5] mt-[40px] flex items-center">
				<div className="flex gap-5 w-full items-center mask-black">
					{/*<div className="flex gap-5 items-center">*/}
					<div className="flex gap-5 items-center testimonial-animation-creative">
						<Testimonial.AdCreative />
						<Testimonial.AdCreative />
						<Testimonial.AdCreative />
						<Testimonial.AdCreative />
						<Testimonial.AdCreative />
						<Testimonial.AdCreative />
						<div className="flex gap-5 items-center">
							<Testimonial.AdCreative />
							<Testimonial.AdCreative />
							<Testimonial.AdCreative />
							<Testimonial.AdCreative />
							<Testimonial.AdCreative />
							<Testimonial.AdCreative />
						</div>
					</div>
				</div>
			</div>
			<div className="h-[250px] flex items-center">
				<div className="flex gap-5 w-full items-center mask-black">
					{/*<div className="flex gap-5 items-center">*/}
					<div className="flex gap-5 items-center testimonial-animation-review">
						<Testimonial.Review />
						<Testimonial.Review />
						<Testimonial.Review />
						<Testimonial.Review />
						<Testimonial.Review />
						<Testimonial.Review />
						<div className="flex gap-5 items-center">
							<Testimonial.Review />
							<Testimonial.Review />
							<Testimonial.Review />
							<Testimonial.Review />
							<Testimonial.Review />
							<Testimonial.Review />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Testimonials;
