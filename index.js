import express from 'express';
import 'dotenv/config';
import './dbConnect.js';
import {authRouter} from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {staticFilesRouter} from "./routes/staticFilesRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


//routes
app.use('/v1/auth', authRouter)
app.use('/v1/staticFiles', staticFilesRouter)
app.use(
  cors({
    credentials: true,
    origin: ("*")
  })
);

const port = 8000;
app.listen(port, () => console.log(`server is running on port: ${port}`));
