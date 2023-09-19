import React from 'react';
import {ChatGPTMessageItem} from '@/components/ArtiBot/ArtiBot';
import {ChatGPTMessageObj, ChatGPTRole, JSONInput} from '@/constants/artibotData';
import exampleJSON from '@/database/exampleJSON';
import AdVariant from '@/components/ArtiBot/AdVariant';

interface WelcomeSectionProps {

}

const WelcomeSection:React.FC<WelcomeSectionProps> = (props) => {

	return (
		<div className="w-full pt-12 pb-16">
			<h2 className="text-3xl text-white text-opacity-70 font-light mb-6">Welcome Saurabh,</h2>
			<div className="w-full rounded-lg h-32 bg-secondaryBackground">

			</div>
		</div>
	)
}

export default WelcomeSection;
