import { Router } from "express";
import RedatorController from "../controllers/redatorController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

// Redatores
router.post("/redatores", RedatorController.createRedator);
router.get("/redatores", RedatorController.getAllRedatores);
router.get("/redatores/:id", RedatorController.getRedatorById);
router.delete("/redatores/:id", authMiddleware, RedatorController.demoteRedator);

// Posts
router.post("/redatores/:id/posts", authMiddleware, RedatorController.createPost);
router.put("/posts/:postId", authMiddleware, RedatorController.updatePost);
router.delete("/posts/:postId", authMiddleware, RedatorController.deletePost);

export default router;