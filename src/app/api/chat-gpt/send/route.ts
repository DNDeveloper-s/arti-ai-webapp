import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import {ChatGPTMessageObj} from '@/constants/artibotData';
import {freeTierLimit} from '@/constants';
import {NextApiResponse} from 'next';
import {OpenAIStream, StreamingTextResponse} from 'ai';
import { getToken } from "next-auth/jwt"
import exampleJSON from '@/database/exampleJSON';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge';

export async function POST(req: Request, res: NextApiResponse) {
	try {
		// Get the user's session based on the request and check if the user is authenticated
		// And if the user is authenticated, then check if the user has exhausted the free tier limit
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'dndeveloper-saurabh' })

		const body = await req.json();
		const messagesArr = body.messages as ChatGPTMessageObj[];

		// Right now, assuming the user is not registered
		const isDataExhausted = !token && messagesArr.length >= freeTierLimit;
		if(isDataExhausted) return NextResponse.json({ok: false, error: 'You have exhausted the free tier limit. i.e, ' + freeTierLimit, limitLeft: 0});

		// Check if the request body has generate_ad key as true
		// If it does, then generate the ad and return the response as a JSON not a stream.
		if(body.generate_ad) {
			let _messages = [...(messagesArr ?? []), {role: 'user', content: `Send me a json similar to this but different values filled within the keys and make sure i receive only json in your response - "${JSON.stringify(exampleJSON)}"`}];
			const generated_json = await openai.chat.completions.create({
				messages: _messages,
				model: 'gpt-3.5-turbo',
				stream: false
			});
			return NextResponse.json({ok: true, is_ad_json: true, json: generated_json.choices[0].message.content});
			// return NextResponse.json({ok: true, is_ad_json: true, json: exampleJSON});
		}


		// Else, return the response as a stream
		const completion = await openai.chat.completions.create({
			messages: messagesArr ?? [{ role: 'user', content: 'Say this is a test' }],
			model: 'gpt-3.5-turbo',
			stream: true
		});


		const stream = OpenAIStream(completion);

		return new StreamingTextResponse(stream);
	} catch(e: unknown) {
		console.log('e - ', e);
		return NextResponse.json({ok: false, error: e})
	}
}
