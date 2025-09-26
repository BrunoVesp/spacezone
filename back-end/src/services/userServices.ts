import { Token } from "typescript";
import prisma from "../db/prisma";
import { User } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserService = {
    async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    },
    
    async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({where: { id }});
    },

    async createUser(data: { nickname: string; email: string; password: string}): Promise<User> {
        return prisma.user.create({data,});
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

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_TOKEN as string, { expiresIn: '1h' });

        return { user, token };
    }
};

export default UserService;

