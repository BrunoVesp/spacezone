import prisma from "../db/prisma";
import { Comentary } from "../generated/prisma";

const ComentaryService = {
    async getAllComentaries(): Promise<Comentary[]> {
        return prisma.comentary.findMany({
            include: {
                user: true,
                Post: true
            }
        });
    },

    async getComentaryById(id: number): Promise<Comentary | null> {
        return prisma.comentary.findUnique({
            where: { id },
            include: {
                user: true,
                Post: true
            }
        });
    },

    async createComentary(data: { content: string; userid: number; postId?: number }): Promise<Comentary> {
        return prisma.comentary.create({
            data: {
                content: data.content,
                userid: data.userid,
                postId: data.postId,
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

    async getComentariesByPost(postId: number): Promise<Comentary[]> {
        return prisma.comentary.findMany({
            where: { postId },
            include: {
                user: true
            }
        });
    },

    async getComentariesByUser(userId: number): Promise<Comentary[]> {
        return prisma.comentary.findMany({
            where: { userid: userId },
            include: {
                Post: true
            }
        });
    }
};

export default ComentaryService;