import Home from "../models/home.js";
import fs from "fs";

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

export const getHostHomesApi = async (req, res, next) => {
  try {
    const homes = await Home.find();
    return res.json({ homes: homes.map(serializeHome) });
  } catch (error) {
    next(error);
  }
};

export const postAddHomeApi = async (req, res, next) => {
  try {
    const { houseName, price, location, rating, description } = req.body;
    const photoUrl = req.files?.photoUrl?.[0]?.path;
    const houseRules = req.files?.houseRules?.[0]?.path;

    if (!photoUrl || !houseRules) {
      return res
        .status(422)
        .json({ error: "Both a house photo and house rules PDF are required." });
    }

    const home = new Home({
      houseName,
      price,
      location,
      rating,
      photoUrl,
      houseRules,
      description,
    });

    await home.save();
    return res.status(201).json({
      message: "Home registered successfully",
      home: serializeHome(home),
    });
  } catch (error) {
    next(error);
  }
};

export const postEditHomeApi = async (req, res, next) => {
  try {
    const { houseName, price, location, rating, description } = req.body;
    const homeId = req.body.id || req.params.homeId;
    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    const newPhotoUrl = req.files?.photoUrl?.[0]?.path;
    const newHouseRules = req.files?.houseRules?.[0]?.path;

    if (newPhotoUrl) {
      fs.unlink(home.photoUrl, (err) => {
        if (err) {
          console.log("Error while deleting file ", err);
        }
      });
      home.photoUrl = newPhotoUrl;
    }

    if (newHouseRules) {
      fs.unlink(home.houseRules, (err) => {
        if (err) {
          console.log("Error while deleting file ", err);
        }
      });
      home.houseRules = newHouseRules;
    }

    await home.save();
    return res.json({
      message: "Home updated successfully",
      home: serializeHome(home),
    });
  } catch (error) {
    console.log("Error while updating the home", error);
    next(error);
  }
};

export const postDeleteHomeApi = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const deletedHome = await Home.findOneAndDelete({ _id: homeId });

    if (!deletedHome) {
      return res.status(404).json({ error: "Home not found" });
    }

    return res.json({ message: "Home deleted successfully" });
  } catch (error) {
    next(error);
  }
};
