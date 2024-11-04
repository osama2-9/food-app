import { Request, Response } from 'express';
import User from '../Model/User';
import Cart from '../Model/Cart';
import Order from '../Model/Order';
import Restaurant from '../Model/Restaurant';
import MenuItem from '../Model/Menu';
export const createNewOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "No user found" });
        }

        const cart = await Cart.find({ userId: user._id });
        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "No items found in cart" });
        }

        const cartData = await Promise.all(cart.map(async (data) => {
            const itemsData = await Promise.all(data.items.map(async (item) => {
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
            }));

            return itemsData;
        }));

        const orderItems = cartData.flat();

        const totalAmount = orderItems.reduce((total, item) => {
            const additionsTotal = item.additions.reduce((sum, add) => sum + add.price, 0);
            const sizePrice = item.size.price || 0;

            return total + (item.price * item.quantity) + additionsTotal + (sizePrice * item.quantity);
        }, 0);




        const newOrder = new Order({
            user: {
                userId: user._id,
                name: `${user.firstname} ${user.lastname}`,
                email: user.email,
                phone: user.phone,
            },
            items: orderItems,
            totalAmount,
            orderDate: new Date(Date.now()),
        });

        await newOrder.save();

        return res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const orders = await Order.find();
        if (!orders || orders.length === 0) {
            return res.status(400).json({
                error: "No orders found"
            });
        }

        const orderDataFormat = await Promise.all(orders.map(async (order) => {
            const restaurantIds = order.items.map(item => item.restaurantId);
            const mealIds = order.items.map(item => item.menuItem);

            const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });
            const meals = await MenuItem.find({ _id: { $in: mealIds } });

            const restaurantMap: Record<string, { name: string; email: string; phone: string }> = {};
            restaurants.forEach(r => {
                restaurantMap[r._id.toString()] = {
                    name: r.name,
                    email: r.contact.email,
                    phone: r.contact.phone
                };
            });

            const mealMap: Record<string, string> = {};
            meals.forEach(m => {
                mealMap[m._id.toString()] = m.name;
            });

            const orderItems = order.items.map(item => ({
                restaurantId: item.restaurantId,
                restaurantName: restaurantMap[item.restaurantId.toString()].name,
                restaurantEmail: restaurantMap[item.restaurantId.toString()].email,
                restaurantPhone: restaurantMap[item.restaurantId.toString()].phone,
                mealId: item.menuItem,
                mealName: mealMap[item.menuItem.toString()],
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                additions: item.additions 
            }));

            return {
                orderId: order._id,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                user: order.user, 
                orderItems: orderItems,
                orderStatus:order.status
            };
        }));

        return res.status(200).json(orderDataFormat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};