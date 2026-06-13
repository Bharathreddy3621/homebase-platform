import Home from "../models/home.js";
import User from "../models/user.js";

const serializeHome = (home) => {
  const plainHome = home.toObject({ versionKey: false });

  return {
    ...plainHome,
    _id: plainHome._id.toString(),
    photoUrl: plainHome.photoUrl ? `/${plainHome.photoUrl.replace(/\\/g, "/")}` : "",
    houseRules: plainHome.houseRules
      ? `/${plainHome.houseRules.replace(/\\/g, "/")}`
      : "",
  };
};

export const getHomesApi = async (req, res, next) => {
  try {
    const homes = await Home.find();
    return res.json({ homes: homes.map(serializeHome) });
  } catch (error) {
    next(error);
  }
};

export const getHomeDetailsApi = async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.homeId);
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    return res.json({ home: serializeHome(home) });
  } catch (error) {
    next(error);
  }
};

export const getBookingsApi = (req, res) => {
  res.json({
    bookings: [],
    message: "Bookings are not connected yet.",
  });
};

export const getFavouriteListApi = async (req, res, next) => {
  try {
    if (!req.session.user?._id) {
      return res.status(401).json({ error: "You need to log in first." });
    }

    const currentUser = await User.findById(req.session.user._id).populate(
      "favourites"
    );
    if (!currentUser) {
      return res.status(401).json({ error: "You need to log in first." });
    }

    return res.json({
      favourites: currentUser.favourites.map(serializeHome),
    });
  } catch (error) {
    next(error);
  }
};

export const postAddToFavouriteApi = async (req, res, next) => {
  try {
    if (!req.session.user?._id) {
      return res.status(401).json({ error: "You need to log in first." });
    }

    const homeId = req.body.id || req.body.homeId;
    if (!homeId) {
      return res.status(400).json({ error: "Home id is required." });
    }

    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) {
      return res.status(401).json({ error: "You need to log in first." });
    }

    const alreadySaved = currentUser.favourites.some(
      (favouriteId) => favouriteId.toString() === homeId
    );

    if (!alreadySaved) {
      currentUser.favourites.push(homeId);
      await currentUser.save();
    }

    const refreshedUser = await User.findById(req.session.user._id).populate(
      "favourites"
    );

    return res.json({
      message: "Favourite updated",
      favourites: refreshedUser.favourites.map(serializeHome),
    });
  } catch (error) {
    next(error);
  }
};

export const postRemoveFromFavouriteApi = async (req, res, next) => {
  try {
    if (!req.session.user?._id) {
      return res.status(401).json({ error: "You need to log in first." });
    }

    const homeId = req.params.homeId || req.body.homeId;
    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) {
      return res.status(401).json({ error: "You need to log in first." });
    }

    currentUser.favourites = currentUser.favourites.filter(
      (fav) => fav.toString() !== homeId
    );
    await currentUser.save();

    const refreshedUser = await User.findById(req.session.user._id).populate(
      "favourites"
    );
    return res.json({
      message: "Favourite updated",
      favourites: refreshedUser.favourites.map(serializeHome),
    });
  } catch (error) {
    next(error);
  }
};
