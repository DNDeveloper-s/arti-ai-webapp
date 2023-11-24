'use client'

import {useEffect, useState} from 'react';
import ObjectID from 'bson-objectid';

export default function useAnalyticsClient() {
	const [clientId, setClientId] = useState<string | null>(null);

	useEffect(() => {
		let clientIdentifier = localStorage.getItem('client_identifier');
		if(!clientIdentifier) {
			clientIdentifier = ObjectID().toString();
			localStorage.setItem('client_identifier', clientIdentifier);
		}
		setClientId(clientIdentifier);
	}, [])

	return { clientId };
}
