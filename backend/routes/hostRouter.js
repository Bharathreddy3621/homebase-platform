import express from "express";
import * as hostController from "../controllers/hostController.js";
import upload from "../middleWare/uploads.js";

const hostRouter = express.Router();

const requireHostApi = (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user?._id) {
    return res.status(401).json({ error: "You need to log in first." });
  }

  if (req.session.user.userType !== "host") {
    return res.status(403).json({ error: "Host access required." });
  }

  next();
};

hostRouter.get("/host/homes", requireHostApi, hostController.getHostHomesApi);
hostRouter.post(
  "/host/homes",
  requireHostApi,
  upload.fields([
    { name: "photoUrl", maxCount: 1 },
    { name: "houseRules", maxCount: 1 },
  ]),
  hostController.postAddHomeApi
);
hostRouter.put(
  "/host/homes/:homeId",
  requireHostApi,
  upload.fields([
    { name: "photoUrl", maxCount: 1 },
    { name: "houseRules", maxCount: 1 },
  ]),
  hostController.postEditHomeApi
);
hostRouter.delete("/host/homes/:homeId", requireHostApi, hostController.postDeleteHomeApi);

export default hostRouter;
