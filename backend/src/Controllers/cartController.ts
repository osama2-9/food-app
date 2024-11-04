import { Request, Response } from "express";
import Cart from "../Model/Cart";
import MenuItem from "../Model/Menu";
import User from "../Model/User";

export const addItemToCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, items } = req.body;

        if (!userId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Can't add items, missing required fields or items is empty",
            });
        }

        const cartItems = [];

        for (const item of items) {
            const meal = await MenuItem.findById(item.mealId).select('price sizes additions restaurant');

            if (!meal) {
                return res.status(404).json({ error: "Meal not found" });
            }


            cartItems.push({
                restaurantId: meal.restaurant,
                mealId: item.mealId,
                quantity: item.quantity,
                size: item.size,
                additions: item.additions,
                price: meal.price
            });


        }

        const newCart = new Cart({
            userId,
            items: cartItems,
        });

        const savedCart = await newCart.save();

        if (!savedCart) {
            return res.status(400).json({
                error: "Error while trying to add items to the cart",
            });
        }

        return res.status(201).json({
            message: "Items added to your cart",
            cart: savedCart,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
export const removeItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { itemId, userId } = req.params


        if (!itemId || !userId) {
            return res.status(400).json({
                error: "Missing required fealids"
            })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                error: "No user found"
            })
        }
        const findItemInCart = await Cart.findOne({ userId: userId, 'items.mealId': itemId })
        if (!findItemInCart) {
            return res.status(404).json({
                error: "Item not found in cart"
            });
        }
        if (findItemInCart) {
            const isDeleted = await findItemInCart.deleteOne()
            if (!isDeleted) {
                return res.status(400).json({
                    error: "error while remove item"
                })
            }

            return res.status(200).json({
                error: "Item removed successfully"
            })

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
        })

    }
}

export const getItems = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "No user found" });
        }

        const carts = await Cart.find({ userId: userId });
        if (!carts) {
            return res.status(404).json({ error: "No carts found for this user" });
        }

        const mealIds = carts.reduce((acc, cart) => {
            return acc.concat(cart.items.map(item => item.mealId));
        }, []);

        const mealsDetails = await MenuItem.find({ _id: { $in: mealIds } });

        const allItemsWithDetails = carts.map(cart => ({
            userId: userId,
            cartId: cart._id,
            items: cart.items.map(item => {
                const meal = mealsDetails.find(meal => meal._id.toString() === item.mealId.toString());
                return {
                    mealId: item.mealId,
                    name: meal ? meal.name : null,
                    price: meal ? meal.price : null,
                    mealImg: meal ? meal.mealImg : null,
                    size: {
                        name: item.size,
                        price: item.size.price
                    },
                    additions: item.additions.map((add) => {
                        return {
                            name: add.name,
                            price: add.price

                        }
                    }),
                    quantity: item.quantity
                };
            }),
        }));

        return res.status(200).json({ carts: allItemsWithDetails });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
