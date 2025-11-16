import { Router } from "express";
import PostsController from "../controllers/postsController";
import { authMiddleware } from "../middleware/webtoken";
import { upload } from "../middleware/multer";

const router = Router();

router.get("/posts",  PostsController.getAllPosts);
router.get("/posts/:id", PostsController.getPostById);
router.post("/posts", upload.single("image"), authMiddleware, PostsController.createPost);
router.put("/posts/:id", upload.single("image"), authMiddleware, PostsController.updatePost);
router.delete("/posts/:id", authMiddleware, PostsController.deletePost);

export default router;