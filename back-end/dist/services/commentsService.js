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
const prisma_1 = __importDefault(require("../db/prisma"));
const ComentaryService = {
    getAllComentaries() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comentary.findMany({
                include: {
                    user: {
                        select: { nickname: true }
                    },
                    Post: true
                }
            });
        });
    },
    getComentaryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comentary.findUnique({
                where: { id },
                include: {
                    user: {
                        select: { nickname: true }
                    },
                    Post: true
                }
            });
        });
    },
    createComentary(data, userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comentary.create({
                data: {
                    content: data.content,
                    userid: userId,
                    postId: postId,
                    isUpdated: false
                },
                include: {
                    user: true,
                    Post: true
                }
            });
        });
    },
    updateComentary(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comentary.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { isUpdated: true // sempre marca como atualizado
                 }),
                include: {
                    user: true,
                    Post: true
                }
            });
        });
    },
    deleteComentary(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comentary.delete({
                where: { id }
            });
        });
    },
    getComentariesByPost(postId, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            const [comentaries, total] = yield prisma_1.default.$transaction([
                prisma_1.default.comentary.findMany({
                    where: { postId },
                    skip,
                    take,
                    include: {
                        user: { select: { nickname: true } }
                    }
                }),
                prisma_1.default.comentary.count({
                    where: { postId }
                })
            ]);
            return { comentaries, total };
        });
    },
    getComentariesByUser(userId, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            const [comentaries, total] = yield prisma_1.default.$transaction([
                prisma_1.default.comentary.findMany({
                    where: { userid: userId },
                    skip,
                    take,
                    include: {
                        Post: true
                    }
                }),
                prisma_1.default.comentary.count({
                    where: { userid: userId }
                })
            ]);
            return { comentaries, total };
        });
    }
};
exports.default = ComentaryService;
