import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed...");

    // ------------------------------------------------------
    // 1) Criar hash da senha
    // ------------------------------------------------------
    const hashedPassword = await bcrypt.hash("123456", 10);

    // ------------------------------------------------------
    // 2) Criar ou pegar usuário admin (sem duplicar)
    // ------------------------------------------------------
    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {}, // não atualiza nada se já existir
        create: {
            nickname: "admin",
            email: "admin@example.com",
            password: hashedPassword,
            isRedator: true,
            profileImage: null,
        },
    });

    console.log("👤 Usuário admin OK:", admin.email);

    // ------------------------------------------------------
    // 3) Criar posts do admin (usar upsert também)
    // ------------------------------------------------------
    const post1 = await prisma.post.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: "Bem-vindo ao SpaceZone",
            subtitle: "Primeiro post de demonstração",
            body: "Este é um exemplo de conteúdo para o primeiro post...",
            authorId: admin.id,
            image: null,
        },
    });

    const post2 = await prisma.post.upsert({
        where: { id: 2 },
        update: {},
        create: {
            title: "Atualizações do Projeto",
            subtitle: "O que vem por aí",
            body: "Este post fala sobre futuras atualizações e melhorias...",
            authorId: admin.id,
            image: null,
        },
    });

    console.log("📝 Posts OK:", post1.id, post2.id);

    // ------------------------------------------------------
    // 4) Criar comentários apenas se não existirem
    // ------------------------------------------------------
    await prisma.comentary.createMany({
        data: [
            {
                content: "Ótimo post!",
                isUpdated: false,
                userid: admin.id,
                postId: post1.id,
            },
            {
                content: "Ansioso pelas novidades 🚀",
                isUpdated: false,
                userid: admin.id,
                postId: post2.id,
            },
            {
                content: "Muito bom trabalho!",
                isUpdated: false,
                userid: admin.id,
                postId: post1.id,
            },
        ],
        skipDuplicates: true,
    });

    console.log("💬 Comentários OK!");
}

main()
    .then(() => {
        console.log("🌱 Seed finalizado com sucesso!");
    })
    .catch((error) => {
        console.error("❌ Erro no seed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });