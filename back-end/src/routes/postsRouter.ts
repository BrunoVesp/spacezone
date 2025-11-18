import { Router } from "express";
import PostsController from "../controllers/postsController";
import { authMiddleware } from "../middleware/webtoken";
import { upload } from "../middleware/multer";

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

router.get("/posts/search", PostsController.search);

router.get("/posts",  PostsController.getAllPosts);
router.get("/posts/:id", PostsController.getPostById);

router.post("/posts", upload.single("image"), authMiddleware, PostsController.createPost);
router.put("/posts/:id", upload.single("image"), authMiddleware, PostsController.updatePost);
router.delete("/posts/:id", authMiddleware, PostsController.deletePost);

router.get("/posts/redator/:userId", authMiddleware, PostsController.getPostByUser);


export default router;