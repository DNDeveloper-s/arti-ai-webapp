import { NextResponse } from 'next/server'
import axios from 'axios';
import fs from 'node:fs'
import uploadToS3 from '@/utils/upload-to-s3';

const engineId = process.env.ENGINE_ID ?? 'stable-diffusion-v1-5';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.STABILITY_API_KEY;

export async function POST(req: Request) {
	try {
		const {text, name} = await req.json();

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

		const gen_name = name + '_' + Date.now() + '.png';
		const sentData = await uploadToS3(Buffer.from(response.data.artifacts[0].base64, 'base64'), gen_name, 'base64', 'image/png');

		// response.data.artifacts.forEach((image, index) => {
		// 	fs.writeFileSync(
		// 		`./v1_txt3img_${index}.png`,
		// 		Buffer.from(image.base64, 'base64')
		// 	)
		// })

		return NextResponse.json({ok: true, message: 'We will get back to you soon.', data: {url: sentData.Location, name: sentData.Key}})
	} catch(e: unknown) {
		console.log('Error in sending mail - ', e);
		return NextResponse.json({ok: false, message: 'Please try again later!'})
	}
}
