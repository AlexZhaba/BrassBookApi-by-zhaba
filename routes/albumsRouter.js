import express from "express";
import multer from "multer";

import authenticate from "../middlwares/auth.js";
import { createAlbum, deleteAlbum, getAlbums, updateAlbum } from "../controllers/albumController.js";

const albumsRouter = express.Router();


const storage = multer.diskStorage({
  destination: 'images/ablums-preview',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage })

albumsRouter.post('/', authenticate, upload.single('image'), createAlbum)
albumsRouter.get('/', authenticate, getAlbums)
albumsRouter.delete('/:id', authenticate, deleteAlbum)
albumsRouter.patch('/:id', authenticate, upload.single('image'), updateAlbum)

export default albumsRouter