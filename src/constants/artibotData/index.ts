import {IconType} from 'react-icons';
import {FEEDBACK, FeedBackKeyProperty} from '@/interfaces/IAdCreative';
import {ArtiBotData} from '@/interfaces/IArtiBot';


export const artiBotData: ArtiBotData = {
	tabItems: [{
		id: 'Facebook',
		label: 'Ad Variant #1',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'YouTube',
		label: 'Ad Variant #2',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'Google',
		label: 'Ad Variant #3',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'LinkedIn',
		label: 'Ad Variant #4',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'Instagram',
		label: 'Ad Variant #5',
		// icon: FaYoutube,
		color: '#CD201F'
	}],
	feedBackKeys: [{
		id: FEEDBACK.ONE_LINER,
		label: 'One liner'
	},{
		id: FEEDBACK.AD_ORIENTATION,
		label: 'Ad Orientation'
	}, {
		id: FEEDBACK.IMAGE_DESCRIPTION,
		label: 'Image Description'
	}, {
		id: FEEDBACK.RATIONALE,
		label: 'Rationale'
	}, {
		id: FEEDBACK.AD_VARIANT_IMAGE,
		label: 'Ad Variant Image'
	}, {
		id: FEEDBACK.IMAGE_TEXT,
		label: 'Image text'
	}]
}
