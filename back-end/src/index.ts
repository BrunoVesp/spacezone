import { Express } from 'express';
import express from 'express';
import userRouter from './routes/userRouter';
import redatorRoutes from './routes/redatorRouter'
import postsRoutes from './routes/postsRouter';

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());

// Rotas de usuários
app.use(userRouter);

// Rotas de redatores
app.use(redatorRoutes);

//Rotas para posts
app.use(postsRoutes);

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`);
});
