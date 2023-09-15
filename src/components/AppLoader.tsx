import Logo from '@/components/Logo';
import React from 'react';

export default function AppLoader() {

	return (
		<div className="w-screen fixed bg-background z-30 h-screen top-0 left-0 flex items-center justify-center">
			<Logo width={40} height={40} />
		</div>
	)
}
