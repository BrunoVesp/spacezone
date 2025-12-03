"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postsController_1 = __importDefault(require("../controllers/postsController"));
const webtoken_1 = require("../middleware/webtoken");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get("/posts/search", postsController_1.default.search);
router.get("/posts", postsController_1.default.getAllPosts);
router.get("/posts/:id", postsController_1.default.getPostById);
router.post("/posts", multer_1.upload.single("image"), webtoken_1.authMiddleware, postsController_1.default.createPost);
router.put("/posts/:id", multer_1.upload.single("image"), webtoken_1.authMiddleware, postsController_1.default.updatePost);
router.delete("/posts/:id", webtoken_1.authMiddleware, postsController_1.default.deletePost);
router.get("/posts/redator/:userId", webtoken_1.authMiddleware, postsController_1.default.getPostByUser);
exports.default = router;
