import {ChatGPTMessageObj} from '@/constants/artibotData';
import axios from 'axios';

export class MessageService {

	async send(messages: ChatGPTMessageObj[]) {
		try {
			const response = await axios.post('/api/chat-gpt/send', {messages});
			return response.data;
		} catch (e) {
			console.log('Error in sending the message - ', e);
		}
	}
}
