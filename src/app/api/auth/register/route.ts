import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
import {REGISTER_FIELD_NAME} from '@/app/auth/register/page';

const prisma = new PrismaClient();
export async function POST(req: Request) {
	try {
		const reqJSON = await req.json();
		const {first_name, last_name, email, password} = reqJSON.values as Record<REGISTER_FIELD_NAME, string>;

		if(!first_name || !email || !password) {
			return new NextResponse({ok: false, message: 'Missing required fields'}, {status: 400});
		}

		const exist = await prisma.user.findUnique({
			where: {
				email
			}
		})

		if(exist) return new NextResponse({ok: false, message: 'User already exists'}, {status: 400});

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				first_name,
				last_name,
				email,
				password: hashedPassword
			}
		})

		return NextResponse.json({ok: true, data: user, message: 'Registered successfully!'})
	} catch(e: unknown) {
		console.log('Error in sending mail - ', e);
		return NextResponse.json({ok: false, message: 'Please try again later!'})
	}
}
