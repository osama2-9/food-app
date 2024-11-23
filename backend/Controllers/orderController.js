import User from "../Model/User.js";
import Cart from "../Model/Cart.js";
import Order from "../Model/Order.js";
import Restaurant from "../Model/Restaurant.js";
import MenuItem from "../Model/Menu.js";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";
import { actions, messageTypes } from "../Model/Notification.js";
import { io } from "../index.js";
export const createNewOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }

    const address = user.address;
    if (
      !address ||
      !address.name ||
      !address.coordinates ||
      !address.coordinates.lat ||
      !address.coordinates.lng ||
      !address.building ||
      !address.floor ||
      !address.apartment
    ) {
      return res.status(400).json({
        error: `Please update your address in your profile to place your order.`,
      });
    }

    const cart = await Cart.find({ userId: user?._id });
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "No items found in cart" });
    }

    const cartData = await Promise.all(
      cart.map(async (data) => {
        const itemsData = await Promise.all(
          data.items.map(async (item) => {
            const additionsData = item.additions.map((add) => {
              return {
                name: add.name,
                price: add.price,
              };
            });

            return {
              restaurantId: item.restaurantId,
              menuItem: item.mealId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              additions: additionsData,
            };
          })
        );

        return itemsData;
      })
    );

    const orderItems = cartData.flat();

    const totalAmount = orderItems.reduce((total, item) => {
      const additionsTotal = item.additions.reduce(
        (sum, add) => sum + add?.price,
        0
      );
      let sizePrice = item?.size?.price || 0;

      return (
        total +
        item.price * item.quantity +
        additionsTotal +
        sizePrice * item.quantity
      );
    }, 0);

    const newOrder = new Order({
      user: {
        userId: user?._id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      items: orderItems,
      totalAmount,
      orderDate: new Date(Date.now()),
    });
    const orderConfirmation = await createNotification({
      message: "new order created",
      messageType: messageTypes.NEW_ORDER,
      action: actions.CREATE,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      createdAt: Date.now(),
    });

    io.emit('newOrder' ,orderConfirmation)

    await newOrder.save();

    await Cart.deleteMany({ userId: user._id });

    return res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(400).json({
        error: "No orders found",
      });
    }

    const orderDataFormat = await Promise.all(
      orders.map(async (order) => {
        const restaurantIds = order.items.map((item) => item.restaurantId);
        const mealIds = order.items.map((item) => item.menuItem);

        const restaurants = await Restaurant.find({
          _id: { $in: restaurantIds },
        });
        const meals = await MenuItem.find({ _id: { $in: mealIds } });

        const restaurantMap = {};
        restaurants.forEach((r) => {
          if (r) {
            restaurantMap[r._id.toString()] = {
              name: r.name,
              email: r.contact.email,
              phone: r.contact.phone,
            };
          } else {
            console.warn(`Restaurant with ID ${r._id} is missing data`);
          }
        });

        const mealMap = {};
        meals.forEach((m) => {
          if (m) {
            mealMap[m._id.toString()] = m.name;
          } else {
            console.warn(`Meal with ID ${m._id} is missing data`);
          }
        });

        const orderItems = order.items.map((item) => {
          const restaurantName =
            restaurantMap[item.restaurantId.toString()]?.name ||
            "Unknown Restaurant";
          const restaurantEmail =
            restaurantMap[item.restaurantId.toString()]?.email || "N/A";
          const restaurantPhone =
            restaurantMap[item.restaurantId.toString()]?.phone || "N/A";
          const mealName = mealMap[item.menuItem.toString()] || "Unknown Meal";

          return {
            restaurantId: item.restaurantId,
            restaurantName,
            restaurantEmail,
            restaurantPhone,
            mealId: item.menuItem,
            mealName,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            additions: item.additions,
          };
        });

        return {
          orderId: order?._id,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate,
          user: order.user,
          orderItems: orderItems,
          orderStatus: order.status,
          orderAt: order.orderDate,
        };
      })
    );

    return res.status(200).json(orderDataFormat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    let { userId } = req.params;

    userId = userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid userId format",
      });
    }

    const userOrders = await Order.find({ "user.userId": userId });

    if (!userOrders) {
      return res.status(404).json({
        error: "No orders found for this user",
      });
    }

    const ordersDetails = await Promise.all(
      userOrders.map(async (order) => {
        const orderItems = await Promise.all(
          order.items.map(async (item) => {
            const mealData = await MenuItem.findById(item.menuItem);
            const restaurantData = await Restaurant.findById(item.restaurantId);

            let totalPrice = mealData?.isOffer
              ? mealData?.offerPrice
              : mealData?.price || 0;
            if (item.size && item.size.price) totalPrice += item.size.price;
            if (item.additions && item.additions.length > 0) {
              totalPrice += item.additions.reduce(
                (sum, addition) => sum + (addition.price || 0),
                0
              );
            }

            return {
              restaurant: restaurantData
                ? restaurantData.name
                : "Unknown Restaurant",
              meal: mealData ? mealData.name : "Unknown Meal",
              mealId: mealData?._id,
              mealImg: mealData ? mealData.mealImg : "",
              size: item.size
                ? { name: item.size.name, price: item.size.price }
                : null,
              additions: item.additions
                ? item?.additions?.map((add) => ({
                    name: add.name,
                    price: add.price,
                  }))
                : [],
              price: totalPrice.toFixed(2),
            };
          })
        );

        return {
          userId: order.user.userId,
          orderId: order._id,
          status: order.status,
          orderdAt: order.orderDate,
          totalAmount: order.totalAmount,
          items: orderItems,
        };
      })
    );

    return res.status(200).json({
      orders: ordersDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const orderRating = async (req, res) => {
  const { orderId } = req.params;
  const { menuItemId, rating, comment } = req.body;

  try {
    if (!menuItemId || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItem = order.items.find(
      (item) => item.menuItem.toString() === menuItemId
    );
    if (!orderItem) {
      return res.status(404).json({ message: "Menu item not found in order" });
    }

    orderItem.rating = rating;
    orderItem.comment = comment;

    await order.save();

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const totalRatings =
      menuItem.rating * (menuItem.numberOfRatings || 0) + rating;
    const newNumberOfRatings = (menuItem.numberOfRatings || 0) + 1;
    const newAverageRating = totalRatings / newNumberOfRatings;

    menuItem.rating = newAverageRating;
    menuItem.numberOfRatings = newNumberOfRatings;

    await menuItem.save();

    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};
