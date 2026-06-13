import express from "express";
import * as homesController from "../controllers/storeController.js";

const storeRouter = express.Router();

const requireLoginApi = (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user?._id) {
    return res.status(401).json({ error: "You need to log in first." });
  }
  next();
};

storeRouter.get("/homes", homesController.getHomesApi);
storeRouter.get("/homes/:homeId", homesController.getHomeDetailsApi);
storeRouter.get("/bookings", homesController.getBookingsApi);
storeRouter.get("/favourites", requireLoginApi, homesController.getFavouriteListApi);
storeRouter.post("/favourites", requireLoginApi, homesController.postAddToFavouriteApi);
storeRouter.delete("/favourites/:homeId", requireLoginApi, homesController.postRemoveFromFavouriteApi);

export default storeRouter;
