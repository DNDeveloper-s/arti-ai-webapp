import React, {FC, ReactElement} from 'react';
import {CloseIcon} from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import {
	AiFillEdit,
	AiFillEye,
	AiFillEyeInvisible,
	AiFillFolder,
	AiOutlineCaretRight
} from 'react-icons/ai';
import {RiGalleryLine} from 'react-icons/ri';
import {MdArticle} from 'react-icons/md';
import {BiBuildingHouse, BiRename, BiSolidCategory, BiTargetLock} from 'react-icons/bi';
import {FaCalendarDays, FaCreditCard} from 'react-icons/fa6';
import {HiMiniBuildingOffice, HiMiniUsers} from 'react-icons/hi2';
import {PiDesktopTower} from 'react-icons/pi';

interface InputItem {
	id: string;
	label: string;
	Icon: ReactElement;
	value: string;
	isList?: boolean;
}

const inputItems: Record<'stepOne' | 'stepTwo' | 'stepThree', InputItem[]> = {
	stepOne: [
		{id: '1', label: 'Campaign Details', Icon: BiBuildingHouse, value: 'Auction Awareness'},
		{id: '2', label: 'Campaign Name', Icon: BiRename, value: 'New Awareness Campaign'},
		{id: '3', label: 'Special Ad Category', Icon: BiSolidCategory, value: 'None'},
		{id: '4', label: 'Budget', Icon: FaCreditCard, value: '$2.50 USD per day, Highest Volume'},
	],
	stepTwo: [
		{id: '5', label: 'Ad Set Name', Icon: HiMiniBuildingOffice, value: 'New Awareness Ad Set'},
		{id: '6', label: 'Conversion', Icon: BiTargetLock, value: 'Facebook Page'},
		{id: '7', label: 'Schedule', Icon: FaCalendarDays, value: 'Jan 11, 2024 - ongoing'},
		{id: '8', label: 'Audience', Icon: HiMiniUsers, value: 'All, ages 18+ include the locations.'},
		{id: '9', label: 'Placements', Icon: PiDesktopTower, value: 'Advantage + Placements'},
	],
	stepThree: [
		{id: '10', label: 'Ad Name', Icon: BiBuildingHouse, value: 'New Awareness Ad'},
		{id: '11', label: 'Identity', Icon: BiBuildingHouse, value: 'Arti AI'},
		{id: '12', label: 'Ad Setup', Icon: BiBuildingHouse, value: 'Single image or video'},
		{id: '13', label: 'Ad Creative', Icon: BiBuildingHouse, value: [], isList: true},
	]
}

const AdCampaignInput = ({label, value, Icon}) => {
	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-4">
				<Icon style={{fontSize: '28px'}} />
				<div className="flex flex-col justify-center">
					<span>{label}</span>
					<span className="mt-0.5 text-xs text-gray-100">{value}</span>
				</div>
			</div>
			<AiFillEdit style={{fontSize: '20px'}} />
		</div>
	)
}

const StepTabItem = ({title, Icon, isActive, onClick}: {title: string, Icon: ReactElement, isActive: boolean, onClick: () => {}}) => {
	return (
		<div onClick={onClick} className={'flex gap-1 px-4 py-2 items-center rounded cursor-pointer ' + (isActive ? ' bg-primary bg-opacity-50 rounded text-primary' : '')}>
			<Icon />
			<span>{title}</span>
		</div>
	)
}

interface AdCampaignStepOneProps {

}
interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	label: string;
	onClick: () => void;
	className: string;
	variant: 'primary' | 'secondary'
}
interface AdCampaignWrapperProps {
	buttonProps: ButtonProps[];
	children: React.ReactNode;
	activeStep: number;
	handleStep: (step: number) => void;
}
const getButtonStyles = (variant: string) => {
	if(variant === 'primary') {
		return 'bg-primary text-white';
	}
	return 'bg-gray-600 text-white';
}
const AdCampaignWrapper: AdCampaignWrapperProps = ({buttonProps, children, activeStep, handleStep}) => {
	return (
		<div className={"divide-y divide-slate-600 flex flex-col justify-between h-full overflow-hidden w-full"}>
			<div className="flex px-3 items-center justify-between my-5">
				<CloseIcon />
				<span>Awareness Campaign</span>
				{/*<AiFillEyeInvisible />*/}
				<AiFillEye />
			</div>
			<div className="flex-1 overflow-hidden flex flex-col">
				<div className="flex my-3 gap-1 items-center">
					<StepTabItem title={'Campaign'} Icon={AiFillFolder} isActive={activeStep === 0} onClick={() => handleStep(0)} />
					<AiOutlineCaretRight />
					<StepTabItem title={'Ad set'} Icon={RiGalleryLine} isActive={activeStep === 1} onClick={() => handleStep(1)} />
					<AiOutlineCaretRight />
					<StepTabItem title={'Ad'} Icon={MdArticle} isActive={activeStep === 2} onClick={() => handleStep(2)} />
				</div>
				<div className="overflow-auto flex flex-col gap-4 py-3 px-3">
					{children}
				</div>
			</div>

			<div className="flex items-center gap-3 px-2 h-[60px]">
				{buttonProps.map(button => (
					<button key={button.label} className={"text-center h-[40px] flex-1 mx-auto block rounded " + getButtonStyles(button.variant)}>{button.label}</button>
				))}
				{/*<button className="text-center h-[40px] flex-1 mx-auto block rounded">Next</button>*/}
			</div>
		</div>
	)
}

const AdCampaignStepOne: FC<AdCampaignStepOneProps> = (props) => {
	const [activeStep, setActiveStep] = React.useState(0);

	return (
		<AdCampaignWrapper buttonProps={[{label: 'Next', variant: 'primary'}]} activeStep={activeStep} handleStep={setActiveStep}>
			{inputItems.stepOne.map(item => <AdCampaignInput key={item.id} label={item.label} value={item.value} Icon={item.Icon} />)}
		</AdCampaignWrapper>
	)
};

const AdCampaignStepTwo: FC<AdCampaignStepOneProps> = (props) => {
	const [activeStep, setActiveStep] = React.useState(1);

	return (
		<AdCampaignWrapper buttonProps={[{label: 'Previous', variant: 'secondary'}, {label: 'Next', variant: 'primary'}]} activeStep={activeStep} handleStep={setActiveStep}>
			{inputItems.stepTwo.map(item => <AdCampaignInput key={item.id} label={item.label} value={item.value} Icon={item.Icon} />)}
		</AdCampaignWrapper>
	)
};

const AdCampaignStepThree: FC<AdCampaignStepOneProps> = (props) => {
	const [activeStep, setActiveStep] = React.useState(2);

	return (
		<AdCampaignWrapper buttonProps={[{label: 'Previous', variant: 'secondary'}, {label: 'Review', variant: 'primary'}]} activeStep={activeStep} handleStep={setActiveStep}>
			{inputItems.stepThree.map(item => <AdCampaignInput key={item.id} label={item.label} value={item.value} Icon={item.Icon} />)}
		</AdCampaignWrapper>
	)
};

export default AdCampaignStepTwo;


export const AdCampaign = {
	Wrapper: AdCampaignWrapper,
	StepOne: AdCampaignStepOne
}
