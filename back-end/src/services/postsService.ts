import { Comentary } from './../generated/prisma/index.d';
import prisma from "../db/prisma";
import { Post } from "../generated/prisma";
import { PostDataCreateType } from "../types/postDataCreate";
import { Prisma } from "@prisma/client";
import { allowedTags } from '../schemas/postSchema';

const PostsService = {
    async getAllPosts(skip: number, limit: number): Promise<any[]> {
        return prisma.post.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                subtitle: true,
                createdAt: true, // Incluindo a data de criação
                image: true,     // Incluindo a imagem
                author: {
                    select: { nickname: true } // Incluindo o autor
                },
                tags: true
            },
            orderBy: { id: "desc" }
        });
    },

    async countPosts(): Promise<number> {
        return prisma.post.count();
    },

    async getPostbyId(id: number,
        //skip: number, 
        //take: number
    ): Promise<Post | null> {
        return prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { nickname: true }
                },
                comentarys: {
                    //skip,
                    //take,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        createdAt: true,
                        isUpdated: true,
                        content: true,
                        user: {
                            select: {
                                id: true,
                                nickname: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });
    },

    async countCommentsByPost(postId: number) {
        return prisma.comentary.count({
            where: { postId }
        });
    },

    async getPostsByUser(userId: number, skip: number, limit: number) {
        return prisma.post.findMany({
            where: { authorId: userId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                author: { select: { nickname: true } }
            }
        });
    },

    async countPostsByUser(userId: number) {
        return prisma.post.count({
            where: { authorId: userId }
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
                image: data.image || null,
                tags: data.tags,
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

    async searchPosts(query: string, skip: number, take: number) {
        const normalized = query.trim().toLowerCase();

        const matchedTags = allowedTags.filter(tag =>
            tag.includes(normalized)
        );

        const whereFilter = {
            OR: [
                { title: { contains: query } },
                { subtitle: { contains: query } },
                { body: { contains: query } },
                ...matchedTags.map(tag => ({ tags: { has: tag.toLowerCase() } }))
            ]
        };

        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                where: whereFilter,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    author: {
                        select: { nickname: true }
                    }
                }
            }),
            prisma.post.count({ where: whereFilter })
        ]);

        return { posts, total };
    }

}

export default PostsService;