import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import {ChatGPTMessageObj} from '@/constants/artibotData';
import {freeTierLimit} from '@/constants';
import { ServerResponse } from 'http';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request, res: NextResponse) {
	try {
		// const is = ServerResponse.isPrototypeOf(res)
		// const resp = new ServerResponse(req);
		//
		// resp.setHeader('Content-Type', 'text/event-stream');
		// resp.setHeader('Cache-Control', 'no-cache');
		// resp.setHeader('Connection', 'keep-alive');
		//
		// resp.write('data: Connection Established\n\n');

		const body = await req.json();
		const messagesArr = body.messages as ChatGPTMessageObj[];
		// const messagesArr = [{ role: 'user', content: 'Say this is a test' }]

		// console.log('body - ', body);

		// Right now, assuming the user is not registered
		const isDataExhausted = messagesArr.length >= freeTierLimit;
		if(isDataExhausted) return NextResponse.json({ok: false, error: 'You have exhausted the free tier limit. i.e, ' + freeTierLimit, limitLeft: 0});

		const completion = await openai.chat.completions.create({
			messages: messagesArr ?? [{ role: 'user', content: 'Say this is a test' }],
			model: 'gpt-3.5-turbo',
			// stream: true
		});

		// for await(const chunk of completion) {
		// 	console.log('chunk - ', chunk);
		// 	if(chunk.choices.at(-1) && chunk.choices.at(-1)?.finish_reason)  {
		// 		resp.write(JSON.stringify(chunk));
		// 		resp.end();
		// 		return resp;
		// 	}
		// 	resp.write(JSON.stringify(chunk));
		// }
		// return;

		// console.log('completion.choices - ', completion.choices);

		return NextResponse.json({ok: true, data: completion, message: 'Response received successfully!', limitLeft: freeTierLimit - messagesArr.length - 1})
	} catch(e: unknown) {
		console.log('e - ', e);
		return NextResponse.json({ok: false, error: e})
	}
}
