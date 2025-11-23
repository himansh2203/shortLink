import { NextResponse } from 'next/server';
import { getStatsByCode } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { code: string } }) {
    const { code } = params;

    try {
        const stats = await getStatsByCode(code);

        if (!stats) {
            return NextResponse.json({ error: 'Statistics not found for this code.' }, { status: 404 });
        }

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while fetching statistics.' }, { status: 500 });
    }
}