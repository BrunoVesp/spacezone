import { Router } from "express";
import RedatorController from "../controllers/redatorController";
import { authMiddleware } from "../middleware/webtoken";

const router = Router();

// Redatores
router.put("/redatores/promote/:id", authMiddleware, RedatorController.createRedator);
router.get("/redatores", RedatorController.getAllRedatores);
router.put("/redatores/demote/:id", authMiddleware, RedatorController.demoteRedator);

export default router;