import { Express } from 'express';
import express from 'express';
import userRouter from './routes/userRouter';


const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`);
})