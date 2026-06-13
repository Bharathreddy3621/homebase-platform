import express from "express";
import * as errorsController from "../controllers/errors.js";

const errorRouter = express.Router();

errorRouter.get("/404", errorsController.pageNotFound);

export default errorRouter;
