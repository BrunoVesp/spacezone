import { Express } from 'express';
import express from 'express';
import userRouter from './routes/userRouter';
import redatorRoutes from './routes/redatorRouter'
import postsRoutes from './routes/postsRouter';
import commentsRouter from './routes/commentsRouter';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import path from "path";

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rotas de usuários
app.use(userRouter);

// Rotas de redatores
app.use(redatorRoutes);

//Rotas para posts
app.use(postsRoutes);

//Rotas para Comments
app.use(commentsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
