import {ChatGPTMessageObj} from '@/constants/artibotData';
import axios from 'axios';

export class MessageService {

	async send(messages: ChatGPTMessageObj[]) {
		try {
			// const eventSource = new EventSource("/api/chat-gpt/send", {withCredentials: true});
			// console.log('eventSource - ', eventSource);
			// eventSource.onmessage = (event) => {
			// 	console.log('event - ', event);
			// }
			// const response = await fetch('/api/chat-gpt/send', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'text/event-stream'
			// 	},
			// 	body: JSON.stringify({messages})
			// })
			// if(!response.body) return console.log('Received = No response body present');
			// const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
			// while (true) {
			// 	const {value, done} = await reader.read();
			// 	if (done) break;
			// 	console.log('Received = ', value);
			// }
			// const response = await axios.post('/api/chat-gpt/send', {messages});
			// return response.data;
			const response = await axios.post('/api/chat-gpt/send', {messages});
			return response.data;
		} catch (e) {
			console.log('Error in sending the message - ', e);
		}
	}
}
