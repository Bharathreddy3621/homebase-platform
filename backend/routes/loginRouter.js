import express from "express";
import * as loginController from "../controllers/loginController.js";

const loginRouter = express.Router();

loginRouter.get("/auth/me", loginController.getCurrentUserApi);
loginRouter.post("/auth/signup", loginController.postSignUpApi);
loginRouter.post("/auth/login", loginController.postLoginApi);
loginRouter.post("/auth/logout", loginController.postLogoutApi);

export default loginRouter;
