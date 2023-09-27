import {useEffect, useState} from 'react';

export default function useMounted() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		() => {
			setMounted(false);
		}
	}, [])

	return mounted;
}
