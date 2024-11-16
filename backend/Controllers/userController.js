import bcrypt from "bcryptjs";
import User from "../Model/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVC } from "../emails/SendVerificationCode.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import Restaurant from "../Model/Restaurant.js";
import Menu from "../Model/Menu.js";
import Order from "../Model/Order.js";

const hasAuth = (req) => {
  return req.cookies.auth !== undefined;
};

export const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone } = req.body;

    if (!firstname || !lastname || !email || !password || !phone) {
      return res.status(400).json({
        error: "Please fill all form fields.",
      });
    }

    const findSameEmailOrPhone = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (findSameEmailOrPhone) {
      return res.status(400).json({
        error: "Email or phone already used.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashPassword,
    });

    const createdUser = await newUser.save();

    if (createdUser) {
      generateToken(createdUser._id.toString(), res);
      createdUser.lastLogin = new Date();
      await createdUser.save();
      return res.status(201).json({
        message: "Account created successfully.",
        userData: {
          firstname,
          lastname,
          email,
          phone,
          uid: createdUser._id,
          isAdmin: createdUser.isAdmin,
          isVerified: createdUser.isVerified,
        },
      });
    }

    return res.status(500).json({ error: "Failed to create account." });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const hasAuthCookie = hasAuth(req);

    if (hasAuthCookie) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please fill all form fields.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    generateToken(user._id.toString(), res);
    user.lastLogin = new Date();
    await user.save();
    return res.status(200).json({
      uid: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("auth", null, {
      maxAge: 1,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const {
      uid,
      firstname,
      lastname,
      email,
      phone,
      lat,
      lng,
      apartment,
      building,
      name,
      floor,
    } = req.body;

    if (!uid) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (lat || lng || apartment || building || name || floor) {
      user.address.coordinates.lat = lat || user.address.coordinates.lat;
      user.address.coordinates.lng = lng || user.address.coordinates.lng;
      user.address.building = building || user.address.building;
      user.address.floor = floor || user.address.floor;
      user.address.apartment = apartment || user.address.apartment;
      user.address.name = name || user.address.name;
    }

    const updatedUser = await user.save();

    if (!updatedUser) {
      return res.status(400).json({
        error: "Error occurred while updating user profile",
      });
    }

    return res.status(200).json({
      uid: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isVerified: updatedUser.isVerified,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const deleteAttempt = await user.deleteOne();
    if (deleteAttempt) {
      return res.status(200).json({
        message: "User deleted successfully",
      });
    } else {
      return res.status(400).json({
        error: "Error while trying to delete user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const usersData = users.map((user) => ({
      uid: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      address: user.address,
      lastLogin: user.lastLogin,
    }));

    return res.status(200).json(usersData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "No user found" });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }

    const code = generateVerificationCode();
    const token = generateToken(uid, res);
    user.verificationCode = code;
    user.verificationCodeToken = token;
    user.verificationCodeTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const verificationCodeURL = `http://localhost:3000/email-verify/${token}`;

    await user.save();

    await sendVC(user.email, code, verificationCodeURL);

    return res
      .status(200)
      .json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token, verificationCode } = req.body;

    if (!token || !verificationCode) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    const user = await User.findOne({ verificationCodeToken: token });
    if (!user) {
      return res.status(400).json({
        error: "No user found",
      });
    }

    const now = new Date(Date.now());
    if (now > user.verificationCodeTokenExpiresAt) {
      return res.status(401).json({
        error: "Token has expired",
      });
    }

    if (user.verificationCode === verificationCode) {
      user.isVerified = true;
      user.verificationCodeToken = undefined;
      user.verificationCode = undefined;
      user.verificationCodeTokenExpiresAt = undefined;

      await user.save();

      return res.status(200).json({
        message: "Account verified successfully",
      });
    } else {
      return res.status(400).json({
        error: "Invalid verification code",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return;
    }
    const restaurants = await Restaurant.find({
      name: { $regex: query, $options: "i" },
    }).select("name _id");

    const meals = await Menu.find({
      name: { $regex: query, $options: "i" },
    }).select("name _id");

    return res.status(200).json({
      restaurants,
      meals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const updateAdminStatus = async (req, res) => {
  try {
    const { uid, status } = req.body;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(400).json({
        error: "No user found",
      });
    }

    const updateResult = await User.updateOne(
      { _id: user._id },
      { $set: { isAdmin: status } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({
        error:
          "Error while trying to update the status or status was not changed",
      });
    }
    return res.status(200).json({
      message: `${user.firstname} Status Changed`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getAddressDetails = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        error: "No user ID provided",
      });
    }

    const user = await User.findById(uid).select("address");

    if (!user || !user.address) {
      return res.status(400).json({
        error: "You don't have any address yet!",
      });
    }

    return res.status(200).json({
      address: user.address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const picksForYou = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "No user ID provided",
      });
    }

    const orders = await Order.find({ "user.userId": userId }).select(
      "items.restaurantId"
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No past orders found for this user",
      });
    }

    const restaurantIds = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.restaurantId) {
          restaurantIds.push(item.restaurantId);
        }
      });
    });

    const uniqueRestaurantIds = [...new Set(restaurantIds)];

    const restaurants = await Restaurant.find({
      _id: { $in: uniqueRestaurantIds },
    });

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({
        message: "No restaurants found for the past orders",
      });
    }

    const recommendedRestaurants = restaurants.map((restaurant) => ({
      name: restaurant.name,
      rId: restaurant._id,
      brandImg: restaurant.brandImg,
    }));

    const topThreeRestaurants = recommendedRestaurants.slice(0, 3);

    return res.status(200).json({
      recommendedRestaurants: topThreeRestaurants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { uid, lat, lng, apartment, floor, building, name } = req.body;
    if (!uid || !lat || !lng || !apartment || !floor || !building || !name) {
      return res.status(400).json({
        error: "Please fill all feilds",
      });
    }
    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({
        error: "No user found",
      });
    }
    user.address.coordinates.lat = lat || user.address.coordinates.lat;
    user.address.coordinates.lng = lng || user.address.coordinates.lng;
    user.address.apartment = apartment || user.address.apartment;
    user.address.apartment = apartment || user.address.apartment;
    user.address.floor = floor || user.address.floor;
    user.address.building = building || user.address.building;
    user.address.name = name || user.address.name;

    const isUpdated = await user.save();
    if (!isUpdated) {
      return res.status(400).json({
        error: "Error while update address",
      });
    }
    return res.status(200).json({
      message: "Your address updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
