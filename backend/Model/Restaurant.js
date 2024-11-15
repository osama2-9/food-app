import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v) => /\S+@\S+\.\S+/.test(v),
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
    },
    cuisineType: {
      type: String,
      required: true,
      trim: true,
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    brandImg: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: "text" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant