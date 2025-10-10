import express, { Express } from 'express';
import cors from 'cors'; // 👈 importe o CORS
import userRouter from './routes/userRouter';
import redatorRoutes from './routes/redatorRouter';
import postsRoutes from './routes/postsRouter';
import commentsRouter from './routes/commentsRouter';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './docs/swagger';

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());

//CORS
app.use(cors({
    origin: "http://localhost:5173", // front-end
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));

// Rotas de usuários
app.use(userRouter);

// Rotas de redatores
app.use(redatorRoutes);

// Rotas de posts
app.use(postsRoutes);

// Rotas de comentários
app.use(commentsRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
