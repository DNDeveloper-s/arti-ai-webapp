import { NextResponse } from 'next/server'
import axios from 'axios';
import fs from 'node:fs'

const engineId = process.env.ENGINE_ID ?? 'stable-diffusion-v1-5';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.STABILITY_API_KEY;

export async function POST(req: Request) {
	try {
		const {text} = await req.json();

		const response = await axios.post(
			`${apiHost}/v1/generation/${engineId}/text-to-image`,
			{
				text_prompts: [
					{
						text
					},
				],
				cfg_scale: 7,
				height: 1024,
				width: 1024,
				steps: 50,
				samples: 1,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
			}
		)

		console.log('response - ', response);

		response.data.artifacts.forEach((image, index) => {
			fs.writeFileSync(
				`./v1_txt3img_${index}.png`,
				Buffer.from(image.base64, 'base64')
			)
		})

		return NextResponse.json({ok: true, message: 'We will get back to you soon.', data: response.data})
	} catch(e: unknown) {
		console.log('Error in sending mail - ', e);
		return NextResponse.json({ok: false, message: 'Please try again later!'})
	}
}
