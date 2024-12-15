import express from "express";
import compositionsController from "../controllers/compositionsController.js";
import authenticate from "../middlwares/auth.js";

const compositionsRouter = express.Router();

compositionsRouter.get('/page=:page&size=:size', authenticate, compositionsController.getAllCompositions)

export default compositionsRouter