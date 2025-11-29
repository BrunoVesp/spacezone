import { Router } from "express";
import ComentaryController from "../controllers/commentsController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

router.get("/comments", ComentaryController.getAll);

router.get("/comments/:id", ComentaryController.getById);


router.post("/comments/:postId", authMiddleware, ComentaryController.create);


router.put("/comments/:id", authMiddleware, ComentaryController.update);


router.delete("/comments/:id", authMiddleware, ComentaryController.delete); 


router.get("/comments/post/:postId", ComentaryController.getByPost);


router.get("/comments/user/:userId", authMiddleware, ComentaryController.getByUser);

export default router;
