import mongoose, { Document, Schema } from "mongoose";

export interface Imenu extends Document {
  name: string;
  description: string;
  price: number;
  mealImg: string;
  restaurant: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  sizes?: string[]; 
  additions?: string[];
}

const menuItemSchema: Schema<Imenu> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
    type: [String],
    enum: ["sm", "lg"],
    default: undefined,
  },
  additions: {
    type: [String],
    default: undefined,
  },
});

menuItemSchema.index({ restaurant: 1 });

const MenuItem = mongoose.model<Imenu>("MenuItem", menuItemSchema);

export default MenuItem;
