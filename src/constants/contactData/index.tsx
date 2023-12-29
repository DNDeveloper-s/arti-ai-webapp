import React, {FC, ReactElement} from 'react';
import {FormObject} from '@/interfaces/Iform';

type TextAreaProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type ContactFormFieldKey = 'full_name' | 'email' | 'company' | 'profession' | 'message'
export interface ContactFormField {
	label: string;
	name: ContactFormFieldKey;
	Input: FC<ContactInputProps> | FC<ContactTextAreaProps>
}

export interface ContactInputProps extends InputProps{
	hasError: boolean
}

export interface ContactTextAreaProps extends TextAreaProps {
	hasError: boolean
}

export type ContactFormObject = FormObject<ContactFormFieldKey>;

export interface ContactData {
	formFields: ContactFormField[];
}

const formFields: ContactFormField[] = [
	{
		label: 'Full Name',
		name: 'full_name',
		Input: ({hasError, ...props}: ContactInputProps) => <input {...props} type="text" className={'w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all ' + (hasError ? 'border-opacity-100' : '')} />
	},
	{
		label: 'Email',
		name: 'email',
		Input: ({hasError, ...props}: ContactInputProps) => <input {...props} type="email" className={'w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all ' + (hasError ? 'border-opacity-100' : '')} />
	},
	{
		label: 'Company',
		name: 'company',
		Input: ({hasError, ...props}: ContactInputProps) => <input {...props} type="text" className={'w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all ' + (hasError ? 'border-opacity-100' : '')} />
	},
	{
		label: 'Profession',
		name: 'profession',
		Input: ({hasError, ...props}: ContactInputProps) => <input {...props} type="text" className={'w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all ' + (hasError ? 'border-opacity-100' : '')} />
	},
	{
		label: 'Message',
		name: 'message',
		Input: ({hasError, ...props}: ContactTextAreaProps) => <textarea {...props} className={'w-full mt-1 bg-white backdrop-blur-[3px] bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-xl text-md py-2 px-3 transition-all ' + (hasError ? 'border-opacity-100' : '')} />,
	}
];

export const contactData = {
	formFields
}
