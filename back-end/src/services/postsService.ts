import prisma from "../db/prisma";
import { Post } from "../generated/prisma";
import { PostDataCreateType } from "../types/postDataCreate";

const PostsService = {
    async getAllPosts(): Promise<Post[]> {
        return prisma.post.findMany();
    },

    async getPostbyId(id: number): Promise<Post | null> {
        return prisma.post.findUnique({ where: { id } });
    },

    async createPost(userId: number, data: PostDataCreateType): Promise<Post> {
        const redator = await prisma.redator.findUnique({ where: { userId } });

        if (!redator) {
            throw new Error("Somente redatores podem criar posts.");
        }

        return prisma.post.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                body: data.body,
                authorId: redator.id,
            },
        });
    },

    async updatePost(id: number, data: Partial<PostDataCreateType>, userId: number): Promise<Post> {
        const redator = await prisma.redator.findUnique({ where: { userId } });
        if (!redator) {
            throw new Error("Somente redatores podem atualizar posts.");
        }
        return prisma.post.update({
            where: { id },
            data,
        });
    },

    async deletePost(id: number, userId: number): Promise<Post> {
        const redator = await prisma.redator.findUnique({ where: { userId } });
        if (!redator) {
            throw new Error("Somente redatores podem deletar posts.");
        }
        return prisma.post.delete({
            where: { id },
        });
    },
}

export default PostsService;