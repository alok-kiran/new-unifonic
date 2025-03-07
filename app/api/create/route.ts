import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request,) {
    const body = await req.json();
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.unifonic.com/v1/messages',
        headers: {
            'Publicid': process.env.API_PUBLIC_ID,
            'Secret': process.env.API_SECRET_KEY,
            'Content-Type': 'application/json'
        },
        data: body
    };

    try {
        const response = await axios.request(config);
        return NextResponse.json({ created: true, data: response.data }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ created: false, error: 'failed to create' }, { status: 500 });
    }
}