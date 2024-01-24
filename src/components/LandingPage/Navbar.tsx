import Logo from '@/components/Logo';
import NavMenuItems from '@/components/ProductPage/NavMenuItems';
import {navbarData} from '@/constants/landingPageData';

export default function Navbar() {

	return (

		<nav className="font-diatype fixed w-full top-0 left-0 bg-background z-30">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
				<Logo style={{opacity: 0}} asLink={true} />
				<NavMenuItems data={navbarData} />
			</div>
		</nav>

)
}
