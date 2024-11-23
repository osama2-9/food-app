import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  mealId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Meal" },
  quantity: { type: Number, required: true, min: 1 },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    name: { type: String },
    price: { type: Number, default: 0 },
  },
  additions: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: false,
  },
  offerPrice: {
    type: Number,
    required: false,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
