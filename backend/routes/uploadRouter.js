import express from "express";
import upload from "../middleWare/uploads.js";
import * as hostController from "../controllers/hostController.js";
const uploadRouter = express.Router();


uploadRouter.post(
  "/add-home",
  upload.fields([
    { name: "photoUrl", maxCount: 1 },
    { name: "houseRules", maxCount: 1 }
  ]),
  hostController.postAddHome
);

export default uploadRouter;