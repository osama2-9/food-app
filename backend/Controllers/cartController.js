import Cart from "../Model/Cart.js";
import MenuItem from "../Model/Menu.js";
import User from "../Model/User.js";

export const addItemToCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Can't add items, missing required fields or items is empty",
      });
    }

    const cartItems = [];

    for (const item of items) {
      const meal = await MenuItem.findById(item.mealId).select(
        "price sizes additions restaurant isOffer offerPrice"
      );

      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      cartItems.push({
        restaurantId: meal.restaurant,
        mealId: item.mealId,
        quantity: item.quantity,
        size: item.size,
        additions: item.additions,
        price: meal.isOffer && meal.offerPrice ? meal.offerPrice : meal.price, // Ensure offerPrice is used if meal is on offer
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

export const removeItem = async (req, res) => {
  try {
    const { itemId, userId } = req.params;

    if (!itemId || !userId) {
      return res.status(400).json({
        error: "Missing required fealids",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: "No user found",
      });
    }
    const findItemInCart = await Cart.findOne({
      userId: userId,
      "items.mealId": itemId,
    });
    if (!findItemInCart) {
      return res.status(404).json({
        error: "Item not found in cart",
      });
    }
    if (findItemInCart) {
      const isDeleted = await findItemInCart.deleteOne();
      if (!isDeleted) {
        return res.status(400).json({
          error: "error while remove item",
        });
      }

      return res.status(200).json({
        error: "Item removed successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "No user found" });
    }

    const carts = await Cart.find({ userId: userId });
    if (!carts || carts.length === 0) {
      return res.status(404).json({ error: "No carts found for this user" });
    }

    const mealIds = carts.reduce((acc, cart) => {
      return acc.concat(cart.items.map((item) => item.mealId));
    }, []);

    // Fetch meals based on the mealIds collected from the cart items
    const mealsDetails = await MenuItem.find({ _id: { $in: mealIds } });

    const allItemsWithDetails = carts.map((cart) => ({
      userId: userId,
      cartId: cart._id,
      items: cart.items.map((item) => {
        const meal = mealsDetails.find(
          (meal) => meal._id.toString() === item.mealId.toString()
        );

        if (!meal) {
          return {
            mealId: item.mealId,
            name: null, 
            price: 0, 
            mealImg: null,
            size: {
              name: item.size ? item.size.name : null,
              price: item.size ? item.size.price : 0,
            },
            additions: item.additions.map((add) => ({
              name: add.name,
              price: add.price,
            })),
            quantity: item.quantity,
          };
        }

        return {
          mealId: item.mealId,
          name: meal.name, 
          price: meal.isOffer && meal.offerPrice ? meal.offerPrice : meal.price, 
          mealImg: meal.mealImg, 
          size: {
            name: item.size.name,
            price: item.size.price,
          },
          additions: item.additions.map((add) => ({
            name: add.name,
            price: add.price,
          })),
          quantity: item.quantity,
        };
      }),
    }));

    return res.status(200).json({ carts: allItemsWithDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
