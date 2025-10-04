import { Router } from "express";
import ComentaryController from "../controllers/commentsController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

router.get("/comments", ComentaryController.getAll);
router.get("/comments/:id", ComentaryController.getById);
router.post("/comments/:postId", authMiddleware,ComentaryController.create);
router.put("/comments/:id", authMiddleware,ComentaryController.update);
router.delete("/comments/:id", authMiddleware,ComentaryController.delete);
//depois de horas lutando contra o codigo eu tentei usar o gepeto e ele sugeriu essas duas formas de procurar comentario nao testei pela falta de banco mais ta ai
router.get("/comments/post/:postId", ComentaryController.getByPost);
router.get("/comments/user/:userId", ComentaryController.getByUser);

export default router;
