import { Request, Response } from "express";
import ComentaryService from "../services/comentsService";

const ComentaryController = {
    async getAll(req: Request, res: Response) {
        try {
            const comentaries = await ComentaryService.getAllComentaries();
            res.json(comentaries);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar comentários" });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const comentary = await ComentaryService.getComentaryById(id);
            if (!comentary) return res.status(404).json({ error: "Comentário não encontrado" });
            res.json(comentary);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar comentário" });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const { content, userid, postId } = req.body;
            if (!content || !userid) return res.status(400).json({ error: "Dados inválidos" });

            const comentary = await ComentaryService.createComentary({ content, userid, postId });
            res.status(201).json(comentary);
        } catch (err) {
            res.status(500).json({ error: "Erro ao criar comentário" });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { content } = req.body;

            const comentary = await ComentaryService.updateComentary(id, { content });
            res.json(comentary);
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar comentário" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await ComentaryService.deleteComentary(id);
            res.json({ message: "Comentário deletado com sucesso" });
        } catch (err) {
            res.status(500).json({ error: "Erro ao deletar comentário" });
        }
    },

    async getByPost(req: Request, res: Response) {
        try {
            const postId = Number(req.params.postId);
            const comentaries = await ComentaryService.getComentariesByPost(postId);
            res.json(comentaries);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar comentários do post" });
        }
    },

    async getByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);
            const comentaries = await ComentaryService.getComentariesByUser(userId);
            res.json(comentaries);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar comentários do usuário" });
        }
    }
};

export default ComentaryController;
