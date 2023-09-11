import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';
import {ChatGPTMessageObj} from '@/constants/artibotData';
import {freeTierLimit} from '@/constants';
import {NextApiResponse} from 'next';
import {OpenAIStream, StreamingTextResponse} from 'ai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge';

export async function POST(req: Request, res: NextApiResponse) {
	try {
		// const is = ServerResponse.isPrototypeOf(res)
		// const response = new Response(res.);
		// res.write()

		// const resp = NextResponse.next();

		// resp.headers.

		// const resp = new ServerResponse(req);
		//

		// response.headers.set('Content-Encoding', 'none');
		// response.headers.set('Content-Type', 'text/event-stream');
		// response.headers.set('Connection', 'keep-alive');
		// resp.setHeader('Content-Type', 'text/event-stream');
		// resp.setHeader('Cache-Control', 'no-cache');
		// resp.setHeader('Connection', 'keep-alive');
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
