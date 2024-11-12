import mongoose, { Document, Schema } from "mongoose";

export interface Size {
  name: string;
  price: number;
}

export interface Addition {
  name: string;
  price: number;
}

export interface Imenu extends Document {
  name: string;
  description: string;
  price: number;
  mealImg: string;
  restaurant: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  sizes?: Size[];
  additions?: Addition[];
  mealType: string
}

const menuItemSchema: Schema<Imenu> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mealType: {
    type: String,
    required: true,
    enum: ["Fast-Food", "Dessert", "Grilled", "Smoothies", "Appitizers", "Pizza"]
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
    required: false
  },
  additions: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: undefined,
    required: false
  },
});

menuItemSchema.index({ restaurant: 1 });
menuItemSchema.index({ name: "text" })

const MenuItem = mongoose.model<Imenu>("MenuItem", menuItemSchema);

export default MenuItem;
