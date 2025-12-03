"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = require("../schemas/userSchema");
const idSchema_1 = require("../schemas/idSchema");
const deletefile_1 = require("../middleware/deletefile");
const zod_1 = require("zod");
const pagination_1 = require("../middleware/pagination");
const UserController = {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const { total, users } = yield userService_1.default.getAllUsers(skip, limit);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.status(200).json({
                    pagination,
                    data: users
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let id;
            try {
                ({ id } = idSchema_1.idSchema.parse(req.params));
            }
            catch (error) {
                res.status(400).json({
                    message: 'ID inválido',
                    errors: (_c = (_b = ((_a = error.errors) !== null && _a !== void 0 ? _a : error.issues)) === null || _b === void 0 ? void 0 : _b.map((e) => e.message)) !== null && _c !== void 0 ? _c : [error.message]
                });
                return;
            }
            if (!req.user || req.user.id !== id) {
                res.status(403).json({ message: 'Acesso negado' });
                return;
            }
            try {
                const user = yield userService_1.default.getUserById(id);
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = userSchema_1.createUserSchema.parse(req.body);
                if (req.file) {
                    data.profileImage = `/uploads/${req.file.filename}`;
                }
                const salt = yield bcrypt_1.default.genSalt();
                const hashedPassword = yield bcrypt_1.default.hash(data.password, salt);
                data.password = hashedPassword;
                const newUser = yield userService_1.default.createUser(data);
                res.status(201).json(newUser);
            }
            catch (error) {
                if (req.file) {
                    (0, deletefile_1.deleteFile)(req.file.filename);
                }
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        errors: error.issues.map(e => e.message)
                    });
                }
                else {
                    const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
                    res.status(500).json({ message: errorMessage });
                }
            }
        });
    },
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            let id;
            try {
                ({ id } = idSchema_1.idSchema.parse(req.params));
            }
            catch (error) {
                res.status(400).json({
                    message: 'ID inválido',
                    errors: (_c = (_b = ((_a = error.errors) !== null && _a !== void 0 ? _a : error.issues)) === null || _b === void 0 ? void 0 : _b.map((e) => e.message)) !== null && _c !== void 0 ? _c : [error.message]
                });
                return;
            }
            if (!req.user || req.user.id !== id) {
                res.status(403).json({ message: 'Acesso negado' });
                return;
            }
            let dataUpdate;
            try {
                const existingUser = yield userService_1.default.getUserById(id);
                if (!existingUser) {
                    res.status(404).json({ message: "Usuário não encontrado." });
                    return;
                }
                dataUpdate = userSchema_1.updateUserSchema.parse(req.body);
                if (req.file) {
                    if (existingUser.profileImage) {
                        const oldFile = existingUser.profileImage.replace("/uploads/", "");
                        (0, deletefile_1.deleteFile)(oldFile);
                    }
                    dataUpdate.profileImage = `/uploads/${req.file.filename}`;
                }
                if (dataUpdate.password !== undefined) {
                    const salt = yield bcrypt_1.default.genSalt();
                    const hashedPassword = yield bcrypt_1.default.hash(dataUpdate.password, salt);
                    dataUpdate.password = hashedPassword;
                }
            }
            catch (error) {
                if (req.file) {
                    (0, deletefile_1.deleteFile)(req.file.filename);
                }
                res.status(400).json({
                    message: 'Dados inválidos',
                    errors: (_f = (_e = ((_d = error.errors) !== null && _d !== void 0 ? _d : error.issues)) === null || _e === void 0 ? void 0 : _e.map((e) => e.message)) !== null && _f !== void 0 ? _f : [error.message]
                });
                return;
            }
            try {
                const updatedUser = yield userService_1.default.updateUser(id, dataUpdate);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let id;
            try {
                ({ id } = idSchema_1.idSchema.parse(req.params));
            }
            catch (error) {
                res.status(400).json({
                    message: 'ID inválido',
                    errors: (_c = (_b = ((_a = error.errors) !== null && _a !== void 0 ? _a : error.issues)) === null || _b === void 0 ? void 0 : _b.map((e) => e.message)) !== null && _c !== void 0 ? _c : [error.message]
                });
                return;
            }
            if (!req.user || req.user.id !== id) {
                res.status(403).json({ message: 'Acesso negado' });
                return;
            }
            try {
                const user = yield userService_1.default.getUserById(id);
                if (!user) {
                    res.status(404).json({ message: "Usuário não encontrado." });
                    return;
                }
                if (user.profileImage) {
                    (0, deletefile_1.deleteFile)(user.profileImage);
                }
                const deletedUser = yield userService_1.default.deleteUser(id);
                res.status(200).json(deletedUser);
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let data;
            try {
                data = userSchema_1.loginUserSchema.parse(req.body);
            }
            catch (error) {
                res.status(400).json({
                    message: 'Dados inválidos',
                    errors: (_c = (_b = ((_a = error.errors) !== null && _a !== void 0 ? _a : error.issues)) === null || _b === void 0 ? void 0 : _b.map((e) => e.message)) !== null && _c !== void 0 ? _c : [error.message]
                });
                return;
            }
            try {
                const result = yield userService_1.default.loginUser(data.email, data.password);
                if (result) {
                    res.status(200).json(result);
                }
                else {
                    res.status(401).json({ message: 'Invalid email or password' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query.query || "";
                if (!query.trim()) {
                    return res.status(400).json({ error: "Query de pesquisa obrigatória." });
                }
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const { users, total } = yield userService_1.default.searchUsers(query, skip, limit);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.json(Object.assign(Object.assign({}, pagination), { data: users }));
            }
            catch (error) {
                res.status(500).json({ error: "Erro ao pesquisar usuários." });
            }
        });
    }
};
exports.default = UserController;
