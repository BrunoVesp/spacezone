"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const webtoken_1 = require("../middleware/webtoken");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get("/users/search", userController_1.default.search);
router.get('/users', userController_1.default.getAllUsers);
router.get('/users/:id', webtoken_1.authMiddleware, userController_1.default.getUserById);
router.post('/users', multer_1.upload.single("image"), userController_1.default.createUser);
router.put('/users/:id', multer_1.upload.single("image"), webtoken_1.authMiddleware, userController_1.default.updateUser);
router.delete('/users/:id', webtoken_1.authMiddleware, userController_1.default.deleteUser);
router.post('/users/login', userController_1.default.loginUser);
exports.default = router;
