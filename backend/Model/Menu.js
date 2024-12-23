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
  sizes: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: undefined,
  },
  additions: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: undefined,
  },

  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  isOffer: {
    type: Boolean,
    default: false,
  },
  offerValidity: {
    type: Date,
    required: function () {
      return this.isOffer;
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  offerPrice: {
    type: Number,
    min: 0,
    required: function () {
      return this.isOffer;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

menuItemSchema.index({ restaurant: 1 });
menuItemSchema.index({ name: "text" });

const Menu = mongoose.model("MenuItem", menuItemSchema);

export default Menu;
