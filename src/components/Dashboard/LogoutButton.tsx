'use client';

import {signOut} from 'next-auth/react';

export default function LogoutButton({children}) {

	return (
		<div onClick={() => signOut()}>
			{children}
		</div>
	)
}
