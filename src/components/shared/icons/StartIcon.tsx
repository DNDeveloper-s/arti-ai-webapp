import React, {FC} from 'react';

interface StartIconProps {

}

const StartIcon: FC<StartIconProps> = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlSpace="preserve"
			viewBox="0 0 64 64"
			{...props}
		>
			<path
				fillRule="evenodd"
				d="M52.5 24.1 18.1 6.7c-2.7-1.5-6-1.5-8.6 0-2.6 1.8-4.1 4.8-3.8 8v34.6c-.2 3.2 1.2 6.2 3.8 8 1.2.7 2.6 1.1 3.9 1.1 1.6 0 3.2-.4 4.7-1.2l34.4-17.4c5.1-2.7 5.8-6 5.8-7.8.1-1.7-.7-5.3-5.8-7.9zM15.7 52.4 50.1 35c1.8-.9 2.9-2.1 2.9-3s-1.1-2.1-2.9-3L15.6 11.5c-.7-.4-1.5-.6-2.3-.6-.4 0-.7.1-1.1.3-1 .8-1.4 2.1-1.3 3.4v34.8c-.2 1.3.3 2.5 1.3 3.4 1.2.4 2.5.3 3.5-.4z"
				clipRule="evenodd"
				data-original="#000000"
			/>
		</svg>
	);
};

export default StartIcon;
