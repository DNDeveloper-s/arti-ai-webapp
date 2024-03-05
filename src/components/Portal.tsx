'use client'

import {FC, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

interface PortalProps {
	children: React.ReactNode;
	id?: 'myportal' | 'canvastoolsportal' | 'contextmenuportal';
}
 
const Portal: FC<PortalProps> = ({children, id = 'myportal'}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, [])

	return mounted
		? createPortal(<>{children}</>, document.getElementById(id))
		: null;
}

export default Portal;
