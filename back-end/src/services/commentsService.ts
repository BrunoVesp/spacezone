import { Comentary } from "@prisma/client";
import prisma from "../db/prisma";
import { commentType } from "../types/commentType";

const ComentaryService = {
    async getAllComentaries(): Promise<Comentary[]> {
        return prisma.comentary.findMany({
            include: {
                user: {
                    select: { nickname: true }
                },
                Post: true
            }
        });
    },

    async getComentaryById(id: number): Promise<Comentary | null> {
        return prisma.comentary.findUnique({
            where: { id },
            include: {
                user: {
                    select: { nickname: true }
                },
                Post: true
            }
        });
    },

    async createComentary(data: commentType, userId: number, postId: number): Promise<Comentary> {
        return prisma.comentary.create({
            data: {
                content: data.content,
                userid: userId,
                postId: postId,
                isUpdated: false
            },
            include: {
                user: true,
                Post: true
            }
        });
    },

    async updateComentary(id: number, data: { content?: string; isUpdated?: boolean }): Promise<Comentary> {
        return prisma.comentary.update({
            where: { id },
            data: {
                ...data,
                isUpdated: true // sempre marca como atualizado
            },
            include: {
                user: true,
                Post: true
            }
        });
    },

    async deleteComentary(id: number): Promise<Comentary> {
        return prisma.comentary.delete({
            where: { id }
        });
    },

    async getComentariesByPost(postId: number,skip: number, take: number): Promise<{ comentaries: Comentary[]; total: number }> {
        const [comentaries, total] = await prisma.$transaction([
            prisma.comentary.findMany({
                where: { postId },
                skip,
                take,
                include: {
                    user: { select: { nickname: true } }
                }
            }),
            prisma.comentary.count({
                where: { postId }
            })
        ]);

    return { comentaries, total };
    },

    async getComentariesByUser(userId: number,skip: number, take: number): Promise<{ comentaries: Comentary[]; total: number }> {
        const [comentaries, total] = await prisma.$transaction([
            prisma.comentary.findMany({
                where: { userid: userId },
                skip,
                take,
                include: {
                    Post: true
                }
            }),
            prisma.comentary.count({
                where: { userid: userId }
            })
        ]);
        
        return { comentaries, total };
    }
};

export default ComentaryService;