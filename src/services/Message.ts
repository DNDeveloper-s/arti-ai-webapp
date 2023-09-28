import {ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import axios from 'axios';
import {HandleChunkArgs} from '@/components/ArtiBot/ArtiBot';

export class MessageService {

	async send(messages: ChatGPTMessageObj[], handleChunk: (a: HandleChunkArgs) => any, generate_ad?) {
		try {
			// const eventSource = new EventSource("/api/chat-gpt/send", {withCredentials: true});
			// console.log('eventSource - ', eventSource);
			// eventSource.onmessage = (event) => {
			// 	console.log('event - ', event);
			// }
			// const response = await fetch('http://localhost:8080/text-stream', {
			const response = await fetch('/api/chat-gpt/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({messages, generate_ad})
			})
			console.log('response - ', response);
			if(!response.body) return console.log('Received = No response body present');

			// Check if the response is a json or a stream
			if(response.headers.get('content-type') === 'application/json') {
				const body = await response.json();
				return handleChunk({is_ad_json: body.is_ad_json, json: body.json});
			}
			const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
			let i = 0;
			while (true) {
				const {value, done} = await reader.read();
				// console.log('Received = ', value, done);
				handleChunk({chunk: value, done, index: i});
				i++;
				if (done) break;
			}
			if(response.status === 200) return {ok: true}
			return {ok: false}
			// const response = await axios.post('/api/chat-gpt/send', {messages});
			// return response.data;
			// const response = await axios.post('/api/chat-gpt/send', {messages});
			// return response.data;
		} catch (e) {
			console.log('Error in sending the message - ', e);
		}
	}
}
