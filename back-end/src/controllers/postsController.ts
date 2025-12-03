import { Request, Response } from "express";
import PostsService from "../services/postsService";
import { postCreateSchema, postUpdateSchema } from "../schemas/postSchema";
import { number, ZodError } from "zod";
import { PostDataCreateType } from "../types/postDataCreate";
import { idSchema } from "../schemas/idSchema";
import prisma from "../db/prisma";
import { deleteFile } from "../middleware/deletefile";
import { parse } from "path";
import { getPagination, buildPaginationLinks, normalizeTags } from "../middleware/pagination";
import { Post } from "@prisma/client";

const PostsController = {
    async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
        const { page, limit, skip } = getPagination(req);

        const [posts, total]: [Post[], number] = await Promise.all([
            PostsService.getAllPosts(skip, limit),
            PostsService.countPosts()
        ]);

        const pagination = buildPaginationLinks(req, page, limit, total);

        res.status(200).json({...pagination, data: posts});

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

        const { page, limit, skip } = getPagination(req);;

        try {
            //const post: Post | null = await PostsService.getPostbyId(id, skip, limit);
            const post: Post | null = await PostsService.getPostbyId(id);

            //const total = await PostsService.countCommentsByPost(id);
            //const pagination = buildPaginationLinks(req, page, limit, total);

            if (post) {
                res.status(200).json(post);
                //res.status(200).json({...pagination, data: post});
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

            if (data.tags) {
                data.tags = normalizeTags(data.tags);
            }

            if(req.file)
            {
                data.image = `/uploads/${req.file.filename}`;
            }

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
            if (req.file) {
                deleteFile(req.file.filename);
            }
            
            if (error instanceof ZodError) {
                res.status(400).json({
                    errors: error.issues.map(e => e.message)
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

            const existingPost = await prisma.post.findUnique({ where: { id } });
            if (!existingPost) {
                res.status(404).json({ message: "Post não encontrado." });
                return;
            }


            const data = postUpdateSchema.parse(req.body);

            if (data.tags) {
                data.tags = normalizeTags(data.tags);
            }
            
            if(req.file)
            {
                if (existingPost.image) {
                    deleteFile(existingPost.image.replace("/uploads/", ""));
                }
                data.image = `/uploads/${req.file.filename}`;
            }
            
            const updatedPost = await PostsService.updatePost(id, data);
            res.status(200).json(updatedPost);
        } catch (error: any) {
            if (req.file) {
                deleteFile(req.file.filename);
            }

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

            const post = await prisma.post.findUnique({ where: { id } });
            if (!post) 
            {
                res.status(404).json({ message: "Post não encontrado." });
                return;
            }

            if (post.image) 
            {
                deleteFile(post.image);
            }
            
            const deletedPost = await PostsService.deletePost(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Erro ao deletar post" });
        }
    },

    async getPostByUser(req: Request, res: Response) {
        try {
            const userId: number = parseInt(req.params.userId);
            if (isNaN(userId)) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }

            if (!req.user || req.user.id !== userId) {
                res.status(403).json({ message: 'Acesso negado' });
                return;
            }


            const { page, limit, skip } = getPagination(req);

            const [posts, total] = await Promise.all([
                PostsService.getPostsByUser(userId, skip, limit),
                PostsService.countPostsByUser(userId)
            ]);

            const pagination = buildPaginationLinks(req, page, limit, total);

            res.status(200).json({...pagination, data: posts});

        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar posts do usuário" });
        }
    },

    async search(req: Request, res: Response) {
        try {
            const query = (req.query.query as string) || "";

            if (!query.trim()) {
                return res.status(400).json({ error: "Query de pesquisa obrigatória." });
            }

            const { page, limit, skip } = getPagination(req);

            const { posts, total } = await PostsService.searchPosts(query, skip, limit);

            const pagination = buildPaginationLinks(req, page, limit, total);

            res.json({
                ...pagination,
                data: posts
            });

        } catch (error) {
            res.status(500).json({ error: "Erro ao pesquisar posts." });
        }
    }


}

export default PostsController;