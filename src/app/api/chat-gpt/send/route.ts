import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import {ChatGPTMessageObj} from '@/constants/artibotData';
import {freeTierLimit} from '@/constants';
import {NextApiResponse} from 'next';
import {OpenAIStream, StreamingTextResponse} from 'ai';
// import {getServerSession} from 'next-auth/next';
// import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import { getToken } from "next-auth/jwt"

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

		const completion = await openai.chat.completions.create({
			messages: messagesArr ?? [{ role: 'user', content: 'Say this is a test' }],
			model: 'gpt-3.5-turbo',
			stream: true
		});


		const stream = OpenAIStream(completion);

		return new StreamingTextResponse(stream);

		// let responseStream = new TransformStream();
		// const writer = responseStream.writable.getWriter();
		// const encoder = new TextEncoder();
		//
		// for await(const chunk of completion) {
		// 	console.log('chunk - ', chunk);
		// 	if(chunk.choices.at(-1) && chunk.choices.at(-1)?.finish_reason)  {
		// 		// writer.write(JSON.stringify(chunk))
		// 		// writer.close();
		// 		res.write(JSON.stringify(chunk));
		// 		res.end();
		// 		return new Response(responseStream.readable, {
		// 			headers: {
		// 				"Access-Control-Allow-Origin": "*",
		// 				"Content-Type": "text/event-stream; charset=utf-8",
		// 				Connection: "keep-alive",
		// 				"Cache-Control": "no-cache, no-transform",
		// 				"X-Accel-Buffering": "no",
		// 				"Content-Encoding": "none",
		// 			},
		// 		});
		// 	}
		// 	res.write(JSON.stringify(chunk))
		// 	// resp.write(JSON.stringify(chunk));
		// 	// writer.write(JSON.stringify(chunk))
		// }
		//
		// // console.log('completion.choices - ', completion.choices);
		//
		// // return new Response(responseStream.readable, {
		// // 	headers: {
		// // 		"Access-Control-Allow-Origin": "*",
		// // 		"Content-Type": "text/event-stream; charset=utf-8",
		// // 		Connection: "keep-alive",
		// // 		"Cache-Control": "no-cache, no-transform",
		// // 		"X-Accel-Buffering": "no",
		// // 		"Content-Encoding": "none",
		// // 	},
		// // });
		//
		//
		// return NextResponse.json({ok: true, data: completion, message: 'Response received successfully!', limitLeft: freeTierLimit - messagesArr.length - 1})
	} catch(e: unknown) {
		console.log('e - ', e);
		return NextResponse.json({ok: false, error: e})
	}
}
