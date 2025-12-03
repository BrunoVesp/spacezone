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
const redatorService_1 = __importDefault(require("../services/redatorService"));
const idSchema_1 = require("../schemas/idSchema");
const prisma_1 = __importDefault(require("../db/prisma"));
const promoteSchema_1 = require("../schemas/promoteSchema");
const pagination_1 = require("../middleware/pagination");
const RedatorController = {
    createRedator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // valida nickname + email
                const { email, nickname } = promoteSchema_1.promoteSchema.parse(req.body);
                // quem está tentando promover?
                const requester = yield prisma_1.default.user.findUnique({
                    where: { id: req.user.id }
                });
                const redatores = yield prisma_1.default.user.count({ where: { isRedator: true } });
                // regra: se já existe redator, só redator pode promover
                if (redatores > 0 && !(requester === null || requester === void 0 ? void 0 : requester.isRedator)) {
                    return res.status(403).json({
                        message: "Apenas redatores podem promover usuários."
                    });
                }
                // buscar usuário pelo email e nickname
                const user = yield prisma_1.default.user.findFirst({
                    where: { email, nickname }
                });
                if (!user) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                }
                // promover
                const novoRedator = yield redatorService_1.default.createRedator(user.id);
                return res.status(201).json(novoRedator);
            }
            catch (error) {
                if (error.errors) {
                    return res.status(400).json({ errors: error.errors });
                }
                return res.status(400).json({ message: error.message });
            }
        });
    },
    getAllRedatores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, skip } = (0, pagination_1.getPagination)(req);
                const { total, redatores } = yield redatorService_1.default.getAllRedatores(skip, limit);
                res.status(200).json({
                    pagination: (0, pagination_1.buildPaginationLinks)(req, page, limit, total),
                    data: redatores
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    demoteRedator(req, res) {
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
            // Apenas o próprio redator pode se rebaixar
            if (!req.user || req.user.id !== id) {
                res.status(403).json({ message: 'Você só pode rebaixar a si mesmo.' });
                return;
            }
            // Verifica se o usuário é redator
            const redator = yield prisma_1.default.user.findUnique({ where: { id } });
            if (!(redator === null || redator === void 0 ? void 0 : redator.isRedator)) {
                res.status(403).json({ message: 'Apenas redatores podem se rebaixar.' });
                return;
            }
            try {
                yield redatorService_1.default.demoteRedator(id);
                res.status(200).json({ message: "Redator rebaixado com sucesso." });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    },
};
exports.default = RedatorController;
