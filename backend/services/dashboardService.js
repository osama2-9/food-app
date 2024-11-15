import Restaurant from "../Model/Restaurant.js";
import Order from "../Model/Order.js";
export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $sort: { orderDate: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "restaurants",
          localField: "items.restaurantId",
          foreignField: "_id",
          as: "restaurantDetails",
        },
      },
      { $unwind: "$restaurantDetails" },
      {
        $project: {
          orderId: 1,
          totalAmount: 1,
          orderDate: 1,
          status: 1,
          restaurantName: "$restaurantDetails.name",
          restaurantImg: "$restaurantDetails.brandImg",
        },
      },
    ]);

    if (!orders.length) {
      return res.status(404).json({ error: "No recent orders found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getRecentOrders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const dashboardOverview = async (req, res) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const ordersToday = await Order.countDocuments({
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalSalesResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSales = totalSalesResult[0]?.totalSales || 0;

    return res.json({
      totalRestaurants,
      ordersToday,
      totalSales,
    });
  } catch (error) {
    console.error("Error in dashboardOverview:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTopRestaurtns = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    if (!restaurants.length) {
      return res.status(400).json({ error: "No Restaurants found" });
    }

    const orderCounts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.restaurantId",
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 3 },
    ]);

    const topRestaurantIds = orderCounts.map((order) => order._id);
    const topRestaurants = await Restaurant.find({
      _id: { $in: topRestaurantIds },
    });

    const response = topRestaurants.map((restaurant) => {
      const orderCount =
        orderCounts.find(
          (order) => order._id.toString() === restaurant._id.toString()
        )?.orderCount || 0;

      return {
        restaurantId: restaurant._id,
        name: restaurant.name,
        brandImg: restaurant.brandImg,
        contact: {
          phone: restaurant.contact.phone,
          email: restaurant.contact.email,
        },
        orderCount,
      };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in getTopRestaurants:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
