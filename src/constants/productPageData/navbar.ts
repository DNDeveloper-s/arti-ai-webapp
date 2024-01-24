import {isProduction} from '@/helpers';

export const navbarData = {
	navItems: [
		{
			id: '1',
			href: '/#home',
			label: 'Home'
		},{
			id: '2',
			href: '#product-overview',
			label: 'Services'
		},{
			id: '3',
			href: '#why-us',
			label: 'Why Us'
		},{
			id: '4',
			href: '#contact',
			label: 'Contact'
		},
	],
	cta: {
		href: isProduction ? '/#contact' : '/auth',
		label: isProduction ? 'Contact Us' : 'Sign In'
	}
}
