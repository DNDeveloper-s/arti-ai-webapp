import React, {FC, useState} from 'react';
import {signIn} from 'next-auth/react';
import Loader from '@/components/Loader';
import {GrGoogle} from 'react-icons/gr';

interface GoogleSignInButtonProps {
	label?: string;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({label}) => {
	const [googleLoading, setGoogleLoading] = useState(false);

	async function handleGoogleSignIn() {
		try {
			if(googleLoading) return;
			setGoogleLoading(true);
			const response = await signIn('google', {callbackUrl: '/'});

		} catch (e) {
			console.log('e - ', e);
		}
		setGoogleLoading(false);
	}

	return (
		<button className="w-full flex items-center h-12 justify-center mt-1 bg-[#3369E8] outline-none border-2 border-opacity-0 border-red-600 rounded-lg text-md py-2 px-3 transition-all" onClick={handleGoogleSignIn}>
			{googleLoading ? <Loader /> : <>
				<GrGoogle />
				<span className="ml-3">{label ?? "Sign in with Google"}</span>
			</>}
		</button>
	)
}

export default GoogleSignInButton;
