import express from "express";
import multer from "multer";
import cors from "cors";

import authenticate from "../middlwares/auth.js";
import { createAlbum, getAlbums } from "../controllers/albumController.js";

const albumsRouter = express.Router();

albumsRouter.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
);

const storage = multer.diskStorage({
  destination: 'images/ablums-preview',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage })

albumsRouter.post('/', authenticate, upload.single('image'), createAlbum)
albumsRouter.get('/', authenticate, getAlbums)

export default albumsRouter