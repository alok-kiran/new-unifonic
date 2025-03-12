import { formatTemplateRequest } from '@/lib/utils';
import axios from 'axios';
import { NextResponse } from 'next/server';
interface Component {
    type: string;
    parameters: { type: string; url?: string; text?: string }[];
}


const getTemplateByNameAndLanguage = async ({ name, language }: { name: string, language: string }) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://apis.unifonic.com/v1/whatsapp/message_templates?name=${name}&language=${language || 'en'}`,
        headers: {
            'Publicid': process.env.API_PUBLIC_ID,
            'Secret': process.env.API_SECRET_KEY,
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export async function POST(req: Request,) {
    const body = await req.json();
    const template = await getTemplateByNameAndLanguage({ name: body.Data.templateName, language: body.Data.language });
    const components = formatTemplateRequest(template[0], body);
    const messageBody = {
        "recipient": {
            "contact": `+${body.Data?.Membership?.PhoneNumber}`,
            "channel": "whatsapp"
        },
        "content": {
            "type": "template",
            "name": body.Data.templateName,
            "language": {
                "code": body.Data.language
            },
            "components": [] as Component[]
        }
    }
    if (components) {
        messageBody.content.components = components;
    }
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.unifonic.com/v1/messages',
        headers: {
            'Publicid': process.env.API_PUBLIC_ID,
            'Secret': process.env.API_SECRET_KEY,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(messageBody)
    };

    try {
        const response = await axios.request(config);
        return NextResponse.json({ created: true, data: response.data }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ created: false, error: 'failed to create' }, { status: 500 });
    }
}