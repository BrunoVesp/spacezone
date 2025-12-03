import express, { Express } from 'express';
import cors from 'cors'; // 👈 importe o CORS
import userRouter from './routes/userRouter';
import redatorRoutes from './routes/redatorRouter';
import postsRoutes from './routes/postsRouter';
import commentsRouter from './routes/commentsRouter';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import path from "path";

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());

//CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));

app.use("/uploads", express.static("uploads"));

// Rotas de usuários
app.use(userRouter);

// Rotas de redatores
app.use(redatorRoutes);

// Rotas de posts
app.use(postsRoutes);

// Rotas de comentários
app.use(commentsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
