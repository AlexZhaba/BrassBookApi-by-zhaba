import express from 'express';
import 'dotenv/config';
import './dbConnect.js';
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { staticFilesRouter } from "./routes/staticFilesRouter.js";
import compositionsRouter from "./routes/compositionsRouter.js"
import compositionRouter from "./routes/compositionRouter.js";
import albumsRouter from './routes/albumsRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// отдает статические файлы
app.use('/compositions', express.static('compositions'))
app.use('/images', express.static('images'))
//routes
app.use('/v1/auth', authRouter)
app.use('/v1/user/compositions', compositionsRouter)
app.use('/v1/user/composition', compositionRouter)
app.use('/v1/albums', albumsRouter)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
// Нет смысла использовать
// app.use('/v1/staticFiles', staticFilesRouter)


const port = 8000;
app.listen(port, () => console.log(`server is running on port: ${port}`));

