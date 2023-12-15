import React, {FC} from 'react';

interface ScreenImageProps {

}

const ScreenSVG: FC<ScreenImageProps> = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={43} height={54} {...props}>
			<g fillRule="evenodd">
				<path fill="none" d="M0 0h43v54H0z" />
				<path
					fillRule="nonzero"
					d="M41.5 14h-40A1.5 1.5 0 0 0 0 15.5v26A1.5 1.5 0 0 0 1.5 43h40a1.5 1.5 0 0 0 1.5-1.5v-26a1.5 1.5 0 0 0-1.5-1.5zM27 43.5V50H16v-6.5zM42 15v23H1V15z"
				/>
			</g>
		</svg>
	);
};

export default ScreenSVG;
