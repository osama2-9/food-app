import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../Model/Menu";

export const addNewItem = async (req: Request, res: Response): Promise<any> => {
  try {

    const { name, description, price, restaurantID, additions, sizes } = req.body;
    let { mealImg } = req.body

    if (!name || !description || !price || !restaurantID) {
      return res.status(400).json({
        error: "Please fill all required fields",
      });
    }


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

export const getMenuItems = async (
  req: Request,
  res: Response
): Promise<any> => {
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

export const deleteItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { itemID } = req.body;
    if (!itemID) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    const item = await MenuItem.findById(itemID);
    if (!item) {
      return res.status(404).json({
        error: "Item not found",
      });
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

export const mealDetailes = async (req: Request, res: Response): Promise<any> => {
  try {
    const { mealId } = req.params
    if (!mealId) {
      return res.status(400).json({
        error: "Missing required params"
      })
    }
    const meal = await MenuItem.findById(mealId)
    if (!meal) {
      return res.status(400).json({
        error: "Meal not found"
      })
    }
    return res.status(200).json({
      meal
    })

  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    })
    console.log(error);


  }
}
