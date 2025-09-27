import { Request, Response } from "express";
import RedatorService from '../services/redatorService';

const RedatorController = {
  async createRedator(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    if (!req || req.user.id !== userId) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    try {
      const redator = await RedatorService.createRedator(userId);
      res.status(201).json(redator);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getAllRedatores(req: Request, res: Response) {
    const redatores = await RedatorService.getAllRedatores();
    res.json(redatores);
  },

  async getRedatorById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    if (!req || req.user.id !== id) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const redator = await RedatorService.getRedatorById(id);
    if (!redator) {
      res.status(404).json({ error: "Redator não encontrado" });
      return;
    }
    res.json(redator);
  },

  async demoteRedator(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    if (!req || req.user.id !== id) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    try {
      const demote = await RedatorService.deleteRedator(id);
      res.status(200).json({ message: "Redator Rebaixado" });
      res.json(demote);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async createPost(req: Request, res: Response): Promise<void> {
    const authorId = Number(req.params.id);
    const { title, subtitle, body } = req.body;
    try {
      const post = await RedatorService.createPost(authorId, { title, subtitle, body });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async updatePost(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.postId);
    const { title, subtitle, body } = req.body;
    try {
      const post = await RedatorService.updatePost(postId, { title, subtitle, body });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async deletePost(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.postId);
    try {
      const post = await RedatorService.deletePost(postId);
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export default RedatorController;