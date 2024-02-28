import mongoose from "mongoose";

const PhotosSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Photos", PhotosSchema);
