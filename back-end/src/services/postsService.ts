import prisma from "../db/prisma";
import { Post } from "../generated/prisma";
import { PostDataCreateType } from "../types/postDataCreate";

const PostsService = {
    async getAllPosts(): Promise<Post[]> {
        return prisma.post.findMany({
            include: {
                author: {
                    select: { nickname: true }
                }
            }
        });
    },

    async getPostbyId(id: number): Promise<Post | null> {
        return prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { nickname: true }
                }
            }
        });
    },

    async createPost(id: number, data: PostDataCreateType): Promise<Post> {
        const redator = await prisma.user.findUnique({ where: { id } });

        if (!redator?.isRedator) {
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

    async updatePost(id: number, data: Partial<PostDataCreateType>): Promise<Post> {
        return prisma.post.update({
            where: { id },
            data,
        });
    },

    async deletePost(id: number): Promise<Post> {
        return prisma.post.delete({
            where: { id },
        });
    },
}

export default PostsService;