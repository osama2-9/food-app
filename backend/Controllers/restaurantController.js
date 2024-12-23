import Restaurant from "../Model/Restaurant.js";
import { v2 as cloudinary } from "cloudinary";
import Menu from "../Model/Menu.js";
import generateRestaurantToken from "../utils/generateRestaurantToken.js";
import Order from "../Model/Order.js";
function hasAuth(req) {
  console.log(req.cookies);
  return req.cookies.rauth !== undefined;
}

export const checkRestaurantAuthuntication = (req, res) => {
  try {
    const isAuthenticated = hasAuth(req);
    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const create = async (req, res) => {
  try {
    const { name, phone, email, cuisineType } = req.body;
    let { brandImg } = req.body;

    if (!name || !phone || !email || !cuisineType || !brandImg) {
      return res.status(400).json({
        error: "Please fill all fields",
      });
    }

    const findDuplicatedData = await Restaurant.findOne({
      $or: [{ name }, { "contact.email": email }, { "contact.phone": phone }],
    });

    if (findDuplicatedData) {
      return res.status(400).json({
        error: "Some data already used. Please add another data.",
      });
    }

    if (brandImg) {
      const brandImgUrl = await cloudinary.uploader.upload(brandImg);
      brandImg = brandImgUrl.secure_url;
    } else {
      return res.status(400).json({
        error: "File not uploaded",
      });
    }

    const newRestaurant = new Restaurant({
      name: name,
      contact: {
        phone: phone,
        email: email,
      },
      cuisineType: cuisineType,
      brandImg: brandImg,
      password: Math.floor(100000 + Math.random() * 900000).toString(),

      createdAt: Date.now(),
    });

    const savedRestaurant = await newRestaurant.save();

    if (savedRestaurant) {
      return res.status(201).json({
        message: "Restaurant created successfully",
        restaurant: savedRestaurant,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  const session = await Restaurant.startSession();
  session.startTransaction();

  try {
    const { rId } = req.body;

    if (!rId) {
      return res.status(400).json({ error: "Restaurant ID not provided." });
    }

    const restaurant = await Restaurant.findById(rId).session(session);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }

    if (restaurant.brandImg) {
      const imgId = restaurant.brandImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Menu.deleteMany({ restaurant: restaurant._id }).session(session);

    await restaurant.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Restaurant and associated meals deleted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting restaurant:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const updateRestaurant = async (req, res) => {
  try {
    const { rID, name, phone, email, cuisineType } = req.body;
    let { brandImg } = req.body;
    if (!rID) {
      return res.status(400).json({
        error: "Restaurant not found",
      });
    }
    const restaurant = await Restaurant.findById(rID);
    if (!restaurant) {
      return res.status(400).json({
        error: "Restaurant not found",
      });
    }

    if (brandImg) {
      if (restaurant.brandImg) {
        const imgId = restaurant.brandImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      }
      const uploadedResponse = await cloudinary.uploader.upload(brandImg);
      restaurant.brandImg = uploadedResponse.secure_url;
    }

    restaurant.name = name || restaurant.name;
    restaurant.contact.phone = phone || restaurant.contact.phone;
    restaurant.contact.email = email || restaurant.contact.email;
    restaurant.cuisineType = cuisineType || restaurant.cuisineType;

    const update = await restaurant.save();
    if (update) {
      return res.status(200).json({
        message: "Restaurant data updated",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getAllRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    if (!restaurants || restaurants.length === 0) {
      return res.status(400).json({
        error: "There's no restaurant available",
      });
    }

    const restaurantData = restaurants.map((r) => ({
      name: r.name,
      cuisineType: r.cuisineType,
      email: r.contact.email,
      phone: r.contact.phone,
      brandImg: r.brandImg,
      rid: r._id,
      rating: r.rating,
    }));

    return res.status(200).json({
      restaurantData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getRestaurantDetails = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({
        error: "No restaurent avilable",
      });
    }
    const restaurant = await Restaurant.findOne({ name: name });
    if (!restaurant) {
      return res.status(400).json({
        error: "No restaurnt found",
      });
    }

    return res.status(200).json({
      name: restaurant.name,
      img: restaurant.brandImg,
      type: restaurant.cuisineType,
      rating: restaurant.rating,
    });
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
        error: "Please fill all fields",
      });
    }

    const findRestaurant = await Restaurant.findOne({ "contact.email": email });

    if (!findRestaurant) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    if (findRestaurant.password !== password) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    generateRestaurantToken(findRestaurant?._id, res);

    return res.status(200).json({
      rid: findRestaurant._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("rauth", null, {
      maxAge: 1,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getRestaurantAnalystic = async (req, res) => {
  try {
    const { rid } = req.params;
    if (!rid) {
      return res.status(400).json({
        error: "No restaurant Id found",
      });
    }
    const restaurant = await Restaurant.findById(rid);

    if (!restaurant) {
      return res.status(400).jsno({
        error: "No restaurant found",
      });
    }
    const orders = await Order.find({ "items.restaurantId": rid });
    let pendingOrders = 0;
    let completedOrders = 0;
    let totalSales = 0;
    const totalOrders = orders.length;

    orders.forEach((order) => {
      if (order.status == "Pending") pendingOrders++;
      if (order.status == "Completed") completedOrders++;

      totalSales += order.totalAmount;
    });

    return res.status(200).json({
      totalOrders,
      completedOrders,
      pendingOrders,
      rating: restaurant.rating,
      totalSales,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getRestaurantOrders = async (req, res) => {
  try {
    const { rid } = req.params;
    if (!rid) {
      return res.status(400).json({
        error: "Missing required params",
      });
    }

    const orders = await Order.find({ "items.restaurantId": rid });
    if (!orders || orders.length === 0) {
      return res.status(400).json({
        error: "No orders found",
      });
    }

    const ordersDetails = await Promise.all(
      orders.map(async (order) => {
        let mealIds = order.items.map((item) => item.menuItem);

        const meals = await Menu.find({ _id: { $in: mealIds } });

        const orderItemsDetails = order.items.map((item) => {
          const meal = meals.find(
            (meal) => meal._id.toString() === item.menuItem.toString()
          );

          const mealPrice = meal ? meal.price : 0;
          const sizePrice = item.size.price || 0;
          const additionsPrice = item.additions.reduce(
            (acc, add) => acc + add.price,
            0
          );

          const totalMealPrice =
            (mealPrice + sizePrice + additionsPrice) * item.quantity;

          return {
            mealName: meal ? meal.name : "Unknown Meal",
            quantity: item.quantity,
            size: item.size.name,
            totalMealPrice,
            additions: item.additions.map((add) => {
              return {
                additionName: add.name,
                additionPrice: add.price,
              };
            }),
          };
        });

        return {
          user: {
            name: order.user.name,
            phone: order.user.phone,
            address: order.user.address,
          },
          orderItems: orderItemsDetails,
          totalAmount: order.totalAmount,
          orderStatus: order.status,
          orderdAt: order.createdAt,
        };
      })
    );

    const currentDate = new Date();
    const last30Days = [...Array(7)].map((_, i) => {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      return day.toISOString().split("T")[0]; 
    });

    const orderVolume = ordersDetails
      .map((order) => {
        const date = new Date(order.orderdAt);

        if (isNaN(date.getTime())) {
          console.error("Invalid date:", order.orderdAt);
          return null;
        }

        let dataFormat = date.toISOString().split("T")[0];
        return dataFormat;
      })
      .filter(Boolean); 

    const orderCountByDate = last30Days.map((date) => {
      const count = orderVolume.filter(
        (orderDate) => orderDate === date
      ).length;
      return { date, count };
    });


    return res.status(200).json({
      orderCountByDate, 
      ordersDetails
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while processing the orders",
    });
  }
};
