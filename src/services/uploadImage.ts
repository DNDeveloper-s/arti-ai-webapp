import {ROUTES} from '@/config/api-config';
import { blobUrlToBlobObject } from '@/utils/transformers';

export default async function uploadImage(_file: any, name: string = Date.now().toString()) {
	let file = _file;
	if(_file instanceof FileList) {
		file = _file[0];
	}
	if(typeof _file === 'string' && _file.startsWith('blob:')) {
		file = await blobUrlToBlobObject(_file);
		file = new File([file], name, {type: 'image/png'});
	}
	if(!file) {
		throw new Error('No file provided');
	}
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
