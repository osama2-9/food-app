import mongoose from "mongoose";
const offerSchema = new mongoose.Schema({
  restaurntId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  validity: {
    type: Date,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Offer = mongoose.model("offer", offerSchema);

export default Offer;
