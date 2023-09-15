'use client';
import React, {useState} from 'react';
import Logo from '@/components/Logo';
import Image from 'next/image';
import {GrGoogle} from 'react-icons/gr';
import Loader from '@/components/Loader';
import {signIn} from 'next-auth/react';

function GoogleSignInButton() {
	const [googleLoading, setGoogleLoading] = useState(false);

	async function handleGoogleSignIn() {
		try {
			if(googleLoading) return;
			setGoogleLoading(true);
			const response = await signIn('google', {callbackUrl: '/'});
			console.log('response - ', response);
		} catch (e) {
			console.log('e - ', e);
		}
		setGoogleLoading(false);
	}

	return (
		<button className="w-full flex items-center h-12 justify-center mt-1 bg-[#3369E8] outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all" onClick={handleGoogleSignIn}>
			{googleLoading ? <Loader /> : <>
				<GrGoogle />
				<span className="ml-3">Sign in with Google</span>
			</>}
		</button>
	)
}

export default function Auth() {

	const formFields = [{
		id: '1',
		label: 'Email',
		name: 'email'
	}, {
		id: '2',
		label: 'Password',
		name: 'password'
	}]

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="w-screen max-w-[300px]">
				<div className="flex flex-col items-center justify-center">
					<Logo asLink width={50} height={50} />
					<h1 className="text-xl font-diatype mt-3 mb-4">Sign in to Arti AI</h1>
				</div>
				{formFields.map(formField => (
					<div key={formField.name} className="mb-3">
						<label className="text-sm text-secondaryText" htmlFor="">{formField.label} <span className="text-red-600">*</span></label>
						<input type="email" className={'w-full mt-1 bg-secondaryText bg-opacity-25 outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all ' + (false ? 'border-opacity-100' : '')} />
					</div>
				))}
				<button className="w-full mt-6 flex items-center h-12 justify-center bg-primary outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all">
					<span className="ml-3">Submit</span>
					{/*<Loader style={{scale: 0.7}} />*/}
				</button>
				<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-8">
					<div className="h-0.5 mr-5 flex-1 bg-gray-800" />
					<div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
						<span>OR</span>
					</div>
					<div className="h-0.5 ml-5 flex-1 bg-gray-800" />
				</div>
				<GoogleSignInButton />
			</div>
		</div>
	)
}
