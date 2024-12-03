import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    default: 25,
  },
  minOrders: {
    type: Number,
    required: true,
    default: 10,
  },
 
  expirationDate: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model("coupon", couponSchema);

export default Coupon;
