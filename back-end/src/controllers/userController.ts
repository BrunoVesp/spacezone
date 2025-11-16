import { Request, Response } from 'express';
import UserService from '../services/userService';
import { User } from '../generated/prisma';
import bcrypt from 'bcrypt';
import { UserDataUpdateType } from '../types/userDataCreate';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../schemas/userSchema';
import { idSchema } from '../schemas/idSchema';
import { deleteFile } from '../middleware/deletefile';

const UserController = {
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users: User[] = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getUserById(req: Request, res: Response): Promise<void> {
        let id: number;
        try {
            ({ id } = idSchema.parse(req.params));
        } catch (error: any) {
            res.status(400).json({
                message: 'ID inválido',
                errors: (error.errors ?? error.issues)?.map((e: any) => e.message) ?? [error.message]
            });
            return;
        }

        if (!req.user || req.user.id !== id) {
            res.status(403).json({ message: 'Acesso negado' });
            return;
        }

        try {
            const user: User | null = await UserService.getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createUser(req: Request, res: Response): Promise<void> {
        const data = createUserSchema.parse(req.body)

        try {
            if (req.file)
            {
                data.profileImage = `/uploads/${req.file.filename}`;
            }
            const salt: string = await bcrypt.genSalt();
            const hashedPassword: string = await bcrypt.hash(data.password, salt);
            data.password = hashedPassword;
            const newUser: User = await UserService.createUser(data);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateUser(req: Request, res: Response): Promise<void> {
        let id: number;
        try {
            ({ id } = idSchema.parse(req.params));
        } catch (error: any) {
            res.status(400).json({
                message: 'ID inválido',
                errors: (error.errors ?? error.issues)?.map((e: any) => e.message) ?? [error.message]
            });
            return;
        }

        if (!req.user || req.user.id !== id) {
            res.status(403).json({ message: 'Acesso negado' });
            return;
        }

        let dataUpdate: UserDataUpdateType;
        try {
            const existingUser = await UserService.getUserById(id);
            if (!existingUser) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }

            dataUpdate = updateUserSchema.parse(req.body);

            if (req.file)
            {
                if (existingUser.profileImage) {
                    deleteFile(existingUser.profileImage);
                }
                dataUpdate.profileImage = `/uploads/${req.file.filename}`;
            }

            if (dataUpdate.password !== undefined) {
                const salt: string = await bcrypt.genSalt();
                const hashedPassword: string = await bcrypt.hash(dataUpdate.password, salt);
                dataUpdate.password = hashedPassword;
            }
        } catch (error: any) {
            res.status(400).json({
                message: 'Dados inválidos',
                errors: (error.errors ?? error.issues)?.map((e: any) => e.message) ?? [error.message]
            });
            return;
        }

        try {
            const updatedUser: User = await UserService.updateUser(id, dataUpdate);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteUser(req: Request, res: Response): Promise<void> {
        let id: number;
        try {
            ({ id } = idSchema.parse(req.params));
        } catch (error: any) {
            res.status(400).json({
                message: 'ID inválido',
                errors: (error.errors ?? error.issues)?.map((e: any) => e.message) ?? [error.message]
            });
            return;
        }

        if (!req.user || req.user.id !== id) {
            res.status(403).json({ message: 'Acesso negado' });
            return;
        }

        try {
            const user = await UserService.getUserById(id);

            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }

            if (user.profileImage) {
                deleteFile(user.profileImage);
            }

            const deletedUser: User = await UserService.deleteUser(id);
            res.status(200).json(deletedUser);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async loginUser(req: Request, res: Response): Promise<void> {
        let data;
        try {
            data = loginUserSchema.parse(req.body);
        } catch (error: any) {
            res.status(400).json({
                message: 'Dados inválidos',
                errors: (error.errors ?? error.issues)?.map((e: any) => e.message) ?? [error.message]
            });
            return;
        }

        try {
            const result: { user: User; token: string } | null = await UserService.loginUser(data.email, data.password);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default UserController;
