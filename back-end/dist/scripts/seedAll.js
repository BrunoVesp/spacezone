"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🌱 Iniciando seed...");
        // ------------------------------------------------------
        // 1) Criar usuário admin
        // ------------------------------------------------------
        const admin = yield prisma.user.create({
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
        const post1 = yield prisma.post.create({
            data: {
                title: "Bem-vindo ao SpaceZone",
                subtitle: "Primeiro post de demonstração",
                body: "Este é um exemplo de conteúdo para o primeiro post...",
                authorId: admin.id,
                image: null,
                tags: ["introdução", "spacezone"],
            },
        });
        const post2 = yield prisma.post.create({
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
        yield prisma.comentary.createMany({
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
    });
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
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
