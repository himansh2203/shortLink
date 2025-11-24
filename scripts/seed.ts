import { prisma } from '../lib/prismaClient';

async function main() {
    // Seed initial data
    const urls = [
        {
            originalUrl: 'https://www.example.com',
            shortCode: 'exmpl',
            clicks: 0,
        },
        {
            originalUrl: 'https://www.google.com',
            shortCode: 'googl',
            clicks: 0,
        },
        {
            originalUrl: 'https://www.github.com',
            shortCode: 'ghb',
            clicks: 0,
        },
        {
            originalUrl: 'https://vercel.com',
            shortCode: 'vercel',
            clicks: 0,
        },
    ];

    for (const u of urls) {
        const data = {
            code: u.shortCode,
            url: u.originalUrl,
            clicks: u.clicks ?? 0,
        };
        // narrow to any if Prisma typings still complain in build
        await (prisma as any).link.create({ data });
    }

    console.log('Seeding complete');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        try {
            await (prisma as any).$disconnect?.();
        } catch {}
    });