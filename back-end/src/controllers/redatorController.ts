import { Request, Response } from "express";
import RedatorService from '../services/redatorService';
import { idSchema } from "../schemas/idSchema";
import prisma from "../db/prisma";
import { promoteSchema } from "../schemas/promoteSchema";
import { getPagination, buildPaginationLinks} from "../middleware/pagination";

const RedatorController = {
  async createRedator(req: Request, res: Response) {
    try {
      // valida nickname + email
      const { email, nickname } = promoteSchema.parse(req.body);

      // quem está tentando promover?
      const requester = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      const redatores = await prisma.user.count({ where: { isRedator: true } });

      // regra: se já existe redator, só redator pode promover
      if (redatores > 0 && !requester?.isRedator) {
        return res.status(403).json({
          message: "Apenas redatores podem promover usuários."
        });
      }

      // buscar usuário pelo email e nickname
      const user = await prisma.user.findFirst({
        where: { email, nickname }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // promover
      const novoRedator = await RedatorService.createRedator(user.id);

      return res.status(201).json(novoRedator);

    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(400).json({ message: error.message });
    }
  },

  async getAllRedatores(req: Request, res: Response) {
    try {
        const { page, limit, skip } = getPagination(req);

        const { total, redatores } = await RedatorService.getAllRedatores(skip, limit);

        res.status(200).json({
          pagination: buildPaginationLinks(req, page, limit, total),
          data: redatores
        });

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