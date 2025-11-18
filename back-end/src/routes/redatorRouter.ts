import { Router } from "express";
import RedatorController from "../controllers/redatorController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Redatores
 *   description: Operações de redatores
 */

/**
 * @swagger
 * /redatores/promote/{id}:
 *   put:
 *     summary: Promove um usuário a redator
 *     tags: [Redatores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Usuário promovido a redator
 *       403:
 *         description: Apenas redatores podem promover usuários
 */
router.put("/redatores/promote/:id", authMiddleware, RedatorController.createRedator);

/**
 * @swagger
 * /redatores:
 *   get:
 *     summary: Lista todos os redatores
 *     tags: [Redatores]
 *     responses:
 *       200:
 *         description: Lista de redatores
 */
router.get("/redatores", RedatorController.getAllRedatores);

/**
 * @swagger
 * /redatores/demote/{id}:
 *   put:
 *     summary: Rebaixa um redator (apenas o próprio redator pode se rebaixar)
 *     tags: [Redatores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redator rebaixado com sucesso
 *       403:
 *         description: Apenas o próprio redator pode se rebaixar
 */
router.put("/redatores/demote/:id", authMiddleware, RedatorController.demoteRedator);

export default router;