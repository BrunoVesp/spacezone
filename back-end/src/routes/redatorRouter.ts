import { Router } from "express";
import RedatorController from "../controllers/redatorController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

// Redatores
router.post("/redatores", RedatorController.createRedator);
router.get("/redatores", RedatorController.getAllRedatores);

// Posts
router.post("/redatores/:id/posts", authMiddleware, RedatorController.createPost);
router.put("/posts/:postId", authMiddleware, RedatorController.updatePost);
router.delete("/posts/:postId", authMiddleware, RedatorController.deletePost);

export default router;