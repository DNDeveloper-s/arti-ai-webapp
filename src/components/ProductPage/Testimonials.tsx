import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {PiCaretRightBold} from 'react-icons/pi';
import Image from 'next/image';
import {SlOptions} from 'react-icons/sl';
import useMousePos from '@/hooks/useMousePos';
import {carouselImage1, carouselImage2, carouselImage3, carouselImage4} from '@/assets/images/carousel-images';
import Modal from '@/components/Modal';
import {CloseIcon} from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import {handle} from 'mdast-util-to-markdown/lib/handle';

const testimonialsData = {
	adCreatives: [
		{
			id: '1',
			description: 'Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Get dynamic ad creatives with just a click of a button.',
			oneLiner: 'Fast, Accessible, for Everyone',
			src: carouselImage1
		},
		{
			id: '2',
			description: 'Bid farewell to knee pain with expert physical therapy services. Our tailored programs are designed to strengthen, heal, and enhance mobility. Embrace a life of movement and comfort—book your consultation today and take the first step towards a pain-free tomorrow!',
			oneLiner: 'Sign up Today!',
			src: carouselImage2
		},
		{
			id: '3',
			description: 'Don\'t let back pain keep you on the sidelines. Our expert physical therapists empower you to lift the burden of discomfort. With personalized care and cutting-edge techniques, we\'ll help you strengthen your back, improve flexibility, and reclaim your active lifestyle. Take control and elevate your well-being—start your journey to a stronger back today!',
			oneLiner: 'Say Goodbye to Back Pain',
			src: carouselImage3
		},
		{
			id: '4',
			description: 'Visualize the best version of yourself with just 20 minutes a week using our state-of-the-art EMS technology! We harness the power of electrical muscle stimulation to maximize your workouts, sculpting your physique efficiently and effectively. Say goodbye to endless hours at the gym and hello to rapid, visible results. Join the fitness revolution and experience the transformation with us – your journey to a fitter, stronger you awaits!',
			oneLiner: 'Unlock Your Potential: Transform with EMS Fitness!',
			src: carouselImage4
		}
	],
	reviews: [
		{
			id: '1',
			description: 'Arti AI has revolutionized the way I create ads! Its intuitive interface and intelligent suggestions have boosted my ad campaigns to new heights. Highly recommended!',
			author: 'Sarah, Digital Marketing Manager'
		},
		{
			id: '2',
			description: 'I was blown away by the results I achieved with Arti AI. Its advanced algorithms and creative recommendations helped me create captivating ads that converted like never before. Thank you, Arti AI!',
			author: 'John, E-commerce Entrepreneur'
		},
		{
			id: '3',
			description: 'Arti AI is a game-changer for our social media marketing efforts. With its assistance, we\'ve witnessed a significant increase in engagement and brand awareness. It\'s an essential tool for any marketer!',
			author: 'Emily, Social Media Specialist'
		},
		{
			id: '4',
			description: 'I can\'t imagine managing my ad campaigns without Arti AI anymore. Its actionable insights and easy-to-use features have saved me valuable time and improved my ad performance. A true lifesaver!',
			author: 'Alex, Freelance Marketer'
		},
		{
			id: '5',
			description: 'Arti AI has taken my advertising game to a whole new level! Its intelligent ad suggestions and data-driven approach have helped me achieve remarkable results. I\'ve never seen such impressive ROI before!',
			author: 'Mark, Marketing Director'
		},
		{
			id: '6',
			description: 'Arti AI is a must-have tool for any marketer looking to create compelling ads. Its innovative features and seamless user experience make the ad creation process a breeze. It\'s like having a team of top-notch designers and copywriters at your fingertips!',
			author: 'Jessica, Digital Advertising Specialist'
		},
		{
			id: '7',
			description: 'I\'m absolutely thrilled with the results I\'ve achieved using Arti AI. Its personalized recommendations and real-time analytics have empowered me to optimize my ad campaigns on the go, resulting in increased conversions and revenue. It\'s a game-changer!',
			author: 'Ryan, E-commerce Store Owner'
		},
		{
			id: '8',
			description: 'Arti AI is a game-changer for small businesses like mine. With its user-friendly interface and cost-effective solutions, I\'ve been able to create professional-looking ads that drive real business growth. It\'s leveled the playing field for entrepreneurs like me!',
			author: 'Lisa, Small Business Owner'
		}
	]
}

