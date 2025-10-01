import { Request, Response } from "express";
import RedatorService from '../services/redatorService';
import { idSchema } from "../schemas/idSchema";

const RedatorController = {
  async createRedator(req: Request, res: Response): Promise<void> {
    let userId: number;
    try {
      ({ id: userId } = idSchema.parse(req.params));
    } catch (error: any) {
      res.status(400).json({
        message: 'ID inválido',
        errors: (error.errors ?? error.issues)?.map((e: any) => e.message) ?? [error.message]
      });
      return;
    }

    // Ajustar acesso para promover
    if (!req.user || req.user.id !== userId) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    try {
      const redator = await RedatorService.createRedator(userId);
      res.status(201).json(redator);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllRedatores(req: Request, res: Response) {
    try {
      const redatores = await RedatorService.getAllRedatores();
      res.status(200).json(redatores);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getRedatorById(req: Request, res: Response) {
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
      const redator = await RedatorService.getRedatorById(id);
      if (!redator) {
        res.status(404).json({ error: "Redator não encontrado" });
        return;
      }
      res.status(200).json(redator);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async demoteRedator(req: Request, res: Response): Promise<void> {
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

    // Ajustar acesso para rebaixar
    if (!req.user || req.user.id !== id) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    try {
      await RedatorService.deleteRedator(id);
      res.status(200).json({ message: "Redator Rebaixado" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default RedatorController;