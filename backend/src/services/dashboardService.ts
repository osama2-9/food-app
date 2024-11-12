import { Request, Response } from 'express';
import Restaurant from "../Model/Restaurant";
import Order from "../Model/Order";

const dashboardOverview = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get Total Restaurants
        const totalRestaurants = await Restaurant.countDocuments();

        // Get Orders Today (from 00:00 of today to the current time)
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // 00:00 of today
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59 of today

        // Fetch orders placed today
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Get Total Sales for All Time (sum of all totalAmount fields for all orders)
        const totalSalesResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' }
                }
            }
        ]);

        // If there are any sales, return the sum, otherwise 0
        const totalSales = totalSalesResult[0] ? totalSalesResult[0].totalSales : 0;

        // Send response
        return res.json({
            totalRestaurants,
            ordersToday,
            totalSales
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

export default dashboardOverview;
