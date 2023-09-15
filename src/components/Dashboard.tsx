import {signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';

export default function Dashboard() {
	const router = useRouter();

	function handleLogOutButton() {
		signOut();
	}

	return (
		<div>
			<p>Dashboard</p>
			<div className="flex">
				<button className="py-3 px-15 bg-blue-500 rounded-lg" onClick={() => router.push('/artibot')}>Try Arti AI Bot</button>
				<button className="py-3 px-15 bg-primary rounded-lg" onClick={handleLogOutButton}>Log out</button>
			</div>
		</div>
	)
}
