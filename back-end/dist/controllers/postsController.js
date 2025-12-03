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
const postsService_1 = __importDefault(require("../services/postsService"));
const postSchema_1 = require("../schemas/postSchema");
const zod_1 = require("zod");
const idSchema_1 = require("../schemas/idSchema");
const prisma_1 = __importDefault(require("../db/prisma"));
const deletefile_1 = require("../middleware/deletefile");
const pagination_1 = require("../middleware/pagination");
const PostsController = {
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const [posts, total] = yield Promise.all([
                    postsService_1.default.getAllPosts(skip, limit),
                    postsService_1.default.countPosts()
                ]);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.status(200).json(Object.assign(Object.assign({}, pagination), { data: posts }));
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    getPostById(req, res) {
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
            const { page, limit, skip } = (0, pagination_1.getPagination)(req);
            ;
            try {
                //const post: Post | null = await PostsService.getPostbyId(id, skip, limit);
                const post = yield postsService_1.default.getPostbyId(id);
                //const total = await PostsService.countCommentsByPost(id);
                //const pagination = buildPaginationLinks(req, page, limit, total);
                if (post) {
                    res.status(200).json(post);
                    //res.status(200).json({...pagination, data: post});
                }
                else {
                    res.status(404).json({ message: 'Post não encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = postSchema_1.postCreateSchema.parse(req.body);
                const id = req.user.id;
                if (data.tags) {
                    data.tags = (0, pagination_1.normalizeTags)(data.tags);
                }
                if (req.file) {
                    data.image = `/uploads/${req.file.filename}`;
                }
                if (!id) {
                    res.status(401).json({ error: "Usuário não autenticado." });
                    return;
                }
                const redator = yield prisma_1.default.user.findUnique({ where: { id: req.user.id } });
                if (!(redator === null || redator === void 0 ? void 0 : redator.isRedator)) {
                    throw new Error("Somente redatores podem publicar posts.");
                }
                const newPost = yield postsService_1.default.createPost(id, data);
                res.status(201).json(newPost);
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
                    res.status(400).json({ message: error.message || "Erro ao publicar post" });
                }
            }
        });
    },
    updatePost(req, res) {
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
            try {
                const redator = yield prisma_1.default.user.findUnique({ where: { id: req.user.id } });
                if (!(redator === null || redator === void 0 ? void 0 : redator.isRedator)) {
                    throw new Error("Somente redatores podem atualizar posts.");
                }
                const existingPost = yield prisma_1.default.post.findUnique({ where: { id } });
                if (!existingPost) {
                    res.status(404).json({ message: "Post não encontrado." });
                    return;
                }
                const data = postSchema_1.postUpdateSchema.parse(req.body);
                if (data.tags) {
                    data.tags = (0, pagination_1.normalizeTags)(data.tags);
                }
                if (req.file) {
                    if (existingPost.image) {
                        (0, deletefile_1.deleteFile)(existingPost.image.replace("/uploads/", ""));
                    }
                    data.image = `/uploads/${req.file.filename}`;
                }
                const updatedPost = yield postsService_1.default.updatePost(id, data);
                res.status(200).json(updatedPost);
            }
            catch (error) {
                if (req.file) {
                    (0, deletefile_1.deleteFile)(req.file.filename);
                }
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        errors: error.issues.map((e) => e.message)
                    });
                }
                else {
                    res.status(400).json({ message: error.message || "Erro ao atualizar post" });
                }
            }
        });
    },
    deletePost(req, res) {
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
            try {
                const redator = yield prisma_1.default.user.findUnique({ where: { id: req.user.id } });
                if (!(redator === null || redator === void 0 ? void 0 : redator.isRedator)) {
                    throw new Error("Somente redatores podem deletar posts.");
                }
                const post = yield prisma_1.default.post.findUnique({ where: { id } });
                if (!post) {
                    res.status(404).json({ message: "Post não encontrado." });
                    return;
                }
                if (post.image) {
                    (0, deletefile_1.deleteFile)(post.image);
                }
                const deletedPost = yield postsService_1.default.deletePost(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ message: error.message || "Erro ao deletar post" });
            }
        });
    },
    getPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                if (isNaN(userId)) {
                    res.status(400).json({ message: 'ID inválido' });
                    return;
                }
                if (!req.user || req.user.id !== userId) {
                    res.status(403).json({ message: 'Acesso negado' });
                    return;
                }
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const [posts, total] = yield Promise.all([
                    postsService_1.default.getPostsByUser(userId, skip, limit),
                    postsService_1.default.countPostsByUser(userId)
                ]);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.status(200).json(Object.assign(Object.assign({}, pagination), { data: posts }));
            }
            catch (err) {
                res.status(500).json({ error: "Erro ao buscar posts do usuário" });
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
                const { posts, total } = yield postsService_1.default.searchPosts(query, skip, limit);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.json(Object.assign(Object.assign({}, pagination), { data: posts }));
            }
            catch (error) {
                res.status(500).json({ error: "Erro ao pesquisar posts." });
            }
        });
    }
};
exports.default = PostsController;
