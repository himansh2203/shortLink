import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    ];

    for (const url of urls) {
        await prisma.link.create({
            data: url,
        });
    }

    console.log('Database seeded with initial URLs');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });