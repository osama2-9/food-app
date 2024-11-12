import { Request, Response } from "express";
import Restaurant from "../Model/Restaurant";
import { v2 as cloudinary } from "cloudinary";
export const create = async (req: Request, res: Response): Promise<any> => {
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

export const deleteRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { rID } = req.body;
    if (!rID) {
      return res.status(400).json({
        error: "Restaurant ID not provided",
      });
    }

    const restaurant = await Restaurant.findById(rID);
    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }

    if (restaurant.brandImg) {
      const imgId = restaurant.brandImg.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(imgId);
    }

    await restaurant.deleteOne();

    return res.status(200).json({
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
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
export const getAllRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    }));

    return res.status(200).json({
      restaurantData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getRestaurantDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.params
    if (!name) {
      return res.status(400).json({
        error: "No restaurent avilable"
      })
    }
    const restaurant = await Restaurant.findOne({ name: name })
    if (!restaurant) {
      return res.status(400).json({
        error: "No restaurnt found"

      })
    }

    return res.status(200).json({
      name: restaurant.name,
      img: restaurant.brandImg,
      type: restaurant.cuisineType
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    })


  }
}
