import { Router } from "express";
import ComentaryController from "../controllers/commentsController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

router.get("/coments", ComentaryController.getAll);
router.get("/coments/:id", ComentaryController.getById);
router.post("/coments", authMiddleware,ComentaryController.create);
router.put("/coments/:id", authMiddleware,ComentaryController.update);
router.delete("/coments/:id", authMiddleware,ComentaryController.delete);
//depois de horas lutando contra o codigo eu tentei usar o gepeto e ele sugeriu essas duas formas de procurar comentario nao testei pela falta de banco mais ta ai
router.get("/coments/post/:postId", ComentaryController.getByPost);
router.get("/coments/user/:userId", ComentaryController.getByUser);

export default router;
