import Coupon from "../Model/Coupon.js";
import Order from "../Model/Order.js";
import User from "../Model/User.js";
const response = (res, status, error) => {
  return res.status(status).json({
    error: error,
  });
};
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, minOrders, expirationDate } = req.body;

    if (!code || !discountPercentage || !minOrders || !expirationDate) {
      return res.status(400).json({
        error: "Please fill all fields",
      });
    }

    const findSameName = await Coupon.findOne({ code });
    if (findSameName) {
      return res.status(400).json({
        error: "This code already exists",
      });
    }

    const newCouponCode = new Coupon({
      code,
      discountPercentage,
      minOrders,
      expirationDate: new Date(expirationDate),
      isUsed: false,
      createdAt: new Date(),
    });

    await newCouponCode.save();

    return res.status(201).json({
      message: "Coupon created successfully",
      coupon: newCouponCode,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const sendCoupons = async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code });
  if (!coupon) {
    return res.status(400).json({
      error: "No coupon found",
    });
  }
  try {
    const allowedUsers = await Order.aggregate([
      {
        $group: {
          _id: "$user.userId",
          orderCount: { $sum: 1 },
        },
      },
      {
        $match: {
          orderCount: { $gt: coupon.minOrders },
        },
      },
      {
        $project: {
          userId: "$_id",
          _id: 0,
        },
      },
    ]);

    if (allowedUsers.length === 0) {
      return res.status(400).json({
        error: "No users found to send coupon",
      });
    }

    const existingCoupon = await Coupon.findOne({ code: coupon.code });

    let couponToSend;
    if (!existingCoupon) {
      couponToSend = new Coupon({
        code: code,
        discountPercentage: 25,
        minOrders: 3,
        expirationDate: new Date("2024-12-31"),
        isUsed: false,
        createdAt: new Date(),
      });

      couponToSend = await couponToSend.save();
    } else {
      couponToSend = existingCoupon;
    }

    for (let i = 0; i < allowedUsers.length; i++) {
      const userId = allowedUsers[i].userId;

      await User.findByIdAndUpdate(userId, {
        $addToSet: { coupons: couponToSend._id },
      });
    }

    return res.status(201).json({
      message: "Coupons sent successfully and added to user accounts",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    if (!coupons) {
      return res.status(400).json({
        error: "No coupons found",
      });
    }

    const couponsDetails = await Promise.all(
      coupons.map(async (coupon) => {
        const couponIds = coupons.map((coupon) => coupon._id);
        const numberOfUsersHaveCoupon = await User.find({
          coupons: couponIds,
        }).countDocuments();
        if (!numberOfUsersHaveCoupon) {
        }

        return {
          couponId: coupon._id,
          couponCode: coupon.code,
          couponDiscountPercent: coupon.discountPercentage,
          couponMinOrders: coupon.minOrders,
          couponExpirationDate: coupon.expirationDate,
        };
      })
    );

    return res.status(200).json({
      couponsDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!couponId) {
      return res.status(400).json({
        error: "Please select a coupon to delete",
      });
    }

    const findCoupon = await Coupon.findById(couponId);
    if (!findCoupon) {
      return res.status(400).json({
        error: "Coupon not found",
      });
    }

    const usersWithCoupon = await User.find({ coupons: couponId });

    if (usersWithCoupon.length > 0) {
      await User.updateMany(
        { coupons: couponId },
        { $pull: { coupons: couponId } }
      );
    }

    await Coupon.findByIdAndDelete(couponId);

    return res.status(200).json({
      message: "Coupon deleted successfully and removed from users",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, userId } = req.body;
    if (!couponCode) {
      return res.status(400).json({
        error: "Enter a code to apply discount",
      });
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(400).json({
        error: "Invalid coupon code",
      });
    }

    if (coupon.expirationDate < new Date()) {
      return res.status(400).json({
        error: "This coupon has expired",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const ordersNumber = await Order.countDocuments({ "user.userId": userId });
    const isCouponUsed = await Order.findOne({
      "user.userId": userId,
      coupon: coupon._id,
    });
    if (isCouponUsed) {
      return res.status(400).json({
        error: "Sorry you already used the coupon !",
      });
    }

    if (ordersNumber < coupon.minOrders) {
      return res.status(400).json({
        error: `You must have at least ${coupon.minOrders} orders to apply this coupon`,
      });
    }
    await coupon.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { coupons: coupon._id },
    });

    return res.status(200).json({
      message: `Coupon ${coupon.code} applied successfully!`,
      discountPercentage: coupon.discountPercentage,
      couponCode: coupon.code,
      couponId: coupon._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { couponId, code, discountPercentage, minOrders, expirationDate } =
      req.body;
    if (!couponId) {
      response(res, 400, "Please select an coupon to update");
    }
    if (!code || !discountPercentage || !minOrders || !expirationDate) {
      response(res, 400, "Please fill all feilds");
    }
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      response(res, 400, "No coupon found");
    }
    coupon.code = code || coupon.code;
    coupon.discountPercentage = discountPercentage || coupon.discountPercentage;
    coupon.minOrders = minOrders || coupon.minOrders;
    coupon.expirationDate = expirationDate || coupon.expirationDate;
    const isUpdated = await coupon.save();
    if (!isUpdated) {
      response(res, 400, "error while try to update");
    }
    return res.status(200).json({
      message: "Coupon updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
