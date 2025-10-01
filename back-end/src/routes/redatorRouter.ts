import { Router } from "express";
import RedatorController from "../controllers/redatorController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

// Redatores
router.post("/redatores/promote/:id", authMiddleware, RedatorController.createRedator);
router.get("/redatores", RedatorController.getAllRedatores);
router.get("/redatores/:id", RedatorController.getRedatorById);
router.delete("/redatores/demote/:id", authMiddleware, RedatorController.demoteRedator);

export default router;