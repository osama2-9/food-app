import mongoose, { Document } from "mongoose";

export interface Irestaurant extends Document {
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  cuisineType: string;
  menu: mongoose.Types.ObjectId[];
  createdAt: Date;
  brandImg: string;
}

const restaurantSchema = new mongoose.Schema<Irestaurant>({
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
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: (props: { value: string }) =>
          `${props.value} is not a valid email!`,
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

});
restaurantSchema.index({ name: "text" })
const Restaurant = mongoose.model<Irestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
