import { Router } from "express";
import PostsController from "../controllers/postsController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operações de posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todos os posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get("/posts", PostsController.getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Busca um post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post não encontrado
 */
router.get("/posts/:id", PostsController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post criado
 *       400:
 *         description: Erro ao criar post
 */
router.post("/posts", authMiddleware, PostsController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post
 *     tags: [Posts]
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
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post atualizado
 *       400:
 *         description: Erro ao atualizar post
 *       404:
 *         description: Post não encontrado
 */
router.put("/posts/:id", authMiddleware, PostsController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remove um post
 *     tags: [Posts]
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
 *         description: Post removido
 *       404:
 *         description: Post não encontrado
 */
router.delete("/posts/:id", authMiddleware, PostsController.deletePost);

export default router;