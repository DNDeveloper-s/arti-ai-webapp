import {motion} from 'framer-motion';
import {useContext, useEffect} from 'react';
import {SnackbarContext} from '@/context/SnackbarContext';

export default function Snackbar() {
	const [snackBarData, setSnackBarData] = useContext(SnackbarContext).snackBarData;

	useEffect(() => {
		if(snackBarData) {
			let timeout = setTimeout(() => {
				setSnackBarData(null);
			}, 5000)

			return () => {
				clearTimeout(timeout);
			}
		}
	}, [setSnackBarData, snackBarData])

	const statusClasses = {
		success: 'text-green-400 bg-green-800',
		error: 'text-red-800 bg-red-50',
		warning: 'text-yellow-800 bg-yellow-50',
		info: 'text-blue-800 bg-blue-50'
	}

	const props = {
		container: {
			className: 'fixed top-20 z-50 right-5 flex items-center p-4 mb-4 shadow-4xl text-sm rounded-lg dark:bg-gray-800 ' + (snackBarData ? statusClasses[snackBarData.status] : '')
		}
	}

	return snackBarData && (
		<motion.div initial={{x: 230, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 230, opacity: 0}} className={props.container.className}
		     role="alert">
			<svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
			     fill="currentColor" viewBox="0 0 20 20">
				<path
					d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
			</svg>
			<span className="sr-only capitalize">{snackBarData.status}</span>
			<div>
				{snackBarData.message}
			</div>
		</motion.div>
	)
}