interface TestimonialsProps {
}
const Testimonial = {
	AdCreative: function({handleClose, onClick, id, description, oneLiner, src, isModal = false}) {
		const artiCardRef = useRef<HTMLDivElement>(null);
		const mousePos = useMousePos(artiCardRef);

		const classes = {
			container: {
				normal: 'arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default',
				modal: 'arti-card transition-transform flex-shrink-0 rounded-lg cursor-default'
			},
			inner: {
				normal: 'p-3 relative h-full bg-gray-950 w-64 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group',
				modal: 'p-3 relative h-full bg-gray-950 w-96 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype'
			},
			head: {
				normal: 'group-hover:max-h-[300px] max-h-0 overflow-hidden transition-all',
				modal: 'max-h-[300px]'
			},
			bottom: {
				normal: 'group-hover:max-h-[100px] max-h-0 overflow-hidden transition-all',
				modal: 'max-h-[100px]'
			},
			description: {
				normal: "text-[0.7em] leading-[1.3em] line-clamp-3",
				modal: "text-[1.1em] leading-[1.4em] line-clamp-3"
			},
			oneLiner: {
				normal: "text-[0.75em] leading-[1.35em]",
				modal: "text-[1.15em] leading-[1.7em]"
			},
			learnMore: {
				normal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.55em]",
				modal: "cursor-pointer rounded bg-gray-700 px-2 py-1 text-[0.85em]"
			}
		}

		const getClassName = (key: keyof typeof classes) => {
			if(!isModal) return classes[key].normal;
			return classes[key].modal;
		}

		return (
			<div onClick={() => onClick(id)} className={getClassName('container')} ref={artiCardRef} style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
				{/*{isModal && <div className="absolute top-2 right-3 p-1 bg-gray-200 text-white rounded-full">*/}
				{/*	<CloseIcon/>*/}
				{/*</div>}*/}
				<div className={getClassName('inner')}>
					{/* Head Section */}
					<div className={getClassName('head')}>
						<div className={"flex justify-between items-center mb-1 pt-1"}>
							<div className="flex items-center gap-1">
								<div className="w-5 h-5 rounded-full bg-gray-700" />
								<div>
									<div className="w-12 h-2 mb-1 rounded bg-gray-700" />
									<div className="w-16 h-2 rounded bg-gray-700" />
								</div>
							</div>
							{isModal ?
								<div
									onClick={() => {
										console.log('handleClose - ');
										handleClose && handleClose();
									}}
									className="cursor-pointer text-xs"
								>
									<CloseIcon />
								</div> :
							<SlOptions className="text-xs" />}
						</div>
						<div className="mt-2 mb-2">
							<span className={getClassName('description')}>{description}</span>
						</div>
					</div>

					<div className='overflow-hidden rounded w-full h-auto'>
						{/*<Image width={640} height={640} src="https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png" alt="Image" />*/}
						<Image width={640} height={640} src={src} alt="Image" />
					</div>
					{/*<h3 className={"text-xs font-medium text-gray-100 mt-3"}>Empower Your Farming with Precision Technology</h3>*/}
					<div className={"flex justify-between gap-2 items-center mt-3"}>
						<span className={getClassName('oneLiner')}>{oneLiner}</span>
						<div className="flex-shrink-0">
							<span className={getClassName('learnMore')}>Learn More</span>
						</div>
					</div>
					<div className={getClassName('bottom')}>
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
	Review: function({description, author}) {
		const artiCardRef = useRef<HTMLDivElement>(null);
		const mousePos = useMousePos(artiCardRef);

		return (
			<div className="arti-card hover:scale-x-105 transition-transform flex-shrink-0 rounded-lg cursor-default" ref={artiCardRef} style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
				<div className="p-3 pb-1 relative flex h-[150px] flex-col justify-between bg-gray-950 w-96 rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
					{/* Head Section */}
					<div>
						<p className="text-[0.85em] leading-[20px]">{description}</p>
					</div>
					<div>
						<span className="text-primary text-[0.9em]">@{author}</span>
					</div>
				</div>
			</div>
		)
	}
}

const Testimonials: FC<TestimonialsProps> = (props) => {
	const [activeAdCreativeId, setAdCreativeId] = useState<string | null>(null);
	const handleAdCreativePreview = (id: string) => {
		setAdCreativeId(id);
	}
	const activeAdCreative = useMemo(() => {
		if(!activeAdCreativeId) {
			document.body.style.overflow = 'auto';
			return null;
		}
		document.body.style.overflow = 'hidden';
		return testimonialsData.adCreatives.find(adCreative => adCreative.id === activeAdCreativeId);
	}, [activeAdCreativeId])

	const handleClose = () => setAdCreativeId(null)

	return (
		<div className="pt-10 pb-20">
			<Modal PaperProps={{className: 'bg-transparent'}} handleClose={handleClose} open={!!activeAdCreative}>
				<div>
					{activeAdCreative && <Testimonial.AdCreative handleClose={handleClose} onClick={() => null} isModal={true} key={activeAdCreative?.id} {...activeAdCreative} />}
				</div>
			</Modal>
			<div className="flex flex-col items-center justify-center">
				{/*<h4 className="inline-flex font-medium bg-clip-text !text-transparent bg-gradient-to-r from-[#ed02eb] to-[#dcd6fe] pb-3">Experience the Evolution of Our Ad Creatives</h4>*/}
				<h2 className="text-4xl px-2 text-center font-medium bg-clip-text !text-transparent bg-gradient-to-r from-gray-200/60 via-gray-200 to-gray-200/60 pb-4">Actual Ad Creatives for our customers</h2>
			</div>
			<div className="h-[372px] relative z-[5] mt-[10px] flex items-center">
				<div className="flex gap-5 w-full items-center overflow-hidden md:mask-black">
					{/*<div className="flex gap-5 items-center">*/}
					<div className={'flex gap-5 items-center testimonial-animation-creative ' + (activeAdCreative ? '![animation-play-state:paused]' : '[animation-play-state:running]')}>
						{testimonialsData.adCreatives.map(adCreative => (
							<Testimonial.AdCreative handleClose={handleClose} key={adCreative.id} onClick={handleAdCreativePreview} {...adCreative} />
						))}
						{testimonialsData.adCreatives.map(adCreative => (
							<Testimonial.AdCreative handleClose={handleClose} key={adCreative.id} onClick={handleAdCreativePreview} {...adCreative} />
						))}
						<div className="flex gap-5 items-center">
							{testimonialsData.adCreatives.map(adCreative => (
								<Testimonial.AdCreative handleClose={handleClose} key={adCreative.id} onClick={handleAdCreativePreview} {...adCreative} />
							))}
							{testimonialsData.adCreatives.map(adCreative => (
								<Testimonial.AdCreative handleClose={handleClose} key={adCreative.id} onClick={handleAdCreativePreview} {...adCreative} />
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="h-[250px] flex items-center">
				<div className="flex gap-5 w-full items-center overflow-hidden md:mask-black">
					{/*<div className="flex gap-5 items-center">*/}
					<div className="flex gap-5 items-center testimonial-animation-review">
						{testimonialsData.reviews.map(review => (
							<Testimonial.Review key={review.id} {...review} />
						))}
						{testimonialsData.reviews.map(review => (
							<Testimonial.Review key={review.id} {...review} />
						))}
						<div className="flex gap-5 items-center">
							{testimonialsData.reviews.map(review => (
								<Testimonial.Review key={review.id} {...review} />
							))}
							{testimonialsData.reviews.map(review => (
								<Testimonial.Review key={review.id} {...review} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Testimonials;
