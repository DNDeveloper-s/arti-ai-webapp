'use client';

import React, {FC} from 'react';
import {MdArrowBackIos} from 'react-icons/md';
import Link from 'next/link';
import Logo from '@/components/Logo';
import MessageContainer from '@/components/ArtiBot/MessageContainer';
import GetAdButton from '@/components/ArtiBot/GetAdButton';
import FileItem from '@/components/ArtiBot/MessageItems/FileItem';
import TextareaAutosize from 'react-textarea-autosize';
import {colors} from '@/config/theme';
import {motion} from 'framer-motion';
import {framerContainer, framerItem} from '@/config/framer-motion';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import Lottie from 'lottie-react';
import typingAnimation from '@/assets/lottie/typing.json';
import {ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import ChatGPTMessageItem from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import Image from 'next/image';
import WavingHand from '@/assets/images/waving-hand.webp';
import {useRouter, useSearchParams} from 'next/navigation';
import CTAButton from '@/components/CTAButton';
import AdCreativeIcon from '@/components/shared/icons/AdCreativeIcon';
import StrategyIcon from '@/components/shared/icons/StrategyIcon';
import ArtiBotPage from '@/components/ArtiBotPage';
import Modal from '@/components/Modal';
import {AiOutlineInfoCircle} from 'react-icons/ai';

interface AskConversationTypeProps {

}

const BotsInfo = () => {
	return (
		<div className="w-full max-w-[900px] mx-auto px-3 items-center mb-3 font-diatype">
			<div>
				<ol className="list-decimal pl-3">
					<li>
						<h2 className="font-semibold text-white mt-1 mb-0.5 text-base text-opacity-70 font-diatype">Ad Creative Bot 🎨</h2>
						<p className="text-sm text-white text-opacity-60">If you need a captivating Facebook Ad or an eye-catching billboard campaign.</p>
					</li>
					<li>
						<h2 className="font-semibold text-white mt-2 mb-0.5 text-base text-opacity-70 font-diatype">Strategy Bot 📈</h2>
						<p className="text-sm text-white text-opacity-60">If you're looking for insights into your business, market trends, or digital transformation strategies.</p>
					</li>
				</ol>
				{/*<p className="text-sm text-white text-opacity-60 font-light mt-4 font-diatype">Please tap on your choice to initiate a conversation. You can always return to this screen to choose the other bot for a different conversation. Let's create memorable ads and strategize for success!</p>*/}
			</div>
		</div>
	)
}

const AskConversationType: FC<AskConversationTypeProps> = (props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const hasConversationTypeParam = searchParams.get('conversation_type');
	const [projectName, setProjectName] = React.useState<string>('');

	if(hasConversationTypeParam) {
		return <ArtiBotPage projectName={projectName} />
	}

	return (
		<div className={`flex h-screen overflow-hidden`}>
			<div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'}>
				<div className="flex justify-between h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
					<div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
						<MdArrowBackIos style={{fontSize: '21px'}}/>
						<span className="ml-0.5 -mb-0.5 text-white text-opacity-60">Dashboard</span>
					</div>
					<Link href="/" className="flex justify-center items-center">
						<Logo width={35} className="mr-2" height={35} />
						<h3 className="text-lg">Arti AI</h3>
					</Link>
					<div className="flex items-center opacity-0 pointer-events-none">
						<MdArrowBackIos/>
						<span className="text-white text-opacity-50">Dashboard</span>
					</div>
				</div>
				<Modal PaperProps={{className: 'rounded-lg'}} setOpen={() => {}} open={true}>
					<>
						<div className={'flex-1 h-[20rem] p-5 flex flex-col overflow-auto'}>
							<div className="w-full flex justify-between items-center pb-3 py-1">
								<div className="flex items-center gap-1">
									<MdArrowBackIos onClick={() => router.push('/')} style={{fontSize: '18px', cursor: 'pointer'}}/>
									<h2>Bot Choice & Business Info</h2>
								</div>
								<div className="group relative flex items-center cursor-pointer justify-center">
									<AiOutlineInfoCircle />
									<div className="transition-all shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute rounded top-[130%] min-w-[350px] right-0 bg-black border border-gray-800 p-1">
										<BotsInfo />
									</div>
								</div>
							</div>
							<hr className="border-gray-500"/>
							<div className="my-3">
								<label className="text-sm text-secondaryText" htmlFor="">Business Name<span className="text-red-600">*</span></label>
								<input value={projectName} onChange={e => setProjectName(e.target.value)} required={true} type={'text'} className={'w-full mt-1 bg-secondaryText bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all'} />
							</div>
							<div className="flex-1" />
							<div className="w-full flex gap-5 my-5 justify-center items-center">
								<Link href={'/artibot?conversation_type=ad_creative'}>
									<CTAButton className="py-3 rounded-lg flex gap-3 items-center text-sm bg-transparent border-2 border-primary">
										<>
											<div className="w-6">
												<AdCreativeIcon fill={colors.primary} />
											</div>
											<span className="text-primary">Ad Creative Bot</span>
										</>
									</CTAButton>
								</Link>
								<Link href={'/artibot?conversation_type=strategy'}>
									<CTAButton className="py-3 rounded-lg flex gap-3 items-center text-sm bg-transparent border-2 border-primary">
										<>
											<div className="w-6">
												<StrategyIcon fill={colors.primary} />
											</div>
											<span className="text-primary">Strategy Bot</span>
										</>
									</CTAButton>
								</Link>
							</div>
						</div>
					</>
				</Modal>
				<div className={'flex-1 flex flex-col-reverse overflow-auto'}>
					<div />
					<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center mb-3">
						<div className="h-0.5 mr-5 flex-1 bg-gray-800" />
						<div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
							<span>Hey</span>
							<Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
							<span>, How can Arti Ai help you?</span>
						</div>
						<div className="h-0.5 ml-5 flex-1 bg-gray-800" />
					</div>
				</div>
				<div className="blur-sm pointer-events-none flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground">
					<div className="flex-1 relative rounded-xl bg-background h-[70%] mb-1 mx-3">
						<TextareaAutosize
							minRows={1}
							maxRows={3}
							placeholder="Type here..."
							className="outline-none caret-primary placeholder-gray-500 resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-6 absolute bottom-0"
						/>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={19}
						height={19}
						fill={colors.primary}
						className="mb-[1.25rem] cursor-pointer"
					>
						<path
							d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default AskConversationType;
