import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../Model/Menu.js";
import Restaurant from "../Model/Restaurant.js";

export const addNewItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      restaurantID,
      additions,
      sizes,
      mealType,
    } = req.body;
    let { mealImg } = req.body;

    if (!name || !description || !price || !restaurantID || !mealType) {
      return res.status(400).json({
        error: "Please fill all required fields",
      });
    }
console.log(req.body);

    const existingItem = await MenuItem.findOne({ name });
    if (existingItem) {
      return res.status(400).json({
        error: "This menu item is already added",
      });
    }

    try {
      if (mealImg) {
        const imgUploadResponse = await cloudinary.uploader.upload(mealImg);
        mealImg = imgUploadResponse.secure_url;
      }
    } catch (imgError) {
      return res.status(500).json({
        error: "Error uploading image",
      });
    }

    const newMenu = new MenuItem({
      name,
      description,
      price,
      restaurant: restaurantID,
      mealImg: mealImg,
      additions: additions || [],
      sizes: sizes || [],
      createdAt: Date.now(),
      mealType: mealType,
    });

    const created = await newMenu.save();
    return res.status(201).json({
      message: "New menu item created",
      menuItem: created,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    if (!restaurantID) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }
    const items = await MenuItem.find({ restaurant: restaurantID });
    if (!items) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }
    return res.status(200).json({
      items,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    const item = await MenuItem.findById(_id);
    if (!item) {
      return res.status(404).json({
        error: "Item not found",
      });
    }
    if (mealImg) {
      const imgId = item.mealImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    const isDeleted = await item.deleteOne();
    if (!isDeleted) {
      return res.status(400).json({
        error: "Error while trying to delete this item",
      });
    } else {
      return res.status(200).json({
        message: "Item deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const mealDetailes = async (req, res) => {
  try {
    const { mealId } = req.params;
    if (!mealId) {
      return res.status(400).json({
        error: "Missing required params",
      });
    }
    const meal = await MenuItem.findById(mealId);
    if (!meal) {
      return res.status(400).json({
        error: "Meal not found",
      });
    }
    return res.status(200).json({
      meal,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    if (!restaurants || restaurants.length === 0) {
      return res.status(400).json({
        error: "No restaurants found",
      });
    }

    const restaurantIds = restaurants.map((res) => res._id);
    const menu = await MenuItem.find({ restaurant: { $in: restaurantIds } });

    if (!menu || menu.length === 0) {
      return res.status(404).json({
        error: "No menu items found for the restaurants",
      });
    }

    const groupedMenu = restaurants.map((restaurant) => {
      const restaurantMenuItems = menu.filter(
        (item) => item.restaurant.toString() === restaurant._id.toString()
      );

      return {
        restaurant: restaurant.name,
        meals: restaurantMenuItems,
        mealCount: restaurantMenuItems.length,
      };
    });

    return res.status(200).json({
      success: true,
      menu: groupedMenu,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const updateMeal = async (req, res) => {
  try {
    const {
      mealId,
      name,
      description,
      price,
      restaurantID,
      additions,
      sizes,
      mealType,
    } = req.body;
    let { mealImg } = req.body;

    if (!mealId) {
      return res.status(400).json({
        error: "No meal found to update. Please try again.",
      });
    }

    const meal = await MenuItem.findById(mealId);
    if (!meal) {
      return res.status(400).json({
        error: "No meal found.",
      });
    }

    if (mealImg) {
      if (meal.mealImg) {
        try {
          const imgId = meal.mealImg.split("/").pop().split(".")[0];
          const deleteImgResult = await cloudinary.uploader.destroy(imgId);

          if (deleteImgResult.result !== "ok") {
            console.error(
              "Error deleting image from Cloudinary:",
              deleteImgResult
            );
            return res.status(400).json({
              error: "Error while trying to delete the old image.",
            });
          }
        } catch (cloudinaryError) {
          console.error(
            "Error deleting old image from Cloudinary:",
            cloudinaryError
          );
          return res.status(500).json({
            error: "Failed to delete the old image from Cloudinary.",
          });
        }
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(mealImg);
        mealImg = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading new image to Cloudinary:", uploadError);
        return res.status(500).json({
          error: "Failed to upload the new image to Cloudinary.",
        });
      }
    }

    meal.name = name || meal.name;
    meal.price = price || meal.price;
    meal.description = description || meal.description;
    meal.restaurant = restaurantID || meal.restaurant;
    meal.additions = additions || meal.additions;
    meal.sizes = sizes || meal.sizes;
    meal.mealType = mealType || meal.mealType;
    meal.mealImg = mealImg || meal.mealImg; 

    const updatedMeal = await meal.save();
    if (!updatedMeal) {
      return res.status(400).json({
        error: "Error while trying to update the meal.",
      });
    }

    return res.status(200).json({
      message: "Meal updated successfully.",
    });
  } catch (error) {
    console.error("Error during meal update:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};
