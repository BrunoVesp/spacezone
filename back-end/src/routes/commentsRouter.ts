import { Router } from "express";
import ComentaryController from "../controllers/commentsController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Operações de comentários
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Lista todos os comentários
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Lista de comentários
 */
router.get("/comments", ComentaryController.getAll);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Busca um comentário por ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentário encontrado
 *       404:
 *         description: Comentário não encontrado
 */
router.get("/comments/:id", ComentaryController.getById);

/**
 * @swagger
 * /comments/{postId}:
 *   post:
 *     summary: Cria um comentário em um post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário criado
 *       400:
 *         description: Erro ao criar comentário
 */
router.post("/comments/:postId", authMiddleware, ComentaryController.create);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Atualiza um comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentário atualizado
 *       400:
 *         description: Erro ao atualizar comentário
 *       404:
 *         description: Comentário não encontrado
 */
router.put("/comments/:id", authMiddleware, ComentaryController.update);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Remove um comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Comentário removido
 *       404:
 *         description: Comentário não encontrado
 */
router.delete("/comments/:id", authMiddleware, ComentaryController.delete);

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Lista comentários de um post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de comentários do post
 */
router.get("/comments/post/:postId", ComentaryController.getByPost);

/**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Lista comentários de um usuário
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de comentários do usuário
 */
router.get("/comments/user/:userId", authMiddleware, ComentaryController.getByUser);

export default router;
