import React from 'react';

export default function BgAttachment() {

	return (
		<div data-groupid={"landing-section"} data-section="bg_attachment" className="w-screen h-[60vh] min-h-[500px]" style={{
			backgroundImage: 'url(/assets/images/bg_image1.png)',
			backgroundSize: 'cover',
			backgroundAttachment: 'fixed',
			backgroundPosition: 'center center'
		}} />
	)
}
