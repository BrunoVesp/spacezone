import { Request, Response } from "express";
import RedatorService from '../services/redatorService';
import { idSchema } from "../schemas/idSchema";
import prisma from "../db/prisma";

const RedatorController = {
  async createRedator(req: Request, res: Response): Promise<void> {
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

    const redatores = await prisma.user.findMany({
      where: { isRedator: true }
    })

    const redator = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (redatores.length > 0 && !redator?.isRedator) {
      res.status(403).json({ message: 'Apenas redatores podem promover usuários.' });
      return;
    }

    try {
      const novoRedator = await RedatorService.createRedator(id);
      res.status(201).json(novoRedator);
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

    // Apenas o próprio redator pode se rebaixar
    if (!req.user || req.user.id !== id) {
      res.status(403).json({ message: 'Você só pode rebaixar a si mesmo.' });
      return;
    }

    // Verifica se o usuário é redator
    const redator = await prisma.user.findUnique({ where: { id } });

    if (!redator?.isRedator) {
      res.status(403).json({ message: 'Apenas redatores podem se rebaixar.' });
      return;
    }

    try {
      await RedatorService.demoteRedator(id);
      res.status(200).json({ message: "Redator rebaixado com sucesso." });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default RedatorController;