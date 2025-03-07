import db from '@/data/db.json';
import { NextResponse } from 'next/server';


export async function GET() {

    const data = db.filter(template => template.status === "APPROVED");
    return NextResponse.json(data);
 }