import { Request, Response } from "express";
import { Post } from "../generated/prisma"
import PostsService from "../services/postsService";
import { postCreateSchema, postUpdateSchema } from "../schemas/postSchema";
import { ZodError } from "zod";
import { PostDataCreateType } from "../types/postDataCreate";
import { idSchema } from "../schemas/idSchema";
import prisma from "../db/prisma";

const PostsController = {
    async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts: Post[] = await PostsService.getAllPosts();

            if (posts) {
                res.status(200).json(posts);
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getPostById(req: Request, res: Response): Promise<void> {
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

        try {
            const post: Post | null = await PostsService.getPostbyId(id);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const data = postCreateSchema.parse(req.body);
            const id: number = req.user.id;

            if (!id) {
                res.status(401).json({ error: "Usuário não autenticado." });
                return;
            }

            const redator = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!redator?.isRedator) {
                throw new Error("Somente redatores podem publicar posts.");
            }

            const newPost: PostDataCreateType = await PostsService.createPost(id, data);

            res.status(201).json(newPost);
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    errors: error.issues.map((e: any) => e.message)
                });
            } else {
                res.status(400).json({ message: error.message || "Erro ao publicar post" });
            }
        }
    },

    async updatePost(req: Request, res: Response): Promise<void> {
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

        try {
            const redator = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!redator?.isRedator) {
                throw new Error("Somente redatores podem atualizar posts.");
            }

            const data = postUpdateSchema.parse(req.body);
            const updatedPost = await PostsService.updatePost(id, data);
            res.status(200).json(updatedPost);
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    errors: error.issues.map((e: any) => e.message)
                });
            } else {
                res.status(400).json({ message: error.message || "Erro ao atualizar post" });
            }
        }
    },

    async deletePost(req: Request, res: Response): Promise<void> {
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
        try {
            const redator = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!redator?.isRedator) {
                throw new Error("Somente redatores podem deletar posts.");
            }
            const deletedPost = await PostsService.deletePost(id);
            res.status(204).json(deletedPost);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Erro ao deletar post" });
        }
    }
}

export default PostsController;