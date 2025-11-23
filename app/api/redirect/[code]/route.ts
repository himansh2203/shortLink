import { NextResponse } from 'next/server';
import { getLinkByCode } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { code: string } }) {
    const { code } = params;
    const link = await getLinkByCode(code);

    if (!link) {
        return NextResponse.redirect(new URL('/404', request.url), 302);
    }

    return NextResponse.redirect(link.originalUrl, 302);
}