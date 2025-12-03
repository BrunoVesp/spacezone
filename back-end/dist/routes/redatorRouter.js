"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redatorController_1 = __importDefault(require("../controllers/redatorController"));
const webtoken_1 = require("../middleware/webtoken");
const router = (0, express_1.Router)();
router.put("/redatores/promote/", webtoken_1.authMiddleware, redatorController_1.default.createRedator);
router.get("/redatores", redatorController_1.default.getAllRedatores);
router.put("/redatores/demote/:id", webtoken_1.authMiddleware, redatorController_1.default.demoteRedator);
exports.default = router;
