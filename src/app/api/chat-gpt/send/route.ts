import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {ChatGPTMessageObj} from '@/constants/artibotData';
import {freeTierLimit} from '@/constants';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const messagesArr = body.messages as ChatGPTMessageObj[];

		// Right now, assuming the user is not registered
		const isDataExhausted = messagesArr.length >= freeTierLimit;
		if(isDataExhausted) return NextResponse.json({ok: false, error: 'You have exhausted the free tier limit. i.e, ' + freeTierLimit, limitLeft: 0});

		const completion = await openai.chat.completions.create({
			messages: messagesArr ?? [{ role: 'user', content: 'Say this is a test' }],
			model: 'gpt-3.5-turbo',
		});

		console.log('completion.choices - ', completion.choices);

		return NextResponse.json({ok: true, data: completion, message: 'Response received successfully!', limitLeft: freeTierLimit - messagesArr.length - 1})
	} catch(e: unknown) {
		return NextResponse.json({ok: false, error: e})
	}
}
