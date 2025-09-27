import { Request, Response } from "express";
import RedatorService from '../services/redatorService';

const RedatorController = {
  async createRedator(req: Request, res: Response) {
    const { userId, isAdm } = req.body;
    try {
      const redator = await RedatorService.createRedator({ userId, isAdm });
      res.status(201).json(redator);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getAllRedatores(req: Request, res: Response) {
    const redatores = await RedatorService.getAllRedatores();
    res.json(redatores);
  },

  async createPost(req: Request, res: Response) {
    const authorId = Number(req.params.id);
    const { title, subtitle, body } = req.body;
    try {
      const post = await RedatorService.createPost(authorId, { title, subtitle, body });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async updatePost(req: Request, res: Response) {
    const postId = Number(req.params.postId);
    const { title, subtitle, body } = req.body;
    try {
      const post = await RedatorService.updatePost(postId, { title, subtitle, body });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async deletePost(req: Request, res: Response) {
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