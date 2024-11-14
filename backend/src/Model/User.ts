import mongoose, { Document, Schema } from "mongoose";
import { Request, Response } from "express";

export interface IUser extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  verificationCodeToken?: string;
  verificationCode?: number;
  verificationCodeTokenExpiresAt?: Date;
  address: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    building: string;
    floor: string;
    apartment: string;
  };
}

const UserSchema: Schema<IUser> = new Schema(
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
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiresAt: { type: Date },
    verificationCodeToken: { type: String },
    verificationCodeTokenExpiresAt: { type: Date },
    verificationCode: { type: Number },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
