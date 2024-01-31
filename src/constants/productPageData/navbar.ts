import {isProduction} from '@/helpers';
import {CaseStudy} from '@/constants/landingPageData';

export const navbarData = {
	navItems: [
		{
			id: '1',
			href: '/#home',
			label: 'Home'
		},{
			id: '2',
			href: '/#services',
			label: 'Services'
		},{
			id: '3',
			href: '/#why-us',
			label: 'Why Us'
		},{
			id: '4',
			href: '/#case-studies',
			label: 'Case Studies',
			children: [
				{id: '31', href: `/case-study/${CaseStudy.MIDTOWN_EAST}`, label: 'Midtown East'},
				{id: '32', href: `/case-study/${CaseStudy.AMPLIFIED_EMS}`, label: 'Amplified EMS'},
				{id: '33', href: `/case-study/${CaseStudy.ANT_STREET_WEAR}`, label: 'AnT Street Wear'},
			]
		},
	],
	cta: {
		href: isProduction ? '/#contact' : '/auth',
		label: isProduction ? 'Contact Us' : 'Sign In'
	}
}
