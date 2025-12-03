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
const commentsService_1 = __importDefault(require("../services/commentsService"));
const idSchema_1 = require("../schemas/idSchema");
const commentSchema_1 = require("../schemas/commentSchema");
const zod_1 = require("zod");
const pagination_1 = require("../middleware/pagination");
const ComentaryController = {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comentaries = yield commentsService_1.default.getAllComentaries();
                res.json(comentaries);
            }
            catch (err) {
                res.status(500).json({ error: "Erro ao buscar comentários" });
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const comentary = yield commentsService_1.default.getComentaryById(id);
                if (!comentary)
                    return res.status(404).json({ error: "Comentário não encontrado" });
                res.json(comentary);
            }
            catch (err) {
                res.status(500).json({ error: "Erro ao buscar comentário" });
            }
        });
    },
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let postId;
            try {
                ({ id: postId } = idSchema_1.idSchema.parse({ id: req.params.postId }));
                const data = commentSchema_1.commentSchema.parse(req.body);
                const userid = req.user.id;
                const comentary = yield commentsService_1.default.createComentary(data, userid, postId);
                res.status(201).json(comentary);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        errors: error.issues.map((e) => e.message)
                    });
                }
                else {
                    res.status(400).json({ message: error.message || "Erro ao publicar post" });
                }
                res.status(500).json({ error: "Erro ao criar comentário" });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (Number.isNaN(id) || id <= 0) {
                    return res.status(400).json({ error: "ID inválido" });
                }
                const { content } = req.body;
                // Busca o comentário para verificar o autor
                const comentary = yield commentsService_1.default.getComentaryById(id);
                if (!comentary)
                    return res.status(404).json({ error: "Comentário não encontrado" });
                // Verifica se o usuário autenticado é o criador do comentário
                if (comentary.userid !== req.user.id) {
                    return res.status(403).json({ error: "Você não tem permissão para editar este comentário" });
                }
                const updatedComentary = yield commentsService_1.default.updateComentary(id, { content });
                res.json(updatedComentary);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Erro ao atualizar comentário", details: err });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                // Busca o comentário para verificar o autor
                const comentary = yield commentsService_1.default.getComentaryById(id);
                if (!comentary)
                    return res.status(404).json({ error: "Comentário não encontrado" });
                // Verifica se o usuário autenticado é o criador do comentário
                if (comentary.userid !== req.user.id) {
                    return res.status(403).json({ error: "Você não tem permissão para deletar este comentário" });
                }
                yield commentsService_1.default.deleteComentary(id);
                res.json({ message: "Comentário deletado com sucesso" });
            }
            catch (err) {
                res.status(500).json({ error: "Erro ao deletar comentário" });
            }
        });
    },
    getByPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = Number(req.params.postId);
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const { comentaries, total } = yield commentsService_1.default.getComentariesByPost(postId, skip, limit);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.json(Object.assign(Object.assign({}, pagination), { data: comentaries }));
            }
            catch (err) {
                res.status(500).json({ error: "Erro ao buscar comentários do post" });
            }
        });
    },
    getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                if (!req.user || req.user.id !== userId) {
                    return res.status(403).json({ error: "Acesso negado" });
                }
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const { comentaries, total } = yield commentsService_1.default.getComentariesByUser(userId, skip, limit);
                const pagination = (0, pagination_1.buildPaginationLinks)(req, page, limit, total);
                res.json(Object.assign(Object.assign({}, pagination), { data: comentaries }));
            }
            catch (err) {
                res.status(500).json({ error: "Erro ao buscar comentários do usuário" });
            }
        });
    }
};
exports.default = ComentaryController;
