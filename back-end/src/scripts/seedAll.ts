import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed...");

    // ------------------------------------------------------
    // 1) Criar usuário admin
    // ------------------------------------------------------
    const admin = await prisma.user.create({
        data: {
            nickname: "admin",
            email: "admin@example.com",
            password: "123456", // coloque hash depois se quiser
            isRedator: true,
            profileImage: null,
        },
    });

    console.log("👤 Usuário admin criado:", admin.email);

    // ------------------------------------------------------
    // 2) Criar posts do admin
    // ------------------------------------------------------
    const post1 = await prisma.post.create({
        data: {
            title: "Bem-vindo ao SpaceZone",
            subtitle: "Primeiro post de demonstração",
            body: "Este é um exemplo de conteúdo para o primeiro post...",
            authorId: admin.id,
            image: null,
            tags: ["introdução", "spacezone"],
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: "Atualizações do Projeto",
            subtitle: "O que vem por aí",
            body: "Este post fala sobre futuras atualizações e melhorias...",
            authorId: admin.id,
            image: null,
            tags: ["atualizações"],
        },
    });

    console.log("📝 Posts criados:", post1.id, post2.id);

    // ------------------------------------------------------
    // 3) Criar comentários nos posts
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
    });

    console.log("💬 Comentários criados!");
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