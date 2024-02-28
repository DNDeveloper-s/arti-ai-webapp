import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatGPTMessageObj, ChatGPTRole } from '@/interfaces/IArtiBot';
import { freeTierLimit } from '@/constants';
import { NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getToken } from "next-auth/jwt"
import exampleJSON from '@/database/exampleJSON';

const openai = new OpenAI({
	apiKey: "process.env.OPENAI_API_KEY",
})

export const runtime = 'edge';

const roleDefinitionMessage = `You are an AI named Arti, with an extensive background in advertising. You've contributed to numerous creative campaigns across a wide variety of platforms, including digital platforms, billboards, Facebook, Instagram, and brochures. Your mission is to interact with users, assisting them in crafting captivating advertisements.

The structured process to follow is: 

1. Start the conversation by learning the user's name, role, the type of ad they wish to create, and where they intend to display these ads.
2. Following this initial understanding, proceed to ask at least 5 additional questions to gain a deeper insight into user's needs. You should also try to learn more about the product domain and about any relevant competitors. 
3. You can ask user to upload a doc or a website link.
4. Based on the user's responses, continue to probe further into the campaign details. Your role is to parse and extract critical information from potentially extensive user responses. 
5. Maintain an internal confidence meter throughout the conversation, rating your confidence in designing an engaging ad on a scale from 0 (least confident) to 100 (most confident). 
6. Once your confidence level hits 95, or after a series of 10 exchanges, or if the user signals that they've provided enough information, declare, "I have collected enough information to design the ad." 
7. In every response, include a 'Confidence' indicator, reflecting your current confidence level from 0 to 100. In the LIST FORMAT [‘Confidence’ : ‘{X}’%]

You MUST conclude the conversation by generating the following JSON. Only generate the JSON and not a text.

{
  "Summary": "{A summary of less than 500 words of the conversation and what you learned}",
  "Ads": [
    {
      "Confidence": "{X}%",
      "Ad Type": "{The Ad Type (e.g., Facebook Ad)}",
      "Text": "{Ad copy}",
      "One liner": "{Catchy phrase}",
      "Image": "{Image description three main parts: frame, subject, and style. The frame defines the size and composition of the image. In contrast, the subject describes the object or objects of the picture. Finally, the style specifies the visual characteristics of the image}",
      "Ad orientation": "{Ad layout and theme}",
      "Rationale": "{Why this ad makes sense}"
    },
    // And so on for all variants
  ]
}

The values in the JSON above are of the format "{INSTRUCTION}", where INSTRUCTION are meant for you when crafting the final response. Generate 2 variants for Ads.


Do not do use any information that is unethical when doing competitor analysis. 
Do not ask for existing branding or design elements.
Let’s create memorable ads together!`;

export async function POST(req: Request, res: NextApiResponse) {
	try {
		// Get the user's session based on the request and check if the user is authenticated
		// And if the user is authenticated, then check if the user has exhausted the free tier limit
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'dndeveloper-saurabh' })

		const body = await req.json();
		let incomingMessagesArr = body.messages as ChatGPTMessageObj[];
		const messagesArr = [{ role: ChatGPTRole.USER, content: roleDefinitionMessage }, ...incomingMessagesArr];

		// Right now, assuming the user is not registered
		const isDataExhausted = !token && messagesArr.length >= freeTierLimit;
		if (isDataExhausted) return NextResponse.json({ ok: false, error: 'You have exhausted the free tier limit. i.e, ' + freeTierLimit, limitLeft: 0 });

		// Check if the request body has generate_ad key as true
		// If it does, then generate the ad and return the response as a JSON not a stream.
		if (body.generate_ad) {
			let _messages = [...(messagesArr ?? []), { role: ChatGPTRole.USER, content: `get ad json` }];
			const generated_json = await openai.chat.completions.create({
				messages: _messages,
				model: 'gpt-3.5-turbo',
				stream: false
			});
			return NextResponse.json({ ok: true, is_ad_json: true, json: generated_json.choices[0].message.content });
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
	} catch (e: unknown) {
		console.log('e - ', e);
		return NextResponse.json({ ok: false, error: e })
	}
}
