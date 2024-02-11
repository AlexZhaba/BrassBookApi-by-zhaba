import express from "express";
import {loginUser, registerUser} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/registration', registerUser);
authRouter.post('/login', loginUser);



export { authRouter }