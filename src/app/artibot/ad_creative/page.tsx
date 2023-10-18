import React, {FC} from 'react';
import {redirect} from 'next/navigation';

interface PageProps {

}

const Page: FC<PageProps> = (props) => {
	return redirect('/');
};

export default Page;
