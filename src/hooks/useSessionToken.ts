'use client';

import {useSession} from 'next-auth/react';
import {useLayoutEffect} from 'react';

export default function useSessionToken() {
	const session = useSession();

	useLayoutEffect(() => {
		if(session?.data?.user?.token?.accessToken) {
			localStorage.setItem('token', session?.data?.user?.token?.accessToken);
		} else {
			localStorage.removeItem('token');
		}
	}, [session])

	return session?.data?.user?.token?.accessToken ?? null;
}
