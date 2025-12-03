import { User } from "@prisma/client";
import prisma from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserService = {
    async getAllUsers(skip: number, take: number): Promise<{ total: number; users: User[] }> {
        const total = await prisma.user.count();

        const users = await prisma.user.findMany({
            skip,
            take
        });

        return { total, users };
    },
    
    async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            include: { Post: true, Comentary: true }
        });
    },

    async createUser(data: { nickname: string; email: string; password: string}): Promise<User> {
        return prisma.user.create({ data });
    },

    async updateUser(id: number, data: { nickname?: string; email?: string; password?: string }): Promise<User> {
        return prisma.user.update({ where: { id }, data });
    },

    async deleteUser(id: number): Promise<User> {
        return prisma.user.delete({ where: { id } });
    },

    async loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) return null;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return null;

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_TOKEN as string, { expiresIn: '24h' });

        return { user, token };
    },

    async searchUsers(query: string, skip: number, take: number) {
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: {
                    OR: [
                        { nickname: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } }
                    ]
                },
                skip,
                take,
                orderBy: { nickname: "asc" },
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                    profileImage: true
                }
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { nickname: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } }
                    ]
                }
            })
        ]);

        return { users, total };
    }

};

export default UserService;

