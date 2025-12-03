"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // 👈 importe o CORS
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const redatorRouter_1 = __importDefault(require("./routes/redatorRouter"));
const postsRouter_1 = __importDefault(require("./routes/postsRouter"));
const commentsRouter_1 = __importDefault(require("./routes/commentsRouter"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./docs/swagger.json"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
//CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // front-end
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use("/uploads", express_1.default.static("uploads"));
// Rotas de usuários
app.use(userRouter_1.default);
// Rotas de redatores
app.use(redatorRouter_1.default);
// Rotas de posts
app.use(postsRouter_1.default);
// Rotas de comentários
app.use(commentsRouter_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
