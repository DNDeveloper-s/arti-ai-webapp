import {ROUTES} from '@/config/api-config';

export default async function uploadImage(file: any) {
	const formData = new FormData();
	formData.append('file', file);
	try {
		const data = await fetch(ROUTES.UTIL.UPLOAD_IMAGE, {
			method: 'POST',
			body: formData,
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			}
		}).then(response => response.json());

		if(data.ok) {
			return data.data;
		}
		return null;
	} catch(e) {
		console.error(e);
		return null;
	}
}
