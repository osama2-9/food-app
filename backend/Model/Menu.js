import mongoose from "mongoose";
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mealType: {
    type: String,
    required: true,
    enum: [
      "Fast-Food",
      "Dessert",
      "Grilled",
      "Smoothies",
      "Appetizers",
      "Pizza",
    ],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  mealImg: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sizes: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: undefined,
    required: false,
  },
  additions: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: undefined,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberOfRatings: {
    type: Number,
    default: 0,
  },
});

menuItemSchema.index({ restaurant: 1 });
menuItemSchema.index({ name: "text" });

const Menu = mongoose.model("MenuItem", menuItemSchema);

export default Menu