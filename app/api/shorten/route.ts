import { NextResponse } from 'next/server';
import { createShortenedUrl } from '@/lib/shortener';

export async function POST(request: Request) {
    const { originalUrl, customCode } = await request.json();

    if (!originalUrl || !isValidUrl(originalUrl)) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    try {
        const shortenedUrl = await createShortenedUrl(originalUrl, customCode);
        return NextResponse.json(shortenedUrl, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function isValidUrl(url: string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|' + // domain name
        'localhost|' + // localhost
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // ipv4
        '\\[([0-9a-f]{1,4}:){7,7}[0-9a-f]{1,4}\\]|' + // ipv6
        '([0-9a-f]{1,4}:){1,7}:|'+ // ipv6
        '([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|' + // ipv6
        '([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|' + // ipv6
        '([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|' + // ipv6
        '([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|' + // ipv6
        '([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|' + // ipv6
        '[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|' + // ipv6
        ':((:[0-9a-f]{1,4}){1,7}|:)|' + // ipv6
        'fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-zA-Z]{1,}|'+ // ipv6
        '::(ffff(:0{1,4}){0,1}:){0,1}' + // ipv4-mapped ipv6
        '((25[0-5]|(2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\\.){3}' + // ipv4
        '(25[0-5]|(2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]))|' + // ipv4
        '([0-9a-f]{1,4}:){1,4}:' + // ipv6
        '((25[0-5]|(2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\\.){3}' + // ipv4
        '(25[0-5]|(2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]))))' + // ipv4
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!urlPattern.test(url);
}