import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema = new Schema({

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  userType: {
    type: String,
    required: true,
  },

  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
  }],
});

export default mongoose.model("User", userSchema);
