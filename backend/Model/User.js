import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      name: {
        type: String,
      },
      coordinates: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
      },
      building: {
        type: String,
      },
      floor: {
        type: String,
      },
      apartment: {
        type: String,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAccountActive: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiresAt: { type: Date },
    verificationCodeToken: { type: String },
    verificationCodeTokenExpiresAt: { type: Date },
    verificationCode: { type: Number },
    activeitionToken: { type: String },
    activeitionTokenExpiresAt: { type: Date },
    lastLogin: {
      type: Date,
      default: "",
    },
    coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }], 
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
