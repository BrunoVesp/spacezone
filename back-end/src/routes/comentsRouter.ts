import { Router } from "express";
import ComentaryController from "../controllers/comentsController";

const router = Router();

router.get("/coments", ComentaryController.getAllcoments);
router.get("/coments/:id", ComentaryController.getcomentById);
router.post("/coments", ComentaryController.createcoment);
router.put("/coments/:id", ComentaryController.updatecoment);
router.delete("/coments/:id", ComentaryController.deletecoment);
//depois de horas lutando contra o codigo eu tentei usar o gepeto e ele sugeriu essas duas formas de procurar comentario nao testei pela falta de banco mais ta ai
router.get("/coments/post/:postId", ComentaryController.getByPost);
router.get("/coments/user/:userId", ComentaryController.getByUser);

export default router;
