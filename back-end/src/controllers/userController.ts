import {Request, Response} from 'express';
import UserService from '../services/userService';
import { User } from '../generated/prisma';
import bcrypt from 'bcrypt';

const UserController = {
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try{
            const users: User[] = await UserService.getAllUsers();
            res.status(200).json(users);
        }catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    },

    async getUserById(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            res.status(400).json({message: 'Invalid user ID'});
            return;
        }

        try{
            const user: User | null = await UserService.getUserById(id);
            if(user){
                res.status(200).json(user);
            }else{
                res.status(404).json({message: 'User not found'});
            }
        }catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    },

    async createUser(req: Request, res: Response): Promise<void> {
        const { nickname, email, password }: {nickname:string; email:string; password: string} = req.body;
        if(typeof nickname !== 'string' || nickname.trim() === ''){
            res.status(400).json({message: 'Nickname Invalido'});
            return;
        }
        if(typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.trim() === ''){
            res.status(400).json({message: 'Email Invalido'});
            return;
        }
        if(typeof password !== 'string' || password.length < 6){
            res.status(400).json({message: 'Password Invalida'});
            return;
        }

        try{
            const salt: string = await bcrypt.genSalt();
            const hashedPassword: string = await bcrypt.hash(password, salt);
            const newUser: User = await UserService.createUser({nickname, email, password: hashedPassword});
            res.status(201).json(newUser);
        }catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    },

    async updateUser(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            res.status(400).json({message: 'Invalid user ID'});
            return;
        }

        const { nickname, email, password }: {nickname?:string; email?:string; password?: string} = req.body;
        const dataUpdate: { nickname?: string; email?: string; password?: string } = {};

        if(nickname !== undefined){
            if(typeof nickname !== 'string' || nickname.trim() === ''){
                res.status(400).json({message: 'Nickname Invalido'});
                return;
            }
            dataUpdate.nickname = nickname;
        }

        if(email !== undefined){
            if(typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.trim() === ''){
                res.status(400).json({message: 'Email Invalido'});
                return;
            }
            dataUpdate.email = email;
        }

        if(password !== undefined){
            if(typeof password !== 'string' || password.length < 6){
                res.status(400).json({message: 'Password Invalida'});
                return;
            }
            try{
                const salt: string = await bcrypt.genSalt();
                const hashedPassword: string = await bcrypt.hash(password, salt);
                dataUpdate.password = hashedPassword;
            }catch(error){
                res.status(500).json({message: 'Error hashing password'});
                return;
            }
        }

        if(Object.keys(dataUpdate).length === 0){
            res.status(400).json({message: 'No valid fields to update'});
            return;
        }

        try{
            const updatedUser: User = await UserService.updateUser(id, dataUpdate);
            res.status(200).json(updatedUser);
        }catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    },

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            res.status(400).json({message: 'Invalid user ID'});
            return;
        }

        try{
            const deletedUser: User = await UserService.deleteUser(id);
            res.status(200).json(deletedUser);
        }catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    },

    async loginUser(req: Request, res: Response): Promise<void> {
        const { email, password }: {email:string; password: string} = req.body;
        if(typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.trim() === ''){
            res.status(400).json({message: 'Email Invalido'});
            return;
        }

        if(typeof password !== 'string' || password.length < 6){
            res.status(400).json({message: 'Password Invalida'});
            return;
        }

        try{
            const result: { user: User; token: string } | null = await UserService.loginUser(email, password);
            if(result){
                res.status(200).json(result);
            }else{
                res.status(401).json({message: 'Invalid email or password'});
            }
        }catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    }

}

export default UserController;