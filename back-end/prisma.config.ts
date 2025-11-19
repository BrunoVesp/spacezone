import { defineConfig } from '@prisma/config';

export default defineConfig({
    schema: './prisma/schema.prisma',
    adapter: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL!,
    },
});
