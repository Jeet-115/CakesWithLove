import mongoose from "mongoose";

const cakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    flavor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false, // for soft delete
    },
  },
  { timestamps: true }
);

const Cake = mongoose.model("Cake", cakeSchema);

export default Cake;
