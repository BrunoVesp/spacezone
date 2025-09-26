import { Router} from "express";
import UserController from '../controllers/userController';
import { authMiddleware } from '../middleware/webtoken';

const router = Router();

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', authMiddleware, UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', authMiddleware, UserController.updateUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);
router.post('/users/login', UserController.loginUser);

export default router;