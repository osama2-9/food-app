import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../Model/Menu";

export const addNewItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, price, restaurantID, additions, sizes } =
      req.body;
    let { mealImg } = req.body;
    if (!name || !description || !price || !restaurantID || !mealImg) {
      return res.status(400).json({
        error: "Please fill all fealids",
      });
    }
    

    const findSameName = await MenuItem.findOne({ name });
    if (findSameName) {
      return res.status(400).json({
        error: "This meanu already addedd",
      });
    }

    if (mealImg) {
      const Img = await cloudinary.uploader.upload(mealImg);
      if (Img) {
        mealImg = Img.secure_url;
      }
    }

    const newMenu = new MenuItem({
      name: name,
      price: price,
      description: description,
      restaurant: restaurantID,
      mealImg: mealImg,
      createdAt: Date.now(),
    });

    const created = await newMenu.save();
    if (created) {
      return res.status(201).json({
        message: "New menu created",
      });
    } else {
      return res.status(404).json({
        error: "Error while create new menu",
      });
    }
  } catch (error) {
    console.log(error);
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
        error: "missing required parametrs",
      });
    }
    const items = await MenuItem.find({ restaurant: restaurantID });
    if (!items) {
      return res.status(400).json({
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
        error: "missing required parametrs",
      });
    }

    const item = await MenuItem.findById(itemID);
    if (!item) {
      return res.status(400).json({
        error: "item not found",
      });
    }

    const isDeleted = await item.deleteOne();
    if (!isDeleted) {
      return res.status(400).json({
        error: "error while try delete this item",
      });
    } else {
      return res.status(200).json({
        message: "item deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
