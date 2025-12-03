"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentsController_1 = __importDefault(require("../controllers/commentsController"));
const webtoken_1 = require("../middleware/webtoken");
const router = (0, express_1.Router)();
router.get("/comments", commentsController_1.default.getAll);
router.get("/comments/:id", commentsController_1.default.getById);
router.post("/comments/:postId", webtoken_1.authMiddleware, commentsController_1.default.create);
router.put("/comments/:id", webtoken_1.authMiddleware, commentsController_1.default.update);
router.delete("/comments/:id", webtoken_1.authMiddleware, commentsController_1.default.delete);
router.get("/comments/post/:postId", commentsController_1.default.getByPost);
router.get("/comments/user/:userId", webtoken_1.authMiddleware, commentsController_1.default.getByUser);
exports.default = router;
