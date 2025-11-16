import { Router} from "express";
import UserController from '../controllers/userController';
import { authMiddleware } from '../middleware/webtoken';
import { upload } from "../middleware/multer";

const router = Router();

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', authMiddleware, UserController.getUserById);
router.post('/users', upload.single("image"), UserController.createUser);
router.put('/users/:id', upload.single("image"), authMiddleware, UserController.updateUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);
router.post('/users/login', UserController.loginUser);

export default router;