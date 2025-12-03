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
const postSchema_1 = require("../schemas/postSchema");
const PostsService = {
    getAllPosts(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    subtitle: true,
                    createdAt: true, // Incluindo a data de criação
                    image: true, // Incluindo a imagem
                    author: {
                        select: { nickname: true } // Incluindo o autor
                    },
                    tags: true
                },
                orderBy: { id: "desc" }
            });
        });
    },
    countPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.count();
        });
    },
    getPostbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.findUnique({
                where: { id },
                include: {
                    author: {
                        select: { nickname: true }
                    },
                    comentarys: {
                        //skip,
                        //take,
                        orderBy: { createdAt: "desc" },
                        select: {
                            id: true,
                            createdAt: true,
                            isUpdated: true,
                            content: true,
                            user: {
                                select: {
                                    id: true,
                                    nickname: true,
                                    profileImage: true
                                }
                            }
                        }
                    }
                }
            });
        });
    },
    countCommentsByPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comentary.count({
                where: { postId }
            });
        });
    },
    getPostsByUser(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.findMany({
                where: { authorId: userId },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    author: { select: { nickname: true } }
                }
            });
        });
    },
    countPostsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.count({
                where: { authorId: userId }
            });
        });
    },
    createPost(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const redator = yield prisma_1.default.user.findUnique({ where: { id } });
            if (!(redator === null || redator === void 0 ? void 0 : redator.isRedator)) {
                throw new Error("Somente redatores podem criar posts.");
            }
            return prisma_1.default.post.create({
                data: {
                    title: data.title,
                    subtitle: data.subtitle,
                    body: data.body,
                    authorId: redator.id,
                    image: data.image || null,
                    tags: data.tags,
                },
            });
        });
    },
    updatePost(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.update({
                where: { id },
                data,
            });
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.delete({
                where: { id },
            });
        });
    },
    searchPosts(query, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalized = query.trim().toLowerCase();
            const matchedTags = postSchema_1.allowedTags.filter(tag => tag.includes(normalized));
            const whereFilter = {
                OR: [
                    { title: { contains: query } },
                    { subtitle: { contains: query } },
                    { body: { contains: query } },
                    ...matchedTags.map(tag => ({ tags: { has: tag.toLowerCase() } }))
                ]
            };
            const [posts, total] = yield prisma_1.default.$transaction([
                prisma_1.default.post.findMany({
                    where: whereFilter,
                    skip,
                    take,
                    orderBy: { createdAt: "desc" },
                    include: {
                        author: {
                            select: { nickname: true }
                        }
                    }
                }),
                prisma_1.default.post.count({ where: whereFilter })
            ]);
            return { posts, total };
        });
    }
};
exports.default = PostsService;
