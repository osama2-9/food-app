import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
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
    name: String,
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
        required: true
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      building: {
        type: String,
        required: true,
      },
      floor: {
        type: String,
        required: true,
      },
      apartment: {
        type: String,
        required: true,
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
    resetPasswordToken: { type: String, default: undefined },
    resetPasswordTokenExpiresAt: { type: Date, default: undefined },
    verificationCodeToken: { type: String, default: undefined },
    verificationCodeTokenExpiresAt: { type: Date, default: undefined },
    verificationCode: { type: Number, default: undefined },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
