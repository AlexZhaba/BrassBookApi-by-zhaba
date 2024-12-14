import express from "express";
import { loginUser, registerUser, verifyUser, sendCode, refreshToken, passwordUpdate, checkAccessToken, updateUser, updateAvatar } from "../controllers/authController.js";
import authenticate from "../middlwares/auth.js";
import cors from "cors";
import multer from "multer";

const authRouter = express.Router();
authRouter.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_ADDRESS
  })
);

const storage = multer.diskStorage({
  destination: 'images/avatars',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage })

authRouter.post('/registration', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/check', checkAccessToken);
authRouter.put('/verifyuser', verifyUser);
authRouter.put('/sendcode', sendCode);
authRouter.get('/refresh', refreshToken);
authRouter.put('/registration', authenticate, passwordUpdate);
authRouter.put('/', authenticate, updateUser);
authRouter.put('/avatar', authenticate, upload.single('avatar'), updateAvatar);


export { authRouter }