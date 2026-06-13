import mongoose from "mongoose";

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  photoUrl: String,
  houseRules: String,
  description: String,
});

async function clearFavoriteRefs() {
  const homeId = this.getQuery()._id;
  const User = mongoose.model("User");
  await User.updateMany(
    { favourites: homeId },
    { $pull: { favourites: homeId } }
  );
}

homeSchema.pre("findOneAndDelete", clearFavoriteRefs);
homeSchema.pre("findByIdAndDelete", clearFavoriteRefs);

export default mongoose.model("Home", homeSchema);
