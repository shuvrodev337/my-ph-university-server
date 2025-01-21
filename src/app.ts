import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true })); // frontend live link will be added here

app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  const a = 'Hello World!';
  res.send(a);
};
app.get('/', test);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
