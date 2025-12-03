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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserService = {
    getAllUsers(skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield prisma_1.default.user.count();
            const users = yield prisma_1.default.user.findMany({
                skip,
                take
            });
            return { total, users };
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findUnique({
                where: { id },
                include: { Post: true, Comentary: true }
            });
        });
    },
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.create({ data });
        });
    },
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.update({ where: { id }, data });
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.delete({ where: { id } });
        });
    },
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({ where: { email } });
            if (!user)
                return null;
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid)
                return null;
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET_TOKEN, { expiresIn: '24h' });
            return { user, token };
        });
    },
    searchUsers(query, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, total] = yield prisma_1.default.$transaction([
                prisma_1.default.user.findMany({
                    where: {
                        OR: [
                            { nickname: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } }
                        ]
                    },
                    skip,
                    take,
                    orderBy: { nickname: "asc" },
                    select: {
                        id: true,
                        nickname: true,
                        email: true,
                        profileImage: true
                    }
                }),
                prisma_1.default.user.count({
                    where: {
                        OR: [
                            { nickname: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } }
                        ]
                    }
                })
            ]);
            return { users, total };
        });
    }
};
exports.default = UserService;
