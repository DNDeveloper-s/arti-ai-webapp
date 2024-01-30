'use client';

import React, {FC} from 'react';
import CaseStudyPage from '@/components/CaseStudyPage/CaseStudyPage';
import {redirect, useParams} from 'next/navigation';
import {caseStudiesData} from '@/constants/landingPageData';

interface PageProps {

}

const Page: FC<PageProps> = (props) => {
	const params = useParams();

	const caseStudyItem = caseStudiesData.items.find(item => item.id === params.case_study);

	if(!caseStudyItem) return redirect('/');

	return (
		<div>
			<CaseStudyPage caseStudyItem={caseStudyItem} />
		</div>
	)
};

export default Page;
