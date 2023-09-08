import { NextResponse } from 'next/server'


export async function GET(req: Request) {
	try {
		return NextResponse.json({list: []})
	} catch(e: unknown) {
		return NextResponse.json({error: e})
	}
}
